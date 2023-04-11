export enum AddressType {
  Region = 'region',
  Area = 'area',
  City = 'city',
  Street = 'street',
  Settlement = 'settlement',
  House = 'house',
}

export type TDadataLevel = {
  name: string;
  fiasId: string;
  type: string;
  mapPosition?: string;
  isPostfix?: boolean;
};

export type IAddress = {
  [AddressType.Region]?: TDadataLevel;
  [AddressType.Area]?: TDadataLevel;
  [AddressType.City]?: TDadataLevel;
  [AddressType.Settlement]?: TDadataLevel;
  [AddressType.Street]?: TDadataLevel;
  [AddressType.House]?: TDadataLevel;
};

export type IAttractionAddress = IAddress & {
  mapPosition?: [number, number];
  comment?: string;
};
