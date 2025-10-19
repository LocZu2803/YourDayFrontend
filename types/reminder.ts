/**
 * Daily Reminder Types
 * Nhắc nhở hàng ngày cho lịch trình
 */

export interface DailyReminder {
  id: string;
  userId: string;
  enabled: boolean;
  time: string; // Format: "HH:mm" (e.g., "08:00")
  days: DayOfWeek[]; // Which days of the week
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export const DayOfWeekLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'Thứ 2',
  [DayOfWeek.TUESDAY]: 'Thứ 3',
  [DayOfWeek.WEDNESDAY]: 'Thứ 4',
  [DayOfWeek.THURSDAY]: 'Thứ 5',
  [DayOfWeek.FRIDAY]: 'Thứ 6',
  [DayOfWeek.SATURDAY]: 'Thứ 7',
  [DayOfWeek.SUNDAY]: 'Chủ nhật',
};

export const DayOfWeekShortLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'T2',
  [DayOfWeek.TUESDAY]: 'T3',
  [DayOfWeek.WEDNESDAY]: 'T4',
  [DayOfWeek.THURSDAY]: 'T5',
  [DayOfWeek.FRIDAY]: 'T6',
  [DayOfWeek.SATURDAY]: 'T7',
  [DayOfWeek.SUNDAY]: 'CN',
};

export interface CreateDailyReminderRequest {
  time: string;
  days: DayOfWeek[];
  message: string;
}

export interface UpdateDailyReminderRequest {
  id: string;
  enabled?: boolean;
  time?: string;
  days?: DayOfWeek[];
  message?: string;
}

