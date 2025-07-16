package com.hicode.backend.repository.specifications;

import com.hicode.backend.model.entity.User;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class UserSpecifications {

    public static Specification<User> findDonorsWithinRadius(
            double latitude,
            double longitude,
            double radius,
            Integer bloodTypeId) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Điều kiện 1: User sẵn sàng hiến máu
            predicates.add(cb.isTrue(root.get("isReadyToDonate")));

            // Điều kiện 2: Lọc theo nhóm máu (nếu có)
            if (bloodTypeId != null) {
                predicates.add(cb.equal(root.get("bloodType").get("id"), bloodTypeId));
            }

            // Điều kiện 3: Tính toán khoảng cách Haversine
            // Chuyển đổi độ sang radian
            Expression<Double> latRad = cb.function("RADIANS", Double.class, cb.literal(latitude));
            Expression<Double> lonRad = cb.function("RADIANS", Double.class, cb.literal(longitude));
            Expression<Double> userLatRad = cb.function("RADIANS", Double.class, root.get("latitude"));
            Expression<Double> userLonRad = cb.function("RADIANS", Double.class, root.get("longitude"));

            // Phần tính toán bên trong ACOS
            Expression<Double> cosLat = cb.function("COS", Double.class, latRad);
            Expression<Double> cosUserLat = cb.function("COS", Double.class, userLatRad);
            Expression<Double> sinLat = cb.function("SIN", Double.class, latRad);
            Expression<Double> sinUserLat = cb.function("SIN", Double.class, userLatRad);
            Expression<Double> cosLonDiff = cb.function("COS", Double.class, cb.diff(userLonRad, lonRad));

            // a = cos(lat1) * cos(lat2) * cos(lon2 - lon1) + sin(lat1) * sin(lat2)
            Expression<Double> a = cb.sum(
                    cb.prod(cb.prod(cosLat, cosUserLat), cosLonDiff),
                    cb.prod(sinLat, sinUserLat)
            );

            // Xử lý lỗi floating-point cho ACOS
            Expression<Object> safeA = cb.selectCase()
                    .when(cb.greaterThan(a, 1.0), 1.0)
                    .when(cb.lessThan(a, -1.0), -1.0)
                    .otherwise(a);

            // distance = 6371 * acos(a)
            Expression<Double> distance = cb.prod(
                    cb.literal(6371.0),
                    cb.function("ACOS", Double.class, safeA)
            );

            predicates.add(cb.lessThan(distance, radius));

            // Chỉ trả về các kết quả không bị null (đề phòng lỗi tọa độ)
            predicates.add(cb.isNotNull(root.get("latitude")));
            predicates.add(cb.isNotNull(root.get("longitude")));


            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}