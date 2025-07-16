// src/utils/validationSchemas.js
import * as yup from 'yup';

/**
 * Validation schemas for forms using Yup
 * Provides consistent validation rules across the application
 */

// Common validation patterns
const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/;

/**
 * User Registration Validation Schema
 * Đồng bộ với backend API requirements
 */
export const userRegistrationSchema = yup.object().shape({
    fullName: yup
        .string()
        .trim()
        .required('👤 Vui lòng nhập họ và tên đầy đủ')
        .min(3, '👤 Họ và tên phải có ít nhất 3 ký tự')
        .max(150, '👤 Họ và tên không được vượt quá 150 ký tự'),

    email: yup
        .string()
        .trim()
        .required('📧 Vui lòng nhập địa chỉ email')
        .email('📧 Định dạng email không hợp lệ (ví dụ: user@domain.com)')
        .max(150, '📧 Email không được vượt quá 150 ký tự'),

    phone: yup
        .string()
        .trim()
        .required('📱 Vui lòng nhập số điện thoại')
        .min(9, '📱 Số điện thoại phải có ít nhất 9 số')
        .max(15, '📱 Số điện thoại không được vượt quá 15 số')
        .matches(
            /^[0-9+\-\s()]+$/,
            '📱 Số điện thoại chỉ được chứa số và ký tự đặc biệt (+, -, space, ())'
        ),

    address: yup
        .string()
        .trim()
        .required('🏠 Vui lòng nhập địa chỉ thường trú')
        .min(10, '🏠 Địa chỉ phải có ít nhất 10 ký tự')
        .max(255, '🏠 Địa chỉ không được vượt quá 255 ký tự'),

    dateOfBirth: yup
        .string()
        .required('📅 Vui lòng nhập ngày sinh')
        .matches(/^\d{2}-\d{2}-\d{4}$/, '📅 Định dạng ngày sinh phải là DD-MM-YYYY'),

    password: yup
        .string()
        .required('🔒 Vui lòng nhập mật khẩu')
        .min(6, '🔒 Mật khẩu phải có ít nhất 6 ký tự')
        .max(100, '🔒 Mật khẩu không được vượt quá 100 ký tự'),

    confirmPassword: yup
        .string()
        .required('🔒 Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('password')], '🔒 Mật khẩu xác nhận không khớp với mật khẩu đã nhập'),

    bloodTypeId: yup.string().nullable(),

    agreeTerms: yup
        .boolean()
        .required('📜 Bạn phải đồng ý với điều khoản sử dụng')
        .oneOf([true], '📜 Vui lòng đọc và đồng ý với điều khoản sử dụng'),
});

/**
 * User Login Validation Schema
 */
export const userLoginSchema = yup.object().shape({
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),

    password: yup
        .string()
        .required('Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

/**
 * OTP Verification Schema
 */
export const otpVerificationSchema = yup.object().shape({
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),

    otp: yup
        .string()
        .required('Mã OTP là bắt buộc')
        .matches(/^\d{6}$/, 'Mã OTP phải có đúng 6 chữ số'),
});

/**
 * User Profile Update Schema
 */
export const userProfileSchema = yup.object().shape({
    fullName: yup
        .string()
        .required('Họ và tên là bắt buộc')
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ và tên không được quá 100 ký tự'),

    phoneNumber: yup
        .string()
        .required('Số điện thoại là bắt buộc')
        .min(9, 'Số điện thoại phải có ít nhất 9 ký tự')
        .max(15, 'Số điện thoại không được vượt quá 15 ký tự')
        .matches(PHONE_REGEX, 'Số điện thoại không hợp lệ'),

    dateOfBirth: yup
        .date()
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null) {
                return null;
            }
            if (typeof originalValue === 'string') {
                const [day, month, year] = originalValue.split('-');
                if (
                    day &&
                    month &&
                    year &&
                    day.length === 2 &&
                    month.length === 2 &&
                    year.length === 4
                ) {
                    return new Date(`${year}-${month}-${day}T00:00:00`);
                }
            }
            return value;
        })
        .nullable()
        .required('Ngày sinh là bắt buộc')
        .max(new Date(), 'Ngày sinh không thể là tương lai'),

    address: yup
        .string()
        .required('Địa chỉ là bắt buộc')
        .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
        .max(200, 'Địa chỉ không được quá 200 ký tự'),

    bloodTypeId: yup
        .number()
        .required('Nhóm máu là bắt buộc')
        .positive('Nhóm máu không hợp lệ'),
});

/**
 * ID Card Upload Validation Schema
 * Sử dụng cho việc upload ảnh CCCD trong user profile
 */
export const idCardUploadSchema = yup.object().shape({
    frontImage: yup
        .mixed()
        .required('Vui lòng tải lên ảnh mặt trước CCCD/CMND')
        .test('fileType', 'Chỉ chấp nhận file ảnh (JPG, PNG)', (value) => {
            if (!value) return false;
            return value.type && value.type.startsWith('image/');
        })
        .test('fileSize', 'File ảnh không được lớn hơn 5MB', (value) => {
            if (!value) return false;
            return value.size <= 5 * 1024 * 1024;
        }),

    backImage: yup
        .mixed()
        .required('Vui lòng tải lên ảnh mặt sau CCCD/CMND')
        .test('fileType', 'Chỉ chấp nhận file ảnh (JPG, PNG)', (value) => {
            if (!value) return false;
            return value.type && value.type.startsWith('image/');
        })
        .test('fileSize', 'File ảnh không được lớn hơn 5MB', (value) => {
            if (!value) return false;
            return value.size <= 5 * 1024 * 1024;
        }),
});

/**
 * Emergency Blood Request Schema
 */
export const emergencyRequestSchema = yup.object().shape({
    patientName: yup
        .string()
        .required('👤 Vui lòng nhập tên bệnh nhân')
        .min(2, '👤 Tên bệnh nhân phải có ít nhất 2 ký tự')
        .max(100, '👤 Tên bệnh nhân không được vượt quá 100 ký tự'),

    bloodTypeId: yup
        .string()
        .required('🩸 Vui lòng chọn nhóm máu cần thiết'),

    quantityInUnits: yup
        .number()
        .required('📊 Vui lòng nhập số lượng máu cần thiết')
        .positive('📊 Số lượng phải lớn hơn 0')
        .max(20, '⚠️ Số lượng không được quá 20 đơn vị máu'),

    urgency: yup
        .string()
        .required('🚨 Vui lòng chọn mức độ khẩn cấp')
        .oneOf(['NORMAL', 'URGENT', 'CRITICAL'], '🚨 Mức độ khẩn cấp không hợp lệ'),

    hospital: yup
        .string()
        .required('🏥 Vui lòng nhập tên bệnh viện')
        .min(5, '🏥 Tên bệnh viện phải có ít nhất 5 ký tự'),

    roomNumber: yup
        .string()
        .max(10, '🏠 Số phòng không được vượt quá 10 ký tự'),

    bedNumber: yup
        .string()
        .max(10, '🛏️ Số giường không được vượt quá 10 ký tự'),

    notes: yup
        .string()
        .max(500, '📝 Ghi chú không được vượt quá 500 ký tự'),
});

/**
 * Donation Request Schema 
 * Cho form yêu cầu hiến máu của user
 */
export const donationRequestSchema = yup.object().shape({
    fullName: yup
        .string()
        .required('⚠️ Vui lòng nhập họ và tên đầy đủ')
        .min(2, '📝 Họ và tên phải có ít nhất 2 ký tự')
        .max(100, '📝 Họ và tên không được vượt quá 100 ký tự'),

    email: yup
        .string()
        .required('📧 Vui lòng nhập địa chỉ email')
        .email('📧 Định dạng email không hợp lệ (ví dụ: user@domain.com)'),

    phone: yup
        .string()
        .required('📱 Vui lòng nhập số điện thoại')
        .min(9, '📱 Số điện thoại phải có ít nhất 9 số')
        .max(15, '📱 Số điện thoại không được vượt quá 15 số')
        .matches(/^[0-9+\-\s()]+$/, '📱 Số điện thoại chỉ được chứa số và ký tự đặc biệt'),

    cccdNumber: yup
        .string()
        .required('🆔 Vui lòng nhập số CCCD/CMND')
        .matches(/^\d{9,12}$/, '🆔 CCCD/CMND phải từ 9-12 chữ số'),

    address: yup
        .string()
        .required('🏠 Vui lòng nhập địa chỉ thường trú')
        .min(10, '🏠 Địa chỉ phải có ít nhất 10 ký tự')
        .max(255, '🏠 Địa chỉ không được vượt quá 255 ký tự'),

    bloodTypeId: yup
        .string()
        .required('🩸 Vui lòng chọn nhóm máu của bạn'),

    notes: yup
        .string()
        .max(500, '📝 Ghi chú không được vượt quá 500 ký tự'),
});

/**
 * Blood Request Schema
 */
export const bloodRequestSchema = yup.object().shape({
    bloodTypeRequired: yup.string().required('Nhóm máu cần thiết là bắt buộc'),

    quantityNeeded: yup
        .number()
        .required('Số lượng cần thiết là bắt buộc')
        .positive('Số lượng phải lớn hơn 0')
        .max(10, 'Số lượng không được quá 10 đơn vị'),

    priority: yup
        .string()
        .required('Mức độ ưu tiên là bắt buộc')
        .oneOf(['NORMAL', 'URGENT', 'EMERGENCY'], 'Mức độ ưu tiên không hợp lệ'),

    neededBy: yup
        .date()
        .required('Thời hạn cần thiết là bắt buộc')
        .min(new Date(), 'Thời hạn phải là tương lai'),

    location: yup
        .string()
        .required('Địa điểm là bắt buộc')
        .min(5, 'Địa điểm phải có ít nhất 5 ký tự')
        .max(200, 'Địa điểm không được quá 200 ký tự'),

    contactPhone: yup
        .string()
        .required('Số điện thoại liên hệ là bắt buộc')
        .min(9, 'Số điện thoại phải có ít nhất 9 ký tự')
        .max(15, 'Số điện thoại không được vượt quá 15 ký tự')
        .matches(PHONE_REGEX, 'Số điện thoại không hợp lệ'),

    contactEmail: yup.string().email('Email liên hệ không hợp lệ'),

    description: yup.string().max(500, 'Mô tả không được quá 500 ký tự'),
});

/**
 * Blog Post Schema
 */
export const blogPostSchema = yup.object().shape({
    title: yup
        .string()
        .required('Tiêu đề là bắt buộc')
        .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
        .max(200, 'Tiêu đề không được quá 200 ký tự'),

    content: yup
        .string()
        .required('Nội dung là bắt buộc')
        .min(50, 'Nội dung phải có ít nhất 50 ký tự')
        .max(10000, 'Nội dung không được quá 10,000 ký tự'),

    summary: yup.string().max(300, 'Tóm tắt không được quá 300 ký tự'),

    imageUrl: yup.string().url('URL hình ảnh không hợp lệ'),

    tags: yup.array().of(yup.string()).max(10, 'Không được có quá 10 tag'),
});

/**
 * Blood Type Schema
 */
export const bloodTypeSchema = yup.object().shape({
    bloodGroup: yup
        .string()
        .required('Nhóm máu là bắt buộc')
        .oneOf(['A', 'B', 'AB', 'O'], 'Nhóm máu không hợp lệ'),

    description: yup.string().max(200, 'Mô tả không được quá 200 ký tự'),
});

/**
 * Donation Appointment Schema
 */
export const donationAppointmentSchema = yup.object().shape({
    processId: yup
        .string()
        .required('🔄 Vui lòng chọn quy trình hiến máu'),

    appointmentDate: yup
        .date()
        .required('📅 Vui lòng chọn ngày hẹn')
        .min(new Date(), '📅 Ngày hẹn phải là hôm nay hoặc tương lai')
        .test('not-too-far', '📅 Ngày hẹn không được quá 6 tháng từ hiện tại', function(value) {
            if (!value) return true;
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
            return value <= sixMonthsFromNow;
        }),

    location: yup
        .string()
        .required('📍 Vui lòng nhập địa điểm thực hiện')
        .min(5, '📍 Địa điểm phải có ít nhất 5 ký tự')
        .max(200, '📍 Địa điểm không được quá 200 ký tự'),

    notes: yup.string().max(500, '📝 Ghi chú không được quá 500 ký tự'),
});

/**
 * Health Check Schema
 * Bỏ range validation - cho phép nhập tự do các giá trị y tế
 */
export const healthCheckSchema = yup.object().shape({
    bloodPressureSystolic: yup
        .number()
        .required('💓 Vui lòng nhập chỉ số huyết áp tâm thu')
        .positive('💓 Huyết áp tâm thu phải lớn hơn 0'),

    bloodPressureDiastolic: yup
        .number()
        .required('💓 Vui lòng nhập chỉ số huyết áp tâm trương')
        .positive('💓 Huyết áp tâm trương phải lớn hơn 0'),

    heartRate: yup
        .number()
        .required('💗 Vui lòng nhập nhịp tim')
        .positive('💗 Nhịp tim phải lớn hơn 0'),

    temperature: yup
        .number()
        .required('🌡️ Vui lòng nhập nhiệt độ cơ thể')
        .positive('🌡️ Nhiệt độ phải lớn hơn 0'),

    weight: yup
        .number()
        .required('⚖️ Vui lòng nhập cân nặng')
        .positive('⚖️ Cân nặng phải lớn hơn 0'),

    hemoglobinLevel: yup
        .number()
        .required('🩸 Vui lòng nhập mức hemoglobin')
        .positive('🩸 Mức hemoglobin phải lớn hơn 0'),

    notes: yup.string().max(500, '📝 Ghi chú không được quá 500 ký tự'),

    isEligible: yup.boolean().required('✅ Vui lòng chọn trạng thái đạt tiêu chuẩn'),
});

/**
 * Blood Collection Schema
 */
export const bloodCollectionSchema = yup.object().shape({
    collectedVolumeMl: yup
        .number()
        .required('💉 Vui lòng nhập thể tích máu thu thập')
        .positive('💉 Thể tích thu thập phải lớn hơn 0')
        .min(100, '⚠️ Thể tích thu thập tối thiểu là 100ml')
        .max(500, '⚠️ Thể tích thu thập tối đa là 500ml'),

    notes: yup.string().max(500, '📝 Ghi chú không được quá 500 ký tự'),
});

/**
 * Validate data against a schema
 * @param {Object} data - Data to validate
 * @param {yup.Schema} schema - Yup schema to validate against
 * @returns {Object} - { isValid, errors, validData }
 */
export const validateData = async(data, schema) => {
    try {
        const validData = await schema.validate(data, { abortEarly: false });
        return {
            isValid: true,
            errors: {},
            validData,
        };
    } catch (error) {
        const errors = {};
        error.inner.forEach(err => {
            errors[err.path] = err.message;
        });

        return {
            isValid: false,
            errors,
            validData: null,
        };
    }
};

/**
 * Create a validation hook for forms
 * @param {yup.Schema} schema - Yup schema
 * @returns {Function} - Validation function
 */
export const createValidator = schema => {
    return async data => validateData(data, schema);
};

/**
 * Enhanced toast message utility for validation errors
 * Provides user-friendly error messages with icons
 */
export const createFormErrorToast = (errors, showToast) => {
    if (!errors || Object.keys(errors).length === 0) return;

    const firstError = Object.values(errors)[0];
    const fieldCount = Object.keys(errors).length;
    
    let message = firstError;
    
    if (fieldCount > 1) {
        message += ` (và ${fieldCount - 1} lỗi khác)`;
    }
    
    showToast('error', message);
};

/**
 * Success messages for common form actions
 */
export const FORM_SUCCESS_MESSAGES = {
    REGISTRATION: '🎉 Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác thực.',
    LOGIN: '👋 Đăng nhập thành công! Chào mừng bạn trở lại.',
    PROFILE_UPDATE: '✅ Cập nhật thông tin cá nhân thành công!',
    DONATION_REQUEST: '💝 Gửi yêu cầu hiến máu thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
    EMERGENCY_REQUEST: '🚨 Tạo yêu cầu khẩn cấp thành công! Hệ thống đang thông báo đến người hiến.',
    APPOINTMENT_CREATED: '📅 Tạo lịch hẹn thành công! Người hiến sẽ nhận được thông báo.',
    HEALTH_CHECK: '💚 Ghi nhận kết quả khám sức khỏe thành công!',
    BLOOD_COLLECTION: '🩸 Ghi nhận thu thập máu thành công! Cảm ơn người hiến máu.',
};

/**
 * Error messages for common form failures
 */
export const FORM_ERROR_MESSAGES = {
    NETWORK_ERROR: '🌐 Lỗi kết nối mạng. Vui lòng kiểm tra và thử lại.',
    SERVER_ERROR: '⚠️ Lỗi máy chủ. Vui lòng thử lại sau.',
    VALIDATION_ERROR: '📝 Vui lòng kiểm tra lại thông tin đã nhập.',
    UNAUTHORIZED: '🔒 Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
    FORBIDDEN: '⛔ Bạn không có quyền thực hiện hành động này.',
    DUPLICATE_EMAIL: '📧 Email này đã được sử dụng. Vui lòng chọn email khác.',
    INVALID_CREDENTIALS: '🔑 Email hoặc mật khẩu không đúng.',
    CCCD_EXISTS: '🆔 Số CCCD/CMND này đã tồn tại trong hệ thống.',
};