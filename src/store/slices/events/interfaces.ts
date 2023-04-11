import { TContentBlock } from 'components/form/Content/contentTypes';
import { Statuses } from 'constants/status';
import { IAttractionAddress } from 'types/address';
import { TImage } from 'types/image';
import { TRegionType } from 'components/form/selects/CatalogRegionSelect';
import { PlaceTypesKeys } from 'constants/places';
import { defaultScheduleDump } from 'components/form/Places/components/formUtils';

export interface IEventsItem {
  id?: number;
  name: string;
  image: TImage;
  category: number;
  tags: number[];
  region: TRegionType;
  shortDescription: string;
  gallery: TImage[];
  content: TContentBlock[];
  ageRestriction: string;
  places: TPlace[];
  price: number;
  maxPrice: number;
  externalUrl: string;
  duration: string;
  status: Statuses;
}

export interface IEventsState {
  list: IEventsItem[];
  item: IEventsItem;
  limit: number;
  total: number;
  offset: number;
}

export type TPlaceDay = {
  day: string;
  dayWorkTime: {
    from: null | number;
    to: null | number;
    fullDay: boolean;
  };
};

export type TPlaceSchedule = {
  dateStart: string;
  dateEnd: string;
  workTime: Omit<typeof defaultScheduleDump, 'date'>;
};

export type TPlaceContent = {
  seances: {
    type: 'schedule' | 'days';
    schedule: TPlaceSchedule;
    days: TPlaceDay[];
  };
};

export type TPlaceWidget = {
  type: 'widget';
  widget: {
    type: PlaceTypesKeys;
    id: number;
    widgetDescription: string;
  };
};

export type TPlaceAddress = {
  type: 'address';
  address: IAttractionAddress;
};

export type TPlace = TPlaceContent & (TPlaceWidget | TPlaceAddress);
