import { WeekDaysKeys } from 'constants/weekdays';

type TWeekdays = {
  [key in WeekDaysKeys]?: {
    from: number;
    to: number;
  };
};
export type TSchedule = TWeekdays & { comment?: string };
