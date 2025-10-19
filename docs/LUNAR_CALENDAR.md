# Tính Năng Lịch Âm Việt Nam 🌙

Hệ thống chọn ngày theo lịch âm Việt Nam được tích hợp vào ứng dụng, giúp người dùng dễ dàng đặt lịch cho các dịp lễ, tết và sinh nhật theo âm lịch.

## ✨ Tính Năng

### 1. Chuyển Đổi Lịch Âm - Dương Lịch
- Chuyển từ dương lịch sang âm lịch chính xác
- Chuyển từ âm lịch sang dương lịch
- Hỗ trợ tháng nhuận (tháng 13 trong năm nhuận)
- Tính toán chính xác theo thiên văn học

### 2. Component Chọn Ngày Âm Lịch
- Giao diện đẹp, dễ sử dụng
- Chọn ngày, tháng, năm âm lịch
- Xem trước ngày dương lịch tương ứng
- Hiển thị các ngày lễ âm lịch phổ biến
- Hỗ trợ tháng nhuận

### 3. Các Ngày Lễ Âm Lịch
Hệ thống tự động nhận diện và hiển thị các ngày lễ:
- **1/1** - Tết Nguyên Đán
- **15/1** - Tết Nguyên Tiêu (Rằm tháng Giêng)
- **10/3** - Giỗ Tổ Hùng Vương
- **15/4** - Phật Đản (Rằm tháng Tư)
- **5/5** - Tết Đoan Ngọ
- **15/7** - Vu Lan (Rằm tháng Bảy)
- **15/8** - Tết Trung Thu
- **23/12** - Ông Táo chầu trời

## 🚀 Cách Sử Dụng

### Trong Màn Hình Tạo Lịch Trình

1. Mở màn hình **"Thêm lịch trình"**
2. Tìm phần **"Ngày"**
3. Nhấn vào nút **mặt trăng** 🌙 (bên cạnh nút chọn ngày thường)
4. Chọn ngày, tháng, năm âm lịch
5. Nếu là tháng nhuận, tích vào ô **"Tháng nhuận"**
6. Xem ngày dương lịch tương ứng ở phần **Preview**
7. Nhấn **"Xác nhận"**

### Ví Dụ Sử Dụng

#### Đặt Lịch Cho Tết Nguyên Đán
1. Mở lunar date picker
2. Chọn: Ngày **1**, Tháng **1**, Năm hiện tại
3. Hệ thống sẽ hiển thị: "Tết Nguyên Đán" ⭐
4. Nhấn xác nhận → Ngày dương lịch tương ứng sẽ được chọn

#### Đặt Lịch Cho Sinh Nhật Âm Lịch
1. Mở lunar date picker
2. Chọn ngày sinh âm lịch (VD: 15/8)
3. Chọn năm hiện tại hoặc năm tới
4. Nhấn xác nhận

#### Đặt Lịch Cho Tháng Nhuận
1. Mở lunar date picker
2. Chọn ngày và tháng
3. Tích vào ô **"Tháng nhuận"** ✓
4. Nhấn xác nhận

## 📁 Cấu Trúc Code

### 1. `utils/lunarCalendar.ts`
Thư viện chuyển đổi lịch âm - dương lịch

**Các hàm chính:**
- `solarToLunar(dd, mm, yyyy)`: Chuyển dương lịch → âm lịch
- `lunarToSolar(day, month, year, isLeapMonth)`: Chuyển âm lịch → dương lịch
- `formatLunarDate(lunarDate)`: Định dạng hiển thị ngày âm lịch
- `getLunarMonthName(month, isLeapMonth)`: Lấy tên tháng âm lịch
- `isLunarHoliday(day, month)`: Kiểm tra ngày lễ
- `getLunarHolidays()`: Danh sách các ngày lễ

### 2. `components/ui/lunar-date-picker.tsx`
Component UI chọn ngày âm lịch

**Props:**
- `visible: boolean` - Hiển thị/ẩn picker
- `onClose: () => void` - Callback khi đóng
- `onSelect: (date: Date, lunarDate: LunarDate) => void` - Callback khi chọn ngày
- `initialDate?: Date` - Ngày khởi tạo

**Features:**
- 3 scrollable pickers: Ngày, Tháng, Năm
- Preview ngày dương lịch real-time
- Hiển thị ngày lễ tự động
- Toggle tháng nhuận
- Animation mượt mà

### 3. Integration trong `app/task/create.tsx`
- Nút chọn lịch âm (icon mặt trăng)
- Badge hiển thị ngày âm lịch đã chọn
- Tự động cập nhật startTime và endTime

## 🎨 Design & UX

### Màu Sắc
- **Primary**: `#F59E0B` (Vàng cam) - Biểu tượng mặt trăng, ngày lễ
- **Background**: `#FEF3C7` - Nền badge và buttons
- **Text**: `#92400E` - Text trên nền vàng

### Icons
- 🌙 `moon` - Icon chính cho lịch âm
- ⭐ `star` - Đánh dấu ngày lễ
- ✓ `checkbox` - Tháng nhuận
- ➡️ `arrow-forward` - Chuyển đổi âm → dương

### Animation
- Modal slide từ dưới lên
- Smooth picker scrolling
- Badge hiển thị mượt mà

## 🔧 Kỹ Thuật

### Thuật Toán Chuyển Đổi
Sử dụng thuật toán thiên văn học chính xác:
- Tính số ngày Julius (Julian Day Number)
- Tính góc mặt trời (Sun Longitude)
- Xác định tháng âm lịch dựa trên sóc (new moon)
- Tính tháng nhuận dựa trên chu kỳ 19 năm

### Độ Chính Xác
- Hỗ trợ năm: 1900 - 2100
- Múi giờ: GMT+7 (Việt Nam)
- Sai số: < 1 ngày (do thiên văn học)

## 📱 Tương Thích

### Platforms
- ✅ iOS
- ✅ Android
- ✅ Web (Expo)

### React Native Version
- Expo SDK 49+
- React Native 0.72+

## 🎯 Use Cases

### 1. Người Dùng Cá Nhân
- Đặt lịch sinh nhật âm lịch của bản thân và người thân
- Nhắc nhở các ngày lễ truyền thống
- Lên kế hoạch cho Tết, Trung Thu, Vu Lan...

### 2. Doanh Nghiệp
- Lên lịch nghỉ lễ theo âm lịch
- Tổ chức sự kiện theo ngày đẹp
- Marketing theo các dịp lễ truyền thống

### 3. Gia Đình
- Nhắc nhở giỗ chạp
- Tổ chức sinh nhật theo âm lịch
- Các ngày cúng, lễ gia đình

## 🐛 Known Issues & Limitations

1. **Tháng Nhuận**: 
   - Cần người dùng tự xác định tháng nhuận
   - Không tự động detect (do phụ thuộc thiên văn)

2. **Độ Chính Xác**:
   - Có thể sai 1 ngày ở biên giới múi giờ
   - Nên double-check với lịch vạn niên

3. **Performance**:
   - Tính toán có thể mất vài ms với năm xa
   - Đã optimize cho năm gần (1900-2100)

## 🚧 Future Enhancements

- [ ] Tự động detect tháng nhuận
- [ ] Thêm các ngày hoàng đạo, hắc đạo
- [ ] Tích hợp can chi (thiên can, địa chi)
- [ ] Thêm các ngày lễ địa phương
- [ ] Widget hiển thị lịch âm hàng ngày
- [ ] Sync với lịch hệ thống
- [ ] Export/Import events theo lịch âm

## 📚 Tài Liệu Tham Khảo

- Thuật toán chuyển đổi lịch âm dựa trên công thức của Hồ Ngọc Đức
- [Vietnamese Lunar Calendar Algorithm](https://www.informatik.uni-leipzig.de/~duc/amlich/)
- Astronomical Algorithms by Jean Meeus

## 🤝 Contributing

Nếu bạn muốn cải thiện tính năng lịch âm:
1. Thêm các ngày lễ mới
2. Tối ưu thuật toán
3. Cải thiện UI/UX
4. Báo cáo bugs

## 📄 License

Thuật toán lịch âm: Public Domain (Hồ Ngọc Đức)
UI Components: MIT License

---

**Được phát triển với ❤️ cho cộng đồng người Việt**

