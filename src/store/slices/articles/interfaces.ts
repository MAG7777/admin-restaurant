import { TImage } from 'types/image';
import { TContentBlock } from 'components/form/Content/contentTypes';
import { Statuses } from 'constants/status';
import { TRegionType } from 'components/form/selects/CatalogRegionSelect';

export interface IArticlesItem {
  id?: number;
  name: string;
  image: TImage;
  shortName: string;
  category: number;
  tags: number[];
  region: TRegionType;
  content: TContentBlock[];
  status: Statuses;
}

export interface IArticlesState {
  list: IArticlesItem[] | [];
  item: IArticlesItem;
  limit: number;
  total: number;
  offset: number;
}
