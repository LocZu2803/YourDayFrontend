import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { CustomAlert } from '@/components/ui/custom-alert';
import { DailyReminderCard } from '@/components/ui/daily-reminder-card';
import { DailyReminderModal } from '@/components/ui/daily-reminder-modal';
import { Toast } from '@/components/ui/toast';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { useToast } from '@/hooks/useToast';
import { DailyReminder, DayOfWeek } from '@/types/reminder';

export default function DailyRemindersScreen() {
  const { alert, showAlert, hideAlert } = useCustomAlert();
  const { toast, showToast, hideToast } = useToast();

  // Mock data - Replace with actual API calls
  const [reminders, setReminders] = useState<DailyReminder[]>([
    {
      id: '1',
      userId: 'user1',
      enabled: true,
      time: '08:00',
      days: [
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY,
      ],
      message: 'Xem lịch trình hôm nay',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<DailyReminder | null>(null);

  const handleToggle = useCallback((id: string, enabled: boolean) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled } : r))
    );
    showToast(
      enabled ? 'Đã bật nhắc nhở' : 'Đã tắt nhắc nhở',
      enabled ? 'success' : 'info'
    );
  }, []);

  const handleEdit = useCallback((reminder: DailyReminder) => {
    setEditingReminder(reminder);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    showAlert(
      'Xóa nhắc nhở',
      'Bạn có chắc muốn xóa nhắc nhở này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setReminders(prev => prev.filter(r => r.id !== id));
            showToast('Đã xóa nhắc nhở', 'success');
          },
        },
      ],
      'warning'
    );
  }, []);

  const handleSave = useCallback(
    (data: { time: string; days: DayOfWeek[]; message: string }) => {
      if (editingReminder) {
        // Update existing
        setReminders(prev =>
          prev.map(r =>
            r.id === editingReminder.id
              ? {
                  ...r,
                  time: data.time,
                  days: data.days,
                  message: data.message,
                  updatedAt: new Date(),
                }
              : r
          )
        );
        showToast('Đã cập nhật nhắc nhở', 'success');
      } else {
        // Create new
        const newReminder: DailyReminder = {
          id: Date.now().toString(),
          userId: 'user1',
          enabled: true,
          time: data.time,
          days: data.days,
          message: data.message,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setReminders(prev => [...prev, newReminder]);
        showToast('Đã thêm nhắc nhở mới', 'success');
      }

      setEditingReminder(null);
      setShowModal(false);
    },
    [editingReminder]
  );

  const handleAddNew = () => {
    setEditingReminder(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingReminder(null);
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Nhắc nhở hàng ngày</Text>
          <Text style={styles.headerSubtitle}>
            Nhắc bạn xem lịch trình mỗi ngày
          </Text>
        </View>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color="#3B82F6" />
        <Text style={styles.infoBannerText}>
          Thiết lập nhắc nhở hàng ngày để không bỏ lỡ các lịch trình quan trọng
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alarm-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Chưa có nhắc nhở</Text>
            <Text style={styles.emptyText}>
              Thêm nhắc nhở hàng ngày để luôn nhớ xem lịch trình
            </Text>
            <TouchableOpacity style={styles.addButtonLarge} onPress={handleAddNew}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonLargeText}>Thêm nhắc nhở đầu tiên</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {reminders.map((reminder) => (
              <DailyReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}

            {/* Add More Button */}
            <TouchableOpacity style={styles.addMoreButton} onPress={handleAddNew}>
              <Ionicons name="add-circle" size={24} color="#3B82F6" />
              <Text style={styles.addMoreButtonText}>Thêm nhắc nhở mới</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Floating Add Button (when has reminders) */}
      {reminders.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleAddNew}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <DailyReminderModal
        visible={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingReminder={editingReminder}
      />

      {/* Toast */}
      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onHide={hideToast}
      />

      {/* Alert */}
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  addButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonLargeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    borderStyle: 'dashed',
    marginTop: 12,
    gap: 8,
  },
  addMoreButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

