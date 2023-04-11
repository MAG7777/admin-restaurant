import { combineReducers } from 'redux';

import { accountSlice } from 'store/slices/account/accountSlice';
import { catalogSlice } from 'store/slices/catalog/catalogSlice';
import { catalogEntityTypesSlice } from 'store/slices/catalogEntityTypes/catalogEntityTypesSlice';

import { attractionsSlice } from './slices/attractions/attractionsSlice';
import { newsSlice } from './slices/news/newsSlice';
import { articlesSlice } from './slices/articles/articlesSlice';
import { faqSlice } from './slices/faq/faqSlice';
import { touristRoutesSlice } from './slices/touristRoutes/touristRoutesSlice';
import { resortsSlice } from './slices/resorts/resortsSlice';
import { eventsSlice } from './slices/events/eventsSlice';

const rootReducer = combineReducers({
  account: accountSlice.reducer,
  catalog: catalogSlice.reducer,
  attractions: attractionsSlice.reducer,
  catalogEntityTypes: catalogEntityTypesSlice.reducer,
  news: newsSlice.reducer,
  articles: articlesSlice.reducer,
  faq: faqSlice.reducer,
  touristRoutes: touristRoutesSlice.reducer,
  resorts: resortsSlice.reducer,
  events: eventsSlice.reducer,
});

export default rootReducer;
