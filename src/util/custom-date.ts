export const getRedisKey = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
};

export const toStringByDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mmMinutes = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${HH}:${mmMinutes}`;
};
