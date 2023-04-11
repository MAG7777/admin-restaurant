import { TContentBlock } from 'components/form/Content/contentTypes';
import { entityTypeNamesKeys, fieldTypeNamesKeys } from 'constants/catalog';
import { Statuses } from 'constants/status';
import { IAttractionAddress } from 'types/address';
import { TContact } from 'types/contact';
import { TImage } from 'types/image';
import { TSchedule } from 'types/schedule';

export interface IResortItem {
  id?: number;
  name: string;
  image: TImage;
  category: number;
  tags: number[];
  shortDescription: string;
  content: TContentBlock[];
  gallery: TImage[];
  address: IAttractionAddress;
  workTime: TSchedule;
  contacts: TContact[];
  status: Statuses;
  externalUrl: string;
}

export interface IResortDraftItem {
  id?: number;
  name?: string;
  image?: TImage;
  category?: number;
  tags?: number[];
  shortDescription?: string;
  content?: TContentBlock[];
  gallery?: TImage[];
  address?: IAttractionAddress;
  workTime?: TSchedule;
  contacts?: TContact[];
  status?: Statuses;
  externalUrl?: string;
}

export interface IResortItemResponse extends IResortItem {
  createdAt: string;
  updatedAt: string;
  author: number;
  creator: number;
  editor: number;
  name: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  metaKeywords: string;
  publishedAt: string;
  categoryData: {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    sysName: string;
    entityType: entityTypeNamesKeys;
    fieldType: fieldTypeNamesKeys;
  };
  tagsData: [
    {
      id: number;
      createdAt: string;
      updatedAt: string;
      name: string;
      sysName: string;
      entityType: entityTypeNamesKeys;
      fieldType: fieldTypeNamesKeys;
    }
  ];
}

export interface IResortsState {
  list: IResortItemResponse[];
  item: IResortItemResponse;
  limit: number;
  total: number;
  offset: number;
}
