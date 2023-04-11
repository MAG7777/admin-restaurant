import deepEqual from 'fast-deep-equal/react';

import { PlaceType } from './PlaceItemContent';

type TCheckDisabledFieldsProps = {
  type: PlaceType;
  schedule?: typeof defaultScheduleDump;
  sessions?: Date[];
};

export const defaultScheduleDump = {
  date: null,
  table: {
    fri: { from: null, to: null, fullDay: false },
    mon: { from: null, to: null, fullDay: false },
    sat: { from: null, to: null, fullDay: false },
    sun: { from: null, to: null, fullDay: false },
    thu: { from: null, to: null, fullDay: false },
    tue: { from: null, to: null, fullDay: false },
    wed: { from: null, to: null, fullDay: false },
  },
};

export const checkDisabledFields = (value: TCheckDisabledFieldsProps) => {
  const disabledFields = {
    isAddressDisabled: false,
    isPlaceDisabled: false,
    isSessionsDisabled: false,
    isClearButtonVisible: false,
    isScheduleDisabled: false,
  };

  if (value.type === PlaceType.place) {
    if (value.schedule) {
      const isTableFormChanged = !deepEqual(
        value.schedule,
        defaultScheduleDump
      );

      if (isTableFormChanged) {
        disabledFields.isAddressDisabled = true;
        disabledFields.isSessionsDisabled = true;
        disabledFields.isClearButtonVisible = true;
        return disabledFields;
      } else {
        disabledFields.isAddressDisabled = false;
        disabledFields.isSessionsDisabled = false;
        disabledFields.isClearButtonVisible = false;
      }
    }

    if (value.sessions?.length) {
      disabledFields.isAddressDisabled = true;
      disabledFields.isScheduleDisabled = true;
    } else {
      disabledFields.isAddressDisabled = false;
      disabledFields.isScheduleDisabled = false;
    }
  }

  if (value.type === PlaceType.address) {
    if (value.schedule) {
      const isTableFormChanged = !deepEqual(
        value.schedule,
        defaultScheduleDump
      );

      if (isTableFormChanged) {
        disabledFields.isPlaceDisabled = true;
        disabledFields.isSessionsDisabled = true;
        disabledFields.isClearButtonVisible = true;
        return disabledFields;
      } else {
        disabledFields.isPlaceDisabled = false;
        disabledFields.isSessionsDisabled = false;
        disabledFields.isClearButtonVisible = false;
      }
    }

    if (value.sessions?.length) {
      disabledFields.isPlaceDisabled = true;
      disabledFields.isScheduleDisabled = true;
    } else {
      disabledFields.isPlaceDisabled = false;
      disabledFields.isScheduleDisabled = false;
    }
  }

  return disabledFields;
};
