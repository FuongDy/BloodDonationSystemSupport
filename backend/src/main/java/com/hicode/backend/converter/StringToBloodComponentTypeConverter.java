package com.hicode.backend.converter;

import com.hicode.backend.entity.BloodComponentType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToBloodComponentTypeConverter implements Converter<String, BloodComponentType> {

    @Override
    public BloodComponentType convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }
        try {
            return BloodComponentType.fromDisplayName(source);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}