import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    isLunarHoliday,
    lunarToSolar,
    solarToLunar,
    type LunarDate
} from '@/utils/lunarCalendar';

interface LunarDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date, lunarDate: LunarDate) => void;
  initialDate?: Date;
}

export const LunarDatePicker: React.FC<LunarDatePickerProps> = ({
  visible,
  onClose,
  onSelect,
  initialDate = new Date(),
}) => {
  const [lunarDate, setLunarDate] = useState<LunarDate>(() =>
    solarToLunar(
      initialDate.getDate(),
      initialDate.getMonth() + 1,
      initialDate.getFullYear()
    )
  );

  const [selectedDay, setSelectedDay] = useState(lunarDate.day);
  const [selectedMonth, setSelectedMonth] = useState(lunarDate.month);
  const [selectedYear, setSelectedYear] = useState(lunarDate.year);
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  // Generate years (10 years before and after current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate days (1-30 for lunar calendar)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleConfirm = () => {
    try {
      const solarDate = lunarToSolar(
        selectedDay,
        selectedMonth,
        selectedYear,
        isLeapMonth
      );

      if (solarDate.day === 0) {
        // Invalid date
        alert('Ngày âm lịch không hợp lệ');
        return;
      }

      const resultDate = new Date(
        solarDate.year,
        solarDate.month - 1,
        solarDate.day
      );

      // Set time from initial date
      resultDate.setHours(initialDate.getHours());
      resultDate.setMinutes(initialDate.getMinutes());

      const resultLunarDate: LunarDate = {
        day: selectedDay,
        month: selectedMonth,
        year: selectedYear,
        isLeapMonth,
      };

      onSelect(resultDate, resultLunarDate);
      onClose();
    } catch (error) {
      console.error('Error converting lunar date:', error);
      alert('Có lỗi xảy ra khi chuyển đổi ngày');
    }
  };

  // Check if selected date is a holiday
  const holiday = isLunarHoliday(selectedDay, selectedMonth);

  // Calculate solar date for preview
  let solarPreview = '';
  try {
    const solar = lunarToSolar(selectedDay, selectedMonth, selectedYear, isLeapMonth);
    if (solar.day > 0) {
      solarPreview = `${solar.day}/${solar.month}/${solar.year}`;
    }
  } catch (error) {
    solarPreview = 'Không hợp lệ';
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="moon" size={24} color="#F59E0B" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Chọn ngày âm lịch</Text>
              <Text style={styles.headerSubtitle}>
                Lịch âm Việt Nam
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text style={styles.infoBannerText}>
              Chọn ngày theo lịch âm để đặt lịch cho các dịp lễ, tết
            </Text>
          </View>

          {/* Date Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.previewRow}>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Ngày âm lịch</Text>
                <Text style={styles.previewValue}>
                  {selectedDay}/{selectedMonth}{isLeapMonth ? ' (N)' : ''}/{selectedYear}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#94A3B8" />
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>Dương lịch</Text>
                <Text style={styles.previewValue}>{solarPreview}</Text>
              </View>
            </View>

            {holiday && (
              <View style={styles.holidayBadge}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.holidayText}>{holiday}</Text>
              </View>
            )}
          </View>

          {/* Pickers */}
          <View style={styles.pickersContainer}>
            {/* Day Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Ngày</Text>
              <ScrollView
                style={styles.pickerScroll}
                showsVerticalScrollIndicator={false}
              >
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerItem,
                      selectedDay === day && styles.pickerItemSelected,
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedDay === day && styles.pickerItemTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Month Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Tháng</Text>
              <ScrollView
                style={styles.pickerScroll}
                showsVerticalScrollIndicator={false}
              >
                {months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerItem,
                      selectedMonth === month && styles.pickerItemSelected,
                    ]}
                    onPress={() => setSelectedMonth(month)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedMonth === month && styles.pickerItemTextSelected,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Year Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Năm</Text>
              <ScrollView
                style={styles.pickerScroll}
                showsVerticalScrollIndicator={false}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      selectedYear === year && styles.pickerItemSelected,
                    ]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedYear === year && styles.pickerItemTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Leap Month Toggle */}
          <TouchableOpacity
            style={styles.leapMonthToggle}
            onPress={() => setIsLeapMonth(!isLeapMonth)}
          >
            <View style={styles.leapMonthInfo}>
              <Ionicons
                name={isLeapMonth ? 'checkbox' : 'square-outline'}
                size={24}
                color={isLeapMonth ? '#3B82F6' : '#94A3B8'}
              />
              <View style={styles.leapMonthTextContainer}>
                <Text style={styles.leapMonthText}>Tháng nhuận</Text>
                <Text style={styles.leapMonthSubtext}>
                  Tích nếu tháng này là tháng nhuận
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    gap: 8,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  previewContainer: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewItem: {
    flex: 1,
  },
  previewLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '700',
  },
  holidayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  holidayText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  pickersContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerScroll: {
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerItemSelected: {
    backgroundColor: '#3B82F6',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  leapMonthToggle: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leapMonthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leapMonthTextContainer: {
    flex: 1,
  },
  leapMonthText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  leapMonthSubtext: {
    fontSize: 12,
    color: '#64748B',
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

