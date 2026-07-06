package com.example.backend.controller;

import com.example.backend.config.JwtTokenProvider;
import com.example.backend.model.LoginRequest;
import com.example.backend.model.RegisterRequest;
import com.example.backend.model.entity.User;
import com.example.backend.service.UserService;
import com.example.backend.service.EmailService;
import com.example.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.util.UUID;

import com.example.backend.model.SocialLoginRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại!");
        }

        try {
            User user = new User();
            user.setUsername(req.getUsername());
            user.setPassword(req.getPassword());
            user.setEmail(req.getEmail());
            user.setPhone(req.getPhone());

            // Mặc định là tài khoản thường
            int accountType = (req.getAccountType() != null) ? req.getAccountType() : 1;
            user.setAccountType(accountType);

            if (req.getBirthday() != null && !req.getBirthday().isEmpty()) {
                LocalDate birthday = LocalDate.parse(req.getBirthday(), DateTimeFormatter.ISO_DATE);
                user.setBirthday(birthday);
            }

            userService.saveUser(user);
            return ResponseEntity.ok("Đăng ký thành công!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo người dùng: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Tên đăng nhập hoặc mật khẩu không đúng!");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String jwtToken = jwtTokenProvider.generateToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("accountType", user.getAccountType());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam("email") String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy tài khoản với email này!");
        }

        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);

        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        String emailText = "Bạn đã yêu cầu đặt lại mật khẩu.\n" +
                "Vui lòng click vào link sau để đặt lại mật khẩu: \n" + resetUrl + "\n\n" +
                "Link sẽ hết hạn sau 15 phút.";

        try {
            emailService.sendEmail(user.getEmail(), "Đặt lại mật khẩu", emailText);
            return ResponseEntity.ok("Email đặt lại mật khẩu đã được gửi!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi gửi email: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) {
        String result = userService.validatePasswordResetToken(token);
        if (result != null) {
            if (result.equals("invalidToken")) {
                return ResponseEntity.badRequest().body("Token không hợp lệ!");
            } else if (result.equals("expired")) {
                return ResponseEntity.badRequest().body("Token đã hết hạn!");
            }
        }

        User user = userService.getUserByPasswordResetToken(token);
        if (user != null) {
            userService.changeUserPassword(user, newPassword);
            return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
        } else {
            return ResponseEntity.badRequest().body("Lỗi xác thực người dùng!");
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody SocialLoginRequest request) {
        try {
            String clientId = "135414393317-0pmaq35jbjm27ju50mjgn84tdogaoof9.apps.googleusercontent.com";
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                
                // Find user by email
                User user = userRepository.findByEmail(email).orElse(null);
                
                if (user == null) {
                    // Create new user if not exists
                    user = new User();
                    user.setUsername(email); // Use email as username for Google login
                    user.setEmail(email);
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password
                    user.setAccountType(1); // Default role
                    userService.saveUser(user);
                }

                // Generate JWT
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                String jwtToken = jwtTokenProvider.generateToken(userDetails);

                Map<String, Object> response = new HashMap<>();
                response.put("token", jwtToken);
                response.put("id", user.getId());
                response.put("username", user.getUsername());
                response.put("accountType", user.getAccountType());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google Token");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google login failed: " + e.getMessage());
        }
    }

    @PostMapping("/facebook")
    public ResponseEntity<?> loginWithFacebook(@RequestBody SocialLoginRequest request) {
        try {
            String fbToken = request.getToken();
            String graphUrl = "https://graph.facebook.com/me?fields=id,name,email,picture&access_token=" + fbToken;
            
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> fbUser = restTemplate.getForObject(graphUrl, Map.class);
            
            if (fbUser != null && fbUser.containsKey("id")) {
                String fbId = (String) fbUser.get("id");
                String name = (String) fbUser.get("name");
                
                // Nhiều tài khoản FB đăng ký bằng SĐT sẽ không trả về email.
                // Ta sẽ tạo một email giả định dựa trên ID của Facebook để hệ thống vẫn hoạt động.
                String email = (String) fbUser.get("email");
                if (email == null || email.isEmpty()) {
                    email = fbId + "@facebook.com";
                }
                
                // Find user by email
                User user = userRepository.findByEmail(email).orElse(null);
                
                if (user == null) {
                    // Create new user if not exists
                    user = new User();
                    user.setUsername(email);
                    user.setEmail(email);
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    user.setAccountType(1);
                    userService.saveUser(user);
                }

                // Generate JWT
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                String jwtToken = jwtTokenProvider.generateToken(userDetails);

                Map<String, Object> response = new HashMap<>();
                response.put("token", jwtToken);
                response.put("id", user.getId());
                response.put("username", user.getUsername());
                response.put("accountType", user.getAccountType());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không thể xác thực thông tin từ Facebook.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Facebook login failed: " + e.getMessage());
        }
    }

}
