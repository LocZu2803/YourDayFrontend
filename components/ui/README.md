# Custom UI Components - Notification System

Hệ thống thông báo đẹp và hiện đại thay thế cho Alert mặc định của React Native.

## Components

### 1. CustomAlert

Component alert tùy chỉnh với UI đẹp hơn, hỗ trợ nhiều loại thông báo.

**Features:**
- 4 loại: `success`, `error`, `warning`, `info`
- Icon động theo từng loại
- Hỗ trợ nhiều buttons
- Animation mượt mà
- Design hiện đại với shadow và border-radius

**Usage:**

```tsx
import { CustomAlert } from '@/components/ui/custom-alert';
import { useCustomAlert } from '@/hooks/useCustomAlert';

function MyScreen() {
  const { alert, showAlert, hideAlert } = useCustomAlert();

  const handleAction = () => {
    showAlert(
      'Xác nhận',
      'Bạn có chắc muốn thực hiện hành động này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'OK', style: 'default', onPress: () => console.log('OK') }
      ],
      'warning'
    );
  };

  return (
    <>
      <Button onPress={handleAction} />
      
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        onClose={hideAlert}
      />
    </>
  );
}
```

### 2. Toast

Component toast notification hiển thị ngắn gọn ở đầu màn hình.

**Features:**
- 4 loại: `success`, `error`, `warning`, `info`
- Tự động ẩn sau thời gian quy định
- Animation slide xuống từ trên
- Có thể đóng thủ công
- Design đẹp với màu sắc phù hợp

**Usage:**

```tsx
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/hooks/useToast';

function MyScreen() {
  const { toast, showToast, hideToast } = useToast();

  const handleSuccess = () => {
    showToast('Đã lưu thành công!', 'success');
  };

  const handleError = () => {
    showToast('Có lỗi xảy ra', 'error');
  };

  return (
    <>
      <Button onPress={handleSuccess} />
      <Button onPress={handleError} />
      
      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onHide={hideToast}
      />
    </>
  );
}
```

## Hooks

### useCustomAlert()

Hook để quản lý state của CustomAlert.

**Returns:**
- `alert`: State object chứa thông tin alert
- `showAlert(title, message, buttons, type)`: Function hiển thị alert
- `hideAlert()`: Function ẩn alert

### useToast()

Hook để quản lý state của Toast.

**Returns:**
- `toast`: State object chứa thông tin toast
- `showToast(message, type, duration?)`: Function hiển thị toast
- `hideToast()`: Function ẩn toast

## Notification Types

1. **success** (Xanh lá): Thông báo thành công
2. **error** (Đỏ): Thông báo lỗi
3. **warning** (Vàng): Cảnh báo
4. **info** (Xanh dương): Thông tin

## Best Practices

### Khi nào dùng Alert?
- Yêu cầu xác nhận từ người dùng
- Thông báo quan trọng cần chú ý
- Có nhiều lựa chọn (buttons)

### Khi nào dùng Toast?
- Thông báo nhanh, không cần tương tác
- Feedback cho hành động (lưu, xóa, cập nhật...)
- Thông báo lỗi đơn giản

### Ví dụ

```tsx
// ✅ Tốt: Dùng Alert cho xác nhận xóa
showAlert(
  'Xóa tài khoản',
  'Bạn có chắc muốn xóa?',
  [
    { text: 'Hủy', style: 'cancel' },
    { text: 'Xóa', style: 'destructive', onPress: handleDelete }
  ],
  'warning'
);

// ✅ Tốt: Dùng Toast cho thông báo thành công
showToast('Đã lưu thành công!', 'success');

// ❌ Không tốt: Dùng Toast cho xác nhận quan trọng
showToast('Bạn có muốn xóa?', 'warning'); // Nên dùng Alert
```

## Styling

Các component đều có styling sẵn với design hiện đại. Có thể customize thông qua:
- Props của component
- Modify StyleSheet trong component file
- Theme constants

## Demo

Xem file `app/(tabs)/account.tsx` để xem ví dụ đầy đủ về cách sử dụng cả Alert và Toast trong một màn hình thực tế.

