# Tính năng Nhắc nhở theo Ngày

## Tổng quan

Tính năng nhắc nhở theo ngày cho phép người dùng thiết lập nhắc nhở lịch trình theo hai cách:

1. **Nhắc nhở theo giờ** - Nhắc nhở trước một khoảng thời gian cụ thể (5 phút, 10 phút, 1 giờ, v.v.)
2. **Nhắc nhở theo ngày** - Nhắc nhở lặp lại vào các ngày cụ thể trong tuần

## Các thành phần

### 1. Quản lý Nhắc nhở Hàng ngày

**Màn hình**: `app/reminders/daily.tsx`

Màn hình này cho phép người dùng:
- Xem danh sách các nhắc nhở hàng ngày đã thiết lập
- Bật/tắt các nhắc nhở
- Thêm nhắc nhở mới
- Chỉnh sửa nhắc nhở hiện có
- Xóa nhắc nhở

**Truy cập**: Từ màn hình Tài khoản → "Nhắc nhở hàng ngày"

### 2. Nhắc nhở trong Lịch trình

**Màn hình**: 
- `app/task/create.tsx` - Tạo lịch trình mới
- `app/task/edit/[id].tsx` - Chỉnh sửa lịch trình

Trong phần "Nhắc nhở", người dùng có thể chọn 3 loại nhắc nhở:

#### 1. Nhắc nhở theo giờ (Theo giờ)
Nhắc nhở trước thời gian sự kiện:
- Đúng giờ
- 5 phút trước
- 10 phút trước
- 15 phút trước
- 30 phút trước
- 1 giờ trước
- Tùy chỉnh (chọn thời gian bất kỳ)

#### 2. Nhắc nhở trước N ngày (Trước N ngày)
Nhắc nhở trước ngày diễn ra sự kiện:
- Trước 1 ngày
- Trước 2 ngày
- Trước 3 ngày
- Trước 1 tuần (7 ngày)
- Tùy chỉnh (chọn số ngày bất kỳ)

#### 3. Nhắc nhở lặp lại (Lặp lại)
Nhắc nhở lặp lại vào các ngày trong tuần:
- Chọn các ngày trong tuần cụ thể
- Nút chọn nhanh:
  - **Hàng ngày** - Tất cả 7 ngày
  - **T2 - T6** - Các ngày trong tuần làm việc
  - **Cuối tuần** - Thứ 7 và Chủ nhật

## Các kiểu dữ liệu

**File**: `types/reminder.ts`

```typescript
// Các ngày trong tuần
export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

// Nhắc nhở hàng ngày
export interface DailyReminder {
  id: string;
  userId: string;
  enabled: boolean;
  time: string; // HH:mm format
  days: DayOfWeek[];
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## UI Components

### 1. DailyReminderCard
**File**: `components/ui/daily-reminder-card.tsx`

Hiển thị thông tin một nhắc nhở hàng ngày:
- Thời gian nhắc nhở
- Các ngày được chọn (hiển thị dưới dạng badges)
- Nội dung thông báo
- Công tắc bật/tắt
- Nút chỉnh sửa và xóa

### 2. DailyReminderModal
**File**: `components/ui/daily-reminder-modal.tsx`

Modal để tạo/chỉnh sửa nhắc nhở hàng ngày:
- Chọn thời gian (time picker)
- Chọn nhanh (Hàng ngày, T2-T6, Cuối tuần)
- Chọn ngày cụ thể (grid view các ngày trong tuần)
- Nhập nội dung thông báo
- Nút Lưu và Hủy

## Luồng hoạt động

### Tạo Nhắc nhở Hàng ngày

1. Người dùng vào **Tài khoản** → **Nhắc nhở hàng ngày**
2. Nhấn nút **Thêm nhắc nhở** (FAB hoặc button)
3. Modal hiển thị:
   - Chọn thời gian nhắc nhở
   - Chọn các ngày trong tuần
   - Nhập nội dung thông báo (mặc định: "Xem lịch trình hôm nay")
4. Nhấn **Lưu**
5. Nhắc nhở được thêm vào danh sách

### Thiết lập Nhắc nhở cho Lịch trình

1. Người dùng tạo hoặc chỉnh sửa lịch trình
2. Trong phần **Nhắc nhở**, có 3 tab để chọn:
   - **Theo giờ** - Nhắc trước thời gian sự kiện
   - **Trước N ngày** - Nhắc trước ngày diễn ra
   - **Lặp lại** - Nhắc lặp lại theo ngày trong tuần
   
   **Nếu chọn "Theo giờ"**:
   - Chọn một trong các tùy chọn có sẵn (5 phút, 10 phút, 1 giờ, v.v.)
   - Hoặc chọn "Tùy chỉnh" để chọn thời gian cụ thể
   
   **Nếu chọn "Trước N ngày"**:
   - Chọn số ngày trước (1 ngày, 2 ngày, 3 ngày, 7 ngày)
   - Hoặc chọn "Tùy chỉnh" để nhập số ngày tùy ý
   - Ví dụ: Sự kiện ngày 20, chọn "Trước 2 ngày" → Nhắc vào ngày 18
   
   **Nếu chọn "Lặp lại"**:
   - Nhấn vào nút chọn ngày
   - Picker hiển thị với các tùy chọn chọn nhanh và grid ngày
   - Chọn các ngày cụ thể muốn nhắc lặp lại
   - Nhấn "Xong"
3. Lưu lịch trình

## Trạng thái và Xử lý

### State Management

```typescript
// Loại nhắc nhở - 3 loại
const [reminderType, setReminderType] = useState<'time' | 'weekday' | 'days-before'>('time');

// Nhắc nhở theo giờ
const [reminderTime, setReminderTime] = useState<Date | undefined>();

// Nhắc nhở trước N ngày
const [daysBefore, setDaysBefore] = useState<number | undefined>();
const [showDaysBeforeOptions, setShowDaysBeforeOptions] = useState(false);

// Nhắc nhở lặp lại theo ngày trong tuần
const [reminderWeekdays, setReminderWeekdays] = useState<DayOfWeek[]>([]);
const [showWeekdayPicker, setShowWeekdayPicker] = useState(false);
```

### Các hàm helper

#### Cho nhắc nhở trước N ngày

```typescript
const daysBeforeOptions = [
  { label: 'Trước 1 ngày', value: 1 },
  { label: 'Trước 2 ngày', value: 2 },
  { label: 'Trước 3 ngày', value: 3 },
  { label: 'Trước 1 tuần (7 ngày)', value: 7 },
  { label: 'Tùy chỉnh', value: -1 },
];

const handleDaysBeforeSelect = (value: number) => {
  setShowDaysBeforeOptions(false);
  if (value === -1) {
    // Có thể mở rộng để cho phép nhập số ngày tùy chỉnh
    setDaysBefore(1);
  } else {
    setDaysBefore(value);
  }
};

const getDaysBeforeLabel = () => {
  if (!daysBefore) return 'Chọn số ngày trước';
  if (daysBefore === 1) return 'Trước 1 ngày';
  if (daysBefore === 2) return 'Trước 2 ngày';
  if (daysBefore === 3) return 'Trước 3 ngày';
  if (daysBefore === 7) return 'Trước 1 tuần (7 ngày)';
  return `Trước ${daysBefore} ngày`;
};
```

#### Cho nhắc nhở lặp lại theo ngày

```typescript
// Toggle chọn ngày
const toggleWeekday = (day: DayOfWeek) => {
  if (reminderWeekdays.includes(day)) {
    setReminderWeekdays(reminderWeekdays.filter(d => d !== day));
  } else {
    setReminderWeekdays([...reminderWeekdays, day]);
  }
};

// Chọn nhanh các ngày làm việc
const selectWeekdays = () => {
  setReminderWeekdays([
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ]);
};

// Chọn cuối tuần
const selectWeekend = () => {
  setReminderWeekdays([DayOfWeek.SATURDAY, DayOfWeek.SUNDAY]);
};

// Chọn tất cả các ngày
const selectAllDays = () => {
  setReminderWeekdays(Object.values(DayOfWeek));
};

// Hiển thị label cho nhắc nhở theo ngày
const getWeekdayReminderLabel = () => {
  if (reminderWeekdays.length === 0) return 'Chọn ngày nhắc nhở';
  if (reminderWeekdays.length === 7) return 'Nhắc mỗi ngày';
  if (reminderWeekdays.length === 5 && 
      !reminderWeekdays.includes(DayOfWeek.SATURDAY) && 
      !reminderWeekdays.includes(DayOfWeek.SUNDAY)) {
    return 'Nhắc T2 - T6';
  }
  if (reminderWeekdays.length === 2 && 
      reminderWeekdays.includes(DayOfWeek.SATURDAY) && 
      reminderWeekdays.includes(DayOfWeek.SUNDAY)) {
    return 'Nhắc cuối tuần';
  }
  return reminderWeekdays.map(d => DayOfWeekShortLabels[d]).join(', ');
};
```

## Tích hợp API

### Endpoints (Dự kiến)

```typescript
// API endpoints cho daily reminders
DAILY_REMINDERS: {
  LIST: '/reminders/daily',           // GET - Lấy danh sách
  CREATE: '/reminders/daily',          // POST - Tạo mới
  UPDATE: '/reminders/daily/:id',      // PUT - Cập nhật
  DELETE: '/reminders/daily/:id',      // DELETE - Xóa
  TOGGLE: '/reminders/daily/:id/toggle' // PATCH - Bật/tắt
}
```

### Request/Response

**Tạo nhắc nhở**:
```json
POST /reminders/daily
{
  "time": "08:00",
  "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "message": "Xem lịch trình hôm nay"
}
```

**Response**:
```json
{
  "id": "uuid",
  "userId": "user-id",
  "enabled": true,
  "time": "08:00",
  "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "message": "Xem lịch trình hôm nay",
  "createdAt": "2025-10-19T...",
  "updatedAt": "2025-10-19T..."
}
```

## Ví dụ sử dụng

**Theo giờ**:
- ⏰ **Cuộc họp 10:00 AM**: Nhắc "15 phút trước" → Nhắc lúc 9:45 AM
- 🎂 **Sinh nhật bạn 6:00 PM**: Nhắc "1 giờ trước" → Nhắc lúc 5:00 PM

**Trước N ngày**:
- 📝 **Deadline dự án 25/10**: Nhắc "Trước 2 ngày" → Nhắc ngày 23/10
- ✈️ **Chuyến bay 30/10**: Nhắc "Trước 1 tuần" → Nhắc ngày 23/10
- 🎟️ **Concert 15/11**: Nhắc "Trước 3 ngày" → Nhắc ngày 12/11

**Lặp lại**:
- 📅 **Họp team hàng tuần**: Chọn "T2" → Nhắc mỗi thứ 2
- 💪 **Tập gym**: Chọn "T2, T4, T6" → Nhắc vào các ngày tập
- 🏃 **Chạy bộ cuối tuần**: Chọn "Cuối tuần" → Nhắc T7, CN
- 📚 **Học hàng ngày**: Chọn "Hàng ngày" → Nhắc mỗi ngày

## Styling

Tất cả các component sử dụng styling nhất quán với hệ thống màu:

- **Primary Blue**: `#3B82F6`
- **Background**: `#F8FAFC`
- **Border**: `#E2E8F0`
- **Text**: `#1E293B` (dark), `#64748B` (medium)
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

## Tương lai

### Tính năng có thể mở rộng:

1. **Push Notifications**
   - Tích hợp với Expo Notifications
   - Gửi thông báo push cho các nhắc nhở theo lịch

2. **Smart Reminders**
   - Nhắc nhở dựa trên vị trí
   - Nhắc nhở dựa trên thời tiết
   - Nhắc nhở dựa trên lịch trình trước đó

3. **Nhắc nhở nâng cao**
   - Nhắc nhở theo tháng (ngày 1, ngày 15, v.v.)
   - Nhắc nhở theo quý
   - Nhắc nhở theo lịch âm

4. **Tùy chỉnh âm thanh**
   - Chọn âm thanh nhắc nhở
   - Chọn mức độ ưu tiên
   - Snooze options

## Ghi chú kỹ thuật

- Hiện tại dữ liệu được lưu tạm trong state (mock data)
- Cần tích hợp với backend API để persist data
- Cần implement push notifications để thông báo thực tế
- Cân nhắc sử dụng local notifications khi app đang mở
