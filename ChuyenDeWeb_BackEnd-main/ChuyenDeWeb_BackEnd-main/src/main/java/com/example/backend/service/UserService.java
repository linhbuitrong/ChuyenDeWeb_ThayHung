// service/UserService.java
package com.example.backend.service;

import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.backend.model.entity.User;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // Tạo 1 BCryptPasswordEncoder để mã hóa và so sánh mật khẩu
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

//    @Override
//    public User authenticate(String username, String rawPassword) {
//        // Tìm user theo username
//        User user = userRepository.findByUsername(username).orElse(null);
//        if (user != null) {
//            // So sánh mật khẩu nhập vào đã mã hóa với mật khẩu lưu trong DB
//            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
//                return user;
//            }
//        }
//        return null;
//    }

    public User saveUser(User user) {
        // Mã hóa mật khẩu trước khi lưu
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsername(username);
        String roleName = switch (user.getAccountType()) {
            case 0 -> "ROLE_ADMIN";
            default -> "ROLE_USER";
        };
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );

    }
}
