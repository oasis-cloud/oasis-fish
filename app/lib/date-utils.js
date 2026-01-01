import { format, differenceInDays } from "date-fns";

export function formatDate(date) {
  if (!date) return "";
  return format(new Date(date), "yyyy年MM月dd日");
}

export function calculateDays(date) {
  if (!date) return 0;
  return differenceInDays(new Date(), new Date(date));
}

export function formatDays(days) {
  if (days === 0) return "今天";
  if (days === 1) return "1天";
  if (days < 30) return `${days}天`;
  
  // 计算年份、月份和天数
  const years = Math.floor(days / 365);
  const remainingAfterYears = days % 365;
  const months = Math.floor(remainingAfterYears / 30);
  const remainingDays = remainingAfterYears % 30;
  
  if (years > 0) {
    // 有年份的情况
    if (remainingDays === 0 && months === 0) {
      // 整年
      return `${years}年`;
    } else if (remainingDays === 0) {
      // 有年份和月份，没有剩余天数
      return `${years}年${months}个月`;
    } else if (months === 0) {
      // 有年份和剩余天数，没有月份
      return `${years}年${remainingDays}天`;
    } else {
      // 有年份、月份和剩余天数
      return `${years}年${months}个月${remainingDays}天`;
    }
  } else {
    // 小于1年，只有月份和天数
    if (remainingDays === 0) {
      // 整月
      return `${months}个月`;
    } else {
      // 有月份和剩余天数
      return `${months}个月${remainingDays}天`;
    }
  }
}

