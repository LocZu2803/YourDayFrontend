/**
 * Utility functions for creating consistent notification messages
 * across the application
 */

export const NotificationMessages = {
  // Success messages
  SUCCESS: {
    PASSWORD_CHANGED: 'Đã thay đổi mật khẩu thành công',
    ACCOUNT_DELETED: 'Tài khoản đã được xóa thành công',
    SAVED: 'Đã lưu thành công',
    UPDATED: 'Đã cập nhật thành công',
    CREATED: 'Đã tạo thành công',
    DELETED: 'Đã xóa thành công',
  },

  // Error messages
  ERROR: {
    GENERIC: 'Đã có lỗi xảy ra. Vui lòng thử lại',
    NETWORK: 'Lỗi kết nối. Vui lòng kiểm tra mạng',
    UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn',
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    VALIDATION: 'Dữ liệu không hợp lệ',
    PASSWORD_INCORRECT: 'Mật khẩu không chính xác',
    LOAD_FAILED: 'Không thể tải dữ liệu',
  },

  // Warning messages
  WARNING: {
    UNSAVED_CHANGES: 'Bạn có thay đổi chưa lưu',
    DELETE_CONFIRM: 'Hành động này không thể hoàn tác',
    LOGOUT_CONFIRM: 'Bạn có chắc muốn đăng xuất?',
  },

  // Info messages
  INFO: {
    LOADING: 'Đang tải...',
    PROCESSING: 'Đang xử lý...',
    NO_DATA: 'Không có dữ liệu',
  },
};

export type NotificationMessageKey = keyof typeof NotificationMessages;

