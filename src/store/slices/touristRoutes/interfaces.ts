import { TContentBlock } from 'components/form/Content/contentTypes';
import { PlaceTypesKeys } from 'constants/places';
import { Statuses } from 'constants/status';
import { IAttractionAddress } from 'types/address';
import { TAudio } from 'types/audio';
import { TImage } from 'types/image';

export interface ITouristRoutesItem {
  id?: number;
  name: string;
  image: TImage;
  tags: number[];
  shortDescription: string;
  routeType: number;
  routeLevel: number;
  content: TContentBlock[];
  points: TPoint[];
  polylines: [string, string][];
  status: Statuses;
  days: number;
  duration: string;
  externalUrl: string;
  audio: TAudio;
}

export interface ITouristRoutesDraftItem {
  id?: number;
  name?: string;
  image?: TImage;
  tags?: number[];
  shortDescription?: string;
  routeType?: number;
  routeLevel?: number;
  content?: TContentBlock[];
  points?: TPoint[];
  polylines?: [string, string][];
  status?: Statuses;
  days?: number;
  duration?: string;
  externalUrl?: string;
  audio: TAudio;
}

export type TPoint = TPointWidget | TPointGeoPosition;
export type TPointBase = {
  type: 'widget' | 'geoPosition';
};

export type TPointWidget = {
  type: 'widget';
  widget: {
    type: PlaceTypesKeys;
    place: number;
    duration: string;
    description: TContentBlock[];
    audio: TAudio;
  };
};
export type TPointGeoPosition = {
  type: 'geoPosition';
  geoPosition: {
    name: string;
    shortDescription: string;
    description: TContentBlock[];
    address: IAttractionAddress;
    image: TImage;
    duration: string;
    audio: TAudio;
  };
};

export interface ITouristRoutessState {
  list: ITouristRoutesItem[];
  item: ITouristRoutesItem;
  limit: number;
  total: number;
  offset: number;
}
