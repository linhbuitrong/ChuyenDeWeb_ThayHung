package com.example.backend.service;

import com.cloudinary.Cloudinary;
import com.example.backend.model.entity.Image;
import com.example.backend.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {
    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private ImageRepository imageRepository;

    public Image uploadImage(MultipartFile file) throws IOException {
        // Upload ảnh lên Cloudinary
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                Map.of("upload_preset", "my_unsigned_preset"));

        // Lấy URL và public ID từ Cloudinary
        String url = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        // Lưu thông tin vào MySQL
        Image image = new Image();
        image.setUrl(url);
        image.setPublicId(publicId);

        return imageRepository.save(image);
    }
}
