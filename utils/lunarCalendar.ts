/**
 * Vietnamese Lunar Calendar Utilities
 * Chuyển đổi giữa dương lịch và âm lịch Việt Nam
 */

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

// Hằng số
const PI = Math.PI;

// Tính số ngày Julius từ ngày dương lịch
function jdFromDate(dd: number, mm: number, yy: number): number {
  let a = Math.floor((14 - mm) / 12);
  let y = yy + 4800 - a;
  let m = mm + 12 * a - 3;
  let jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  if (jd < 2299161) {
    jd =
      dd +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      32083;
  }
  return jd;
}

// Chuyển từ số ngày Julius sang ngày dương lịch
function jdToDate(jd: number): SolarDate {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  let d = Math.floor((4 * c + 3) / 1461);
  let e = c - Math.floor((1461 * d) / 4);
  let m = Math.floor((5 * e + 2) / 153);
  let day = e - Math.floor((153 * m + 2) / 5) + 1;
  let month = m + 3 - 12 * Math.floor(m / 10);
  let year = b * 100 + d - 4800 + Math.floor(m / 10);
  return { day, month, year };
}

// Tính góc mặt trời
function getSunLongitude(jdn: number, timeZone: number): number {
  let T = (jdn - 2451545.0 - timeZone / 24.0) / 36525.0;
  let T2 = T * T;
  let dr = PI / 180.0;
  let M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL =
    (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) +
    (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
    0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - PI * 2 * Math.floor(L / (PI * 2));
  return Math.floor((L / PI) * 6);
}

// Tính ngày bắt đầu tháng âm lịch
function getNewMoonDay(k: number, timeZone: number): number {
  let T = k / 1236.85;
  let T2 = T * T;
  let T3 = T2 * T;
  let dr = PI / 180;
  let Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  let M =
    359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  let Mpr =
    306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  let F =
    21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
    0.0021 * Math.sin(2 * dr * M);
  C1 =
    C1 -
    0.4068 * Math.sin(Mpr * dr) +
    0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 =
    C1 +
    0.0104 * Math.sin(dr * 2 * F) -
    0.0051 * Math.sin(dr * (M + Mpr));
  C1 =
    C1 -
    0.0074 * Math.sin(dr * (M - Mpr)) +
    0.0004 * Math.sin(dr * (2 * F + M));
  C1 =
    C1 -
    0.0004 * Math.sin(dr * (2 * F - M)) -
    0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 =
    C1 +
    0.001 * Math.sin(dr * (2 * F - Mpr)) +
    0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat =
      0.001 +
      0.000839 * T +
      0.0002261 * T2 -
      0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  let JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

// Tính tháng âm lịch 11
function getLunarMonth11(yy: number, timeZone: number): number {
  let off = jdFromDate(31, 12, yy) - 2415021;
  let k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  let sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

// Tính tháng nhuận
function getLeapMonthOffset(a11: number, timeZone: number): number {
  let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc != last && i < 14);
  return i - 1;
}

/**
 * Chuyển đổi từ dương lịch sang âm lịch
 */
export function solarToLunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone: number = 7
): LunarDate {
  let dayNumber = jdFromDate(dd, mm, yy);
  let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  let lunarDay = dayNumber - monthStart + 1;
  let diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff == leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeapMonth: lunarLeap == 1,
  };
}

/**
 * Chuyển đổi từ âm lịch sang dương lịch
 */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth: boolean = false,
  timeZone: number = 7
): SolarDate {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  let k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    let leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (isLeapMonth && lunarMonth != leapMonth) {
      return { day: 0, month: 0, year: 0 };
    } else if (isLeapMonth || off >= leapOff) {
      off += 1;
    }
  }
  let monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Định dạng ngày âm lịch thành chuỗi
 */
export function formatLunarDate(lunar: LunarDate): string {
  return `${lunar.day}/${lunar.month}${lunar.isLeapMonth ? ' (nhuận)' : ''}/${lunar.year}`;
}

/**
 * Lấy tên tháng âm lịch
 */
export function getLunarMonthName(month: number, isLeapMonth: boolean = false): string {
  const monthNames = [
    'Tháng Giêng',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Chạp',
  ];
  
  const name = monthNames[month - 1] || `Tháng ${month}`;
  return isLeapMonth ? `${name} (Nhuận)` : name;
}

/**
 * Kiểm tra xem một ngày âm lịch có hợp lệ không
 */
export function isValidLunarDate(day: number, month: number, year: number): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 30) return false;
  if (year < 1900 || year > 2100) return false;
  return true;
}

/**
 * Lấy các ngày lễ âm lịch phổ biến
 */
export function getLunarHolidays(): Array<{ date: string; name: string }> {
  return [
    { date: '1/1', name: 'Tết Nguyên Đán' },
    { date: '15/1', name: 'Tết Nguyên Tiêu (Rằm tháng Giêng)' },
    { date: '10/3', name: 'Giỗ Tổ Hùng Vương' },
    { date: '15/4', name: 'Phật Đản (Rằm tháng Tư)' },
    { date: '5/5', name: 'Tết Đoan Ngọ' },
    { date: '15/7', name: 'Vu Lan (Rằm tháng Bảy)' },
    { date: '15/8', name: 'Tết Trung Thu' },
    { date: '23/12', name: 'Ông Táo chầu trời' },
  ];
}

/**
 * Kiểm tra xem có phải ngày lễ âm lịch không
 */
export function isLunarHoliday(day: number, month: number): string | null {
  const holidays = getLunarHolidays();
  const dateStr = `${day}/${month}`;
  const holiday = holidays.find(h => h.date === dateStr);
  return holiday ? holiday.name : null;
}

