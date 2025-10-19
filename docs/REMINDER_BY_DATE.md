# Tính năng Nhắc nhở Theo Ngày

## 📅 Tổng quan

Tính năng "Nhắc nhở theo ngày" cho phép người dùng thiết lập nhắc nhở bằng cách chọn:
1. **Trước N ngày** - Nhắc trước 1, 2, 3, hoặc 7 ngày
2. **Ngày cụ thể** - Chọn ngày tháng tùy chỉnh để nhắc nhở

## 🎯 Use Cases

### Trước N ngày
Phù hợp với các sự kiện cần chuẩn bị trước:

**Ví dụ**:
- 📝 **Deadline dự án** (25/10): Chọn "Trước 2 ngày" → Nhắc ngày 23/10
- ✈️ **Chuyến bay** (30/10): Chọn "Trước 1 tuần" → Nhắc ngày 23/10
- 🎟️ **Buổi concert** (15/11): Chọn "Trước 3 ngày" → Nhắc ngày 12/11
- 📚 **Thi cuối kỳ** (20/12): Chọn "Trước 1 tuần" → Nhắc ngày 13/12

### Ngày cụ thể (Tùy chỉnh)
Phù hợp khi bạn muốn chọn chính xác ngày nhắc nhở:

**Ví dụ**:
- 🎂 **Sinh nhật bạn** (25/10): Chọn ngày 20/10 để nhắc mua quà
- 📄 **Nộp thuế** (31/03): Chọn ngày 15/03 để nhắc chuẩn bị giấy tờ
- 🏥 **Khám sức khỏe** (05/11): Chọn ngày 03/11 để nhắc nhịn ăn
- 🎁 **Sự kiện đặc biệt**: Chọn bất kỳ ngày nào phù hợp

## 🎨 UI/UX

### Toggle 3 tabs
```
┌──────────────────────────────────────────────┐
│  [Theo giờ]  [Theo ngày]  [Lặp lại]         │
└──────────────────────────────────────────────┘
```

### Khi chọn "Theo ngày"

#### Dropdown options:
```
┌─────────────────────────────────┐
│  Trước 1 ngày                   │
│  Trước 2 ngày                   │
│  Trước 3 ngày                   │
│  Trước 1 tuần (7 ngày)          │
│  Tùy chỉnh                      │ ← Mở date picker
│  ─────────────────────────      │
│  Hủy                            │
└─────────────────────────────────┘
```

#### Khi chọn "Tùy chỉnh":
- Hiển thị **Date Picker** modal
- Cho phép chọn ngày tháng cụ thể
- Giới hạn: Ngày nhắc nhở phải **trước hoặc bằng** ngày sự kiện
- Hiển thị: "Nhắc vào 23/10/2025"

## 💻 Implementation

### State Management

```typescript
// State cho "Theo ngày"
const [daysBefore, setDaysBefore] = useState<number | undefined>();
const [showDaysBeforeOptions, setShowDaysBeforeOptions] = useState(false);
const [customReminderDate, setCustomReminderDate] = useState<Date | undefined>();
const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
```

### Options

```typescript
const daysBeforeOptions = [
  { label: 'Trước 1 ngày', value: 1 },
  { label: 'Trước 2 ngày', value: 2 },
  { label: 'Trước 3 ngày', value: 3 },
  { label: 'Trước 1 tuần (7 ngày)', value: 7 },
  { label: 'Tùy chỉnh', value: -1 },
];
```

### Xử lý chọn option

```typescript
const handleDaysBeforeSelect = (value: number) => {
  setShowDaysBeforeOptions(false);
  if (value === -1) {
    // Hiển thị date picker cho tùy chỉnh
    setTimeout(() => {
      setShowCustomDatePicker(true);
    }, 200);
  } else {
    // Chọn số ngày cố định
    setDaysBefore(value);
    setCustomReminderDate(undefined);
  }
};
```

### Xử lý chọn ngày tùy chỉnh

```typescript
const handleCustomDateSelect = () => {
  if (customReminderDate) {
    setDaysBefore(undefined);
    setShowCustomDatePicker(false);
  }
};
```

### Hiển thị label

```typescript
const getDaysBeforeLabel = () => {
  if (customReminderDate) {
    return `Nhắc vào ${formatDate(customReminderDate)}`;
  }
  if (!daysBefore) return 'Chọn ngày nhắc nhở';
  if (daysBefore === 1) return 'Trước 1 ngày';
  if (daysBefore === 2) return 'Trước 2 ngày';
  if (daysBefore === 3) return 'Trước 3 ngày';
  if (daysBefore === 7) return 'Trước 1 tuần (7 ngày)';
  return `Trước ${daysBefore} ngày`;
};
```

### Date Picker Modal

```tsx
{showCustomDatePicker && (
  <Modal transparent={true} animationType="fade">
    <View style={styles.pickerModalOverlay}>
      <View style={styles.pickerModalContainer}>
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerTitle}>Chọn ngày nhắc nhở</Text>
          <TouchableOpacity onPress={handleCustomDateSelect}>
            <Text style={styles.pickerDoneButton}>Xong</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          value={customReminderDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setCustomReminderDate(selectedDate);
            }
          }}
          textColor="#1E293B"
          maximumDate={startTime} // Giới hạn: không được sau ngày sự kiện
        />
      </View>
    </View>
  </Modal>
)}
```

## 🔄 Luồng hoạt động

### 1. Người dùng tạo/sửa lịch trình

```
Tạo lịch trình mới
    ↓
Nhập thông tin (tiêu đề, ngày giờ, v.v.)
    ↓
Đến phần "Nhắc nhở"
    ↓
Chọn tab "Theo ngày"
```

### 2. Chọn "Trước N ngày"

```
Nhấn vào "Chọn ngày nhắc nhở"
    ↓
Dropdown hiển thị options
    ↓
Chọn "Trước 2 ngày"
    ↓
Label hiển thị: "Trước 2 ngày"
    ↓
Lưu lịch trình
```

### 3. Chọn "Tùy chỉnh"

```
Nhấn vào "Chọn ngày nhắc nhở"
    ↓
Dropdown hiển thị options
    ↓
Chọn "Tùy chỉnh"
    ↓
Date Picker modal hiển thị
    ↓
Chọn ngày (ví dụ: 23/10/2025)
    ↓
Nhấn "Xong"
    ↓
Label hiển thị: "Nhắc vào 23/10/2025"
    ↓
Lưu lịch trình
```

## 🎯 Validation

### Giới hạn ngày
- Ngày nhắc nhở phải **≤** ngày sự kiện
- Sử dụng `maximumDate={startTime}` trong DateTimePicker
- Ngăn người dùng chọn ngày sau sự kiện

### Ví dụ:
- Sự kiện: **25/10/2025**
- Có thể chọn: 01/10, 20/10, 24/10, 25/10 ✅
- Không thể chọn: 26/10, 30/10, 01/11 ❌

## 🎨 Styling

### Modal overlay
```typescript
pickerModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
}
```

### Modal container
```typescript
pickerModalContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  margin: 20,
  minWidth: 300,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 20,
  elevation: 10,
}
```

## 📱 Platform Support

- ✅ **iOS**: Native spinner picker
- ✅ **Android**: Native date picker
- ✅ **Web**: Browser date input

## 🚀 Tương lai

### Tính năng có thể mở rộng:

1. **Multiple Custom Dates**
   - Cho phép chọn nhiều ngày nhắc nhở
   - Ví dụ: Nhắc vào 20/10, 23/10, và 24/10

2. **Smart Suggestions**
   - AI gợi ý ngày nhắc dựa trên loại sự kiện
   - VD: "Chuyến bay" → Tự động gợi ý nhắc trước 1 ngày

3. **Recurring Custom Dates**
   - Nhắc vào ngày X hàng tháng
   - Ví dụ: Mỗi ngày 1, 15 trong tháng

4. **Time with Custom Date**
   - Cho phép chọn cả ngày và giờ
   - Ví dụ: "Nhắc vào 23/10 lúc 9:00 AM"

## ✨ Benefits

1. **Linh hoạt**: Chọn ngày cố định hoặc ngày tùy chỉnh
2. **Trực quan**: UI rõ ràng, dễ sử dụng
3. **An toàn**: Validation ngăn chọn ngày không hợp lệ
4. **Nhất quán**: Design system thống nhất
5. **Responsive**: Hoạt động tốt trên mọi platform

## 📝 Files Changed

✅ `app/task/create.tsx` - Thêm custom date picker  
✅ `app/task/edit/[id].tsx` - Thêm custom date picker  
✅ `docs/REMINDER_BY_DATE.md` - Tài liệu chi tiết  

---

**Version**: 2.1  
**Last Updated**: 19/10/2025  
**Feature**: Nhắc nhở theo ngày với tùy chỉnh date picker

