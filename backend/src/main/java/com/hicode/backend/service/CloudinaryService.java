package com.hicode.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Tải lên một file dạng byte array lên Cloudinary.
     * @param fileBytes Dữ liệu của file.
     * @param folder Thư mục trên Cloudinary để lưu file.
     * @return URL công khai của file đã tải lên.
     * @throws IOException
     */
    public String upload(byte[] fileBytes, String folder) throws IOException {
        // Tạo một tên file ngẫu nhiên và CÓ ĐUÔI .pdf
        String publicId = folder + "/" + UUID.randomUUID().toString() + ".pdf";

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                fileBytes,
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "resource_type", "raw" // Sử dụng 'raw' cho các file không phải hình ảnh/video
                )
        );

        // Lấy URL an toàn (https)
        return uploadResult.get("secure_url").toString();
    }
}