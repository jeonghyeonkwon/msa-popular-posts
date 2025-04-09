export const getRedisKey = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
};

export const toStringByDateTime = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mmMinutes = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${HH}:${mmMinutes}`;
};

export const toStringByDate = (date: string) => {
  const yyyy = date.substring(0, 4);
  const mm = parseInt(date.substring(4, 6));
  const dd = parseInt(date.substring(6, 8));

  return `${yyyy}년 ${mm}월 ${dd}일`;
};

export const isWithinLastWeek = (date: Date) => {
  const now = new Date(); // 현재 날짜
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  return date >= oneWeekAgo && date <= now;
};
