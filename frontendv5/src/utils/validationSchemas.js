// src/utils/validationSchemas.js
import * as yup from 'yup';

/**
 * Validation schemas for forms using Yup
 * Provides consistent validation rules across the application
 */

// Common validation patterns
const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

// Custom validation methods
const phoneValidation = yup
  .string()
  .matches(PHONE_REGEX, 'Số điện thoại không hợp lệ');

const passwordValidation = yup
  .string()
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
  .matches(
    PASSWORD_REGEX,
    'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
  );

/**
 * User Registration Validation Schema
 */
export const userRegistrationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Họ và tên là bắt buộc')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được quá 100 ký tự')
    .matches(
      /^[a-zA-ZÀ-ỹ\s]+$/,
      'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
    ),

  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),

  password: passwordValidation.required('Mật khẩu là bắt buộc'),

  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu là bắt buộc')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),

  phone: phoneValidation.required('Số điện thoại là bắt buộc'),

  dateOfBirth: yup
    .date()
    .required('Ngày sinh là bắt buộc')
    .max(new Date(), 'Ngày sinh không thể là tương lai')
    .test('age', 'Phải từ 18 tuổi trở lên để hiến máu', function (value) {
      const today = new Date();
      const birth = new Date(value);
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),

  bloodTypeId: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      // Convert empty string to null
      return originalValue === '' ? null : value;
    })
    .positive('Nhóm máu không hợp lệ'),

  address: yup
    .string()
    .required('Địa chỉ là bắt buộc')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(200, 'Địa chỉ không được quá 200 ký tự'),

  agreeTerms: yup
    .boolean()
    .required('Bạn phải đồng ý với điều khoản')
    .oneOf([true], 'Bạn phải đồng ý với điều khoản và chính sách'),
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

  phoneNumber: phoneValidation.required('Số điện thoại là bắt buộc'),

  dateOfBirth: yup
    .date()
    .required('Ngày sinh là bắt buộc')
    .max(new Date(), 'Ngày sinh không thể là tương lai'),

  gender: yup
    .string()
    .required('Giới tính là bắt buộc')
    .oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ'),

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

  contactPhone: phoneValidation.required('Số điện thoại liên hệ là bắt buộc'),

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

  componentType: yup
    .string()
    .required('Loại thành phần là bắt buộc')
    .min(2, 'Loại thành phần phải có ít nhất 2 ký tự')
    .max(50, 'Loại thành phần không được quá 50 ký tự'),

  description: yup.string().max(200, 'Mô tả không được quá 200 ký tự'),
});

/**
 * Donation Appointment Schema
 */
export const donationAppointmentSchema = yup.object().shape({
  donationDate: yup
    .date()
    .required('Ngày hiến máu là bắt buộc')
    .min(new Date(), 'Ngày hiến máu phải là tương lai'),

  timeSlot: yup.string().required('Khung giờ là bắt buộc'),

  location: yup
    .string()
    .required('Địa điểm là bắt buộc')
    .min(5, 'Địa điểm phải có ít nhất 5 ký tự'),

  notes: yup.string().max(500, 'Ghi chú không được quá 500 ký tự'),
});

/**
 * Validate data against a schema
 * @param {Object} data - Data to validate
 * @param {yup.Schema} schema - Yup schema to validate against
 * @returns {Object} - { isValid, errors, validData }
 */
export const validateData = async (data, schema) => {
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
