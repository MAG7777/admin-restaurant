export interface ICatalogItem {
  id?: number;
  name: string;
  entityType: string;
  fieldType: string;
}

export interface ICatalogState {
  list: ICatalogItem[];
  item: ICatalogItem;
  limit: number;
  total: number;
  offset: number;
}

export type IEditRequestValues = {
  id: number;
  name: string;
};
