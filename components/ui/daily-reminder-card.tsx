import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { DailyReminder, DayOfWeek, DayOfWeekShortLabels } from '@/types/reminder';

interface DailyReminderCardProps {
  reminder: DailyReminder;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (reminder: DailyReminder) => void;
  onDelete: (id: string) => void;
}

export const DailyReminderCard: React.FC<DailyReminderCardProps> = ({
  reminder,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };

  const getDaysText = () => {
    if (reminder.days.length === 7) {
      return 'Hàng ngày';
    }
    if (reminder.days.length === 5 && 
        !reminder.days.includes(DayOfWeek.SATURDAY) && 
        !reminder.days.includes(DayOfWeek.SUNDAY)) {
      return 'Thứ 2 - Thứ 6';
    }
    if (reminder.days.length === 2 && 
        reminder.days.includes(DayOfWeek.SATURDAY) && 
        reminder.days.includes(DayOfWeek.SUNDAY)) {
      return 'Cuối tuần';
    }
    return reminder.days
      .map(day => DayOfWeekShortLabels[day])
      .join(', ');
  };

  return (
    <View style={[styles.container, !reminder.enabled && styles.containerDisabled]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="alarm" 
            size={24} 
            color={reminder.enabled ? '#3B82F6' : '#94A3B8'} 
          />
        </View>

        <View style={styles.info}>
          <View style={styles.timeRow}>
            <Text style={[styles.time, !reminder.enabled && styles.timeDisabled]}>
              {formatTime(reminder.time)}
            </Text>
            <View style={styles.daysContainer}>
              {reminder.days.map((day) => (
                <View 
                  key={day} 
                  style={[
                    styles.dayBadge,
                    reminder.enabled ? styles.dayBadgeActive : styles.dayBadgeInactive
                  ]}
                >
                  <Text 
                    style={[
                      styles.dayBadgeText,
                      reminder.enabled ? styles.dayBadgeTextActive : styles.dayBadgeTextInactive
                    ]}
                  >
                    {DayOfWeekShortLabels[day]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={[styles.daysText, !reminder.enabled && styles.daysTextDisabled]}>
            {getDaysText()}
          </Text>

          {reminder.message && (
            <Text style={[styles.message, !reminder.enabled && styles.messageDisabled]}>
              {reminder.message}
            </Text>
          )}
        </View>

        <View style={styles.controls}>
          <Switch
            value={reminder.enabled}
            onValueChange={(enabled) => onToggle(reminder.id, enabled)}
            trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
            thumbColor={reminder.enabled ? '#3B82F6' : '#CBD5E1'}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(reminder)}
        >
          <Ionicons name="create-outline" size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(reminder.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={[styles.actionButtonText, styles.deleteText]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  containerDisabled: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 8,
  },
  time: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  timeDisabled: {
    color: '#94A3B8',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  dayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dayBadgeActive: {
    backgroundColor: '#DBEAFE',
  },
  dayBadgeInactive: {
    backgroundColor: '#F1F5F9',
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  dayBadgeTextActive: {
    color: '#1E40AF',
  },
  dayBadgeTextInactive: {
    color: '#94A3B8',
  },
  daysText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  daysTextDisabled: {
    color: '#94A3B8',
  },
  message: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  messageDisabled: {
    color: '#94A3B8',
  },
  controls: {
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  deleteText: {
    color: '#EF4444',
  },
});

