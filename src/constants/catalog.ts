export enum entityTypeNames {
  attractions = 'Достопримечательности',
  resorts = 'Курорты',
  hotels = 'Гостиницы',
  restaurants = 'Кафе и рестораны',
  catalog = 'Данные полей',
  articles = 'Статьи',
  events = 'События',
  routes = 'Маршруты',
  news = 'Новости',
}

export enum fieldTypeNames {
  tags = 'Теги',
  topics = 'Тема/рубрика',
  categories = 'Категории',
  hotelComforts = 'Главные удобства в отеле',
  hotelComfortGroups = 'Группы удобств',
  restaurantTypes = 'Тип заведения',
  foods = 'Кухни',
  features = 'Особенности ',
  routeTypes = 'Тип маршрута',
  routeLevels = 'Сложность',
}

export type entityTypeNamesKeys = keyof typeof entityTypeNames;
export type fieldTypeNamesKeys = keyof typeof fieldTypeNames;
