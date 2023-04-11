import { TContentBlock } from 'components/form/Content/contentTypes';
import { entityTypeNamesKeys, fieldTypeNamesKeys } from 'constants/catalog';
import { Statuses } from 'constants/status';
import { IAttractionAddress } from 'types/address';
import { TContact } from 'types/contact';
import { TImage } from 'types/image';
import { TSchedule } from 'types/schedule';

export interface IAttractionItem {
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
}

export interface IAttractionDraftItem {
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
}

export interface IAttractionItemResponse extends IAttractionItem {
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

export interface IAttractionsState {
  list: IAttractionItemResponse[];
  item: IAttractionItemResponse;
  limit: number;
  total: number;
  offset: number;
}
