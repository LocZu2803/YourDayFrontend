import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { DailyReminder, DayOfWeek, DayOfWeekShortLabels } from '@/types/reminder';

interface DailyReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    time: string;
    days: DayOfWeek[];
    message: string;
  }) => void;
  editingReminder?: DailyReminder | null;
}

export const DailyReminderModal: React.FC<DailyReminderModalProps> = ({
  visible,
  onClose,
  onSave,
  editingReminder,
}) => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [message, setMessage] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (editingReminder) {
      const [hours, minutes] = editingReminder.time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      setSelectedTime(date);
      setSelectedDays(editingReminder.days);
      setMessage(editingReminder.message);
    } else {
      // Reset to defaults
      const defaultTime = new Date();
      defaultTime.setHours(8, 0, 0, 0);
      setSelectedTime(defaultTime);
      setSelectedDays([]);
      setMessage('');
    }
  }, [editingReminder, visible]);

  const allDays = Object.values(DayOfWeek);

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const selectWeekdays = () => {
    setSelectedDays([
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
    ]);
  };

  const selectWeekend = () => {
    setSelectedDays([DayOfWeek.SATURDAY, DayOfWeek.SUNDAY]);
  };

  const selectAllDays = () => {
    setSelectedDays(allDays);
  };

  const handleSave = () => {
    if (selectedDays.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày');
      return;
    }

    const timeStr = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;

    onSave({
      time: timeStr,
      days: selectedDays,
      message: message.trim() || 'Xem lịch trình hôm nay',
    });

    onClose();
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="alarm" size={24} color="#3B82F6" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>
                {editingReminder ? 'Chỉnh sửa nhắc nhở' : 'Thêm nhắc nhở hàng ngày'}
              </Text>
              <Text style={styles.headerSubtitle}>
                Nhắc bạn xem lịch trình
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Time Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thời gian</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={24} color="#3B82F6" />
                <Text style={styles.timeButtonText}>
                  {selectedTime.getHours().toString().padStart(2, '0')}:
                  {selectedTime.getMinutes().toString().padStart(2, '0')}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Quick Select */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chọn nhanh</Text>
              <View style={styles.quickSelectRow}>
                <TouchableOpacity
                  style={styles.quickSelectButton}
                  onPress={selectAllDays}
                >
                  <Text style={styles.quickSelectText}>Hàng ngày</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickSelectButton}
                  onPress={selectWeekdays}
                >
                  <Text style={styles.quickSelectText}>T2 - T6</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickSelectButton}
                  onPress={selectWeekend}
                >
                  <Text style={styles.quickSelectText}>Cuối tuần</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Days Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chọn ngày</Text>
              <View style={styles.daysGrid}>
                {allDays.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && styles.dayButtonSelected,
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        selectedDays.includes(day) && styles.dayButtonTextSelected,
                      ]}
                    >
                      {DayOfWeekShortLabels[day]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Message */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nội dung thông báo</Text>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Xem lịch trình hôm nay"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={2}
              />
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>

          {/* Time Picker */}
          {showTimePicker && (
            <Modal transparent animationType="fade">
              <View style={styles.pickerModalOverlay}>
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Chọn giờ</Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={styles.pickerDoneButton}>Xong</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="spinner"
                    onChange={onTimeChange}
                    textColor="#1E293B"
                  />
                </View>
              </View>
            </Modal>
          )}
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
    maxHeight: '90%',
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
    backgroundColor: '#EFF6FF',
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
  content: {
    maxHeight: 500,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    gap: 12,
  },
  timeButtonText: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  quickSelectRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickSelectButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  quickSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dayButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
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
  saveButton: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  pickerDoneButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
});

