import dayjs from 'dayjs';

import {
  mapAddress,
  mapContent,
  mapGallery,
  mapImage,
  mapPrice,
  mapPriceToForm,
  mapRegion,
  mapSelect,
  mapValuesToAddress,
  mapValuesToRegion,
  mapValuesToSelect,
} from 'utils/mappings';
import { prepareContent } from 'components/form/Content/utils';
import {
  DateTableType,
  PlaceType,
} from 'components/form/Places/components/PlaceItemContent';
import {
  IEventsItem,
  TPlace,
  TPlaceContent,
} from 'store/slices/events/interfaces';
import { Statuses, StatusesEnum } from 'constants/status';
import { defaultDateFormat } from 'components/form/base/RangePicker';

const mapSchedule = schedule => {
  return {
    dateStart:
      schedule.date && schedule.date[0]
        ? dayjs(schedule.date[0]).format(defaultDateFormat)
        : null,
    dateEnd:
      schedule.date && schedule.date[1]
        ? dayjs(schedule.date[1]).format(defaultDateFormat)
        : null,
    workTime: schedule.table,
  };
};

export const mapScheduleToForm = schedule => {
  return {
    date: [
      schedule.dateStart ? dayjs(schedule.dateStart, defaultDateFormat) : null,
      schedule.dateEnd ? dayjs(schedule.dateEnd, defaultDateFormat) : null,
    ],
    table: schedule.workTime,
  };
};

const mapSessionsToDays = sessions => {
  return sessions.map(({ date, from, to, fullDay }) => ({
    day: date,
    dayWorkTime: { from, to, fullDay },
  }));
};

const mapDaysToSessions = days => {
  return days.map(day => ({
    date: day.day,
    from: day.dayWorkTime.from,
    to: day.dayWorkTime.to,
    fullDay: day.dayWorkTime.fullDay,
  }));
};

const mapPlaces = places => {
  return places.map(place => {
    let placeItem: TPlaceContent | TPlace = {
      seances: {
        type: place.schedule ? 'schedule' : 'days',
        ...(place.sessions && {
          days: mapSessionsToDays(place.sessions),
        }),
        ...(place.schedule && { schedule: mapSchedule(place.schedule) }),
      },
    };

    if (place.type === PlaceType.place) {
      placeItem = {
        ...placeItem,
        type: 'widget',
        widget: {
          type:
            place.placeType?.value || place.placeType
              ? place.placeType.value || place.placeType
              : null,
          id: place.place?.id ? place.place.id : null,
          widgetDescription: place.place?.name ? place.place.name : null,
        },
      };
    }

    if (place.type === PlaceType.address) {
      placeItem = {
        ...placeItem,
        type: PlaceType.address,
        address: place.address.region ? mapAddress(place.address) : {},
      };
    }

    return placeItem;
  });
};

const mapPlacesToForm = places => {
  return places.map(place => {
    let placeItem: any = {
      workTimeType: place.seances.schedule
        ? DateTableType.schedule
        : DateTableType.specific,
      ...(place.seances.days && {
        sessions: mapDaysToSessions(place.seances.days),
      }),
      ...(place.seances.schedule && {
        schedule: mapScheduleToForm(place.seances.schedule),
      }),
    };

    if (place.type === 'widget') {
      const widget = place.widget;
      placeItem = {
        ...placeItem,
        type: PlaceType.place,
        place: widget.widgetData ? mapValuesToSelect(widget.widgetData) : null,
        placeType: widget.type ? widget.type : null,
      };
    }

    if (place.type === 'address') {
      placeItem = {
        ...placeItem,
        type: PlaceType.address,
        address: place.address?.region
          ? mapValuesToAddress(place.address)
          : { region: null },
      };
    }

    return placeItem;
  });
};

export const mapValuesToForm = values => {
  return {
    ...values,
    name: values.name || '',
    shortDescription: values.shortDescription || '',
    address: values.address ? mapValuesToAddress(values.address) : {},
    tags: values.tagsData ? mapValuesToSelect(values.tagsData) : [],
    region: values.region ? mapValuesToRegion(values.region) : null,
    category: values.categoryData
      ? mapValuesToSelect(values.categoryData)
      : null,
    content: prepareContent(values.content || []),
    places: values.places?.length ? mapPlacesToForm(values.places) : [],
    price: mapPriceToForm(values.price, values.maxPrice),
    status:
      values.status === StatusesEnum.DRAFT
        ? StatusesEnum.PUBLISHED
        : values.status,
  };
};

export const mapValues = (values): IEventsItem => {
  return {
    name: values.name.trim(),
    image: mapImage(values.image),
    category: mapSelect(values.category) as number,
    tags: mapSelect(values.tags) as number[],
    region: mapRegion(values.region),
    shortDescription: values.shortDescription.trim(),
    gallery: mapGallery(values.gallery),
    content: mapContent(values.content),
    ageRestriction: values.ageRestriction,
    places: mapPlaces(values.places),
    externalUrl: values.externalUrl,
    duration: values.duration,
    status: mapSelect(values.status) as Statuses,
    ...mapPrice(values.price),
  };
};

export const mapValuesToDraft = (values): Omit<IEventsItem, 'status'> => {
  return {
    name: values.name?.trim() || null,
    image: values.image ? mapImage(values.image) : null,
    category: values.category ? (mapSelect(values.category) as number) : null,
    tags: values.tags?.length ? (mapSelect(values.tags) as number[]) : [],
    region: values.region ? mapRegion(values.region) : null,
    shortDescription: values.shortDescription?.trim() || null,
    gallery: values.gallery?.length ? mapGallery(values.gallery) : [],
    content: values.content?.length ? mapContent(values.content) : [],
    ageRestriction: values.ageRestriction,
    places: values.places?.length ? mapPlaces(values.places) : [],
    externalUrl: values.externalUrl,
    duration: values.duration ? values.duration : null,
    ...mapPrice(values.price),
  };
};

export const getSchedulesAndSessions = (event: { places: TPlace[] }) => {
  const timeTable = {
    sessions: null,
    schedule: null,
  };

  event?.places?.map(({ seances }) => {
    if ('schedule' in seances) {
      timeTable.schedule += 1;
    }

    if ('days' in seances) {
      timeTable.sessions += seances.days.length;
    }
  });

  return timeTable;
};
