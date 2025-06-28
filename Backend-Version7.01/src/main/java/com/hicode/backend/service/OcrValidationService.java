package com.hicode.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hicode.backend.dto.FptOcrResponse;
import com.hicode.backend.dto.OcrDataDTO;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OcrValidationService {

    private final String OCR_API_URL = "https://api.fpt.ai/vision/idr/vnm";
    private final String FPT_API_KEY = "P0jPWEU1ryJ2KYt2D6J4Ik0ooLszQX9o";

    public String identifyIdCardSide(MultipartFile image) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("api-key", FPT_API_KEY);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", image.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(OCR_API_URL, requestEntity, String.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                FptOcrResponse response = objectMapper.readValue(responseEntity.getBody(), FptOcrResponse.class);

                if (response != null && response.getErrorCode() == 0 && response.getData() != null && !response.getData().isEmpty()) {
                    OcrDataDTO ocrData = response.getData().get(0);

                    // Sử dụng trường "type" do FPT AI cung cấp để phân biệt chính xác
                    String type = ocrData.getType();
                    if (type != null) {
                        if (type.contains("front")) {
                            return "FRONT";
                        } else if (type.contains("back")) {
                            return "BACK";
                        }
                    }
                } else {
                    throw new RuntimeException("OCR analysis failed: " + (response != null ? response.getErrorMessage() : "Empty response"));
                }
            } else {
                throw new RuntimeException("OCR service returned an error: " + responseEntity.getBody());
            }

        } catch (Exception e) {
            System.err.println("Error calling FPT.AI OCR API: " + e.getMessage());
            throw new RuntimeException("Could not validate image with OCR service.", e);
        }

        return "UNKNOWN";
    }
}