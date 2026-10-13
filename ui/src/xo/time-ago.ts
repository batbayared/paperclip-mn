// XO: timeAgo()-ийн Монгол хувилбар. Гаралт Intl.RelativeTimeFormat("mn-MN")-тэй ижил,
// браузерын ICU-ээс хамаарахгүйн тулд загварыг шууд бичсэн.
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

export function mnTimeAgo(seconds: number): string {
  if (seconds < MINUTE) return "саяхан";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)} мин өмнө`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)} ц өмнө`;
  if (seconds < WEEK) return `${Math.floor(seconds / DAY)} өдрийн өмнө`;
  if (seconds < MONTH) return `${Math.floor(seconds / WEEK)} долоо хоногийн өмнө`;
  return `${Math.floor(seconds / MONTH)} сарын өмнө`;
}
