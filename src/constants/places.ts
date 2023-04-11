export enum PlaceTypes {
  attractions = 'Достопримечательности',
  // resorts = 'Курорты',
  // hotels = 'Гостиницы',
  // restaurants = 'Кафе и рестораны',
}

export type PlaceTypesKeys = keyof typeof PlaceTypes;
