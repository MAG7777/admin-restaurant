import { TImage } from 'types/image';
import { TContentBlock } from 'components/form/Content/contentTypes';
import { Statuses } from 'constants/status';
import { TRegionType } from 'components/form/selects/CatalogRegionSelect';

export interface INewsItem {
  id?: number;
  name: string;
  image: TImage;
  topic: number;
  region: TRegionType;
  tags: number[];
  shortDescription: string;
  content: TContentBlock[];
  status: Statuses;
  source: string;
}

export interface INewsState {
  list: INewsItem[] | [];
  item: INewsItem;
  limit: number;
  total: number;
  offset: number;
}
