export enum WeekDays {
  mon = 'Понедельник',
  tue = 'Вторник',
  wed = 'Среда',
  thu = 'Четверг',
  fri = 'Пятница',
  sat = 'Суббота',
  sun = 'Воскресенье',
}
export type WeekDaysKeys = keyof typeof WeekDays;
export type WeekDay = `${WeekDays}`;
