import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import utc from 'dayjs/plugin/utc';

import { apiClient } from 'utils/http';

import App from './App';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(utc);
const rootElement = document.getElementById('root');
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  ReactDOM.render(<App />, rootElement);
} else {
  const configUrl = '/config.json';

  console.log('Получаем конфигурацию из ', configUrl);

  axios
    .get(configUrl)
    .then(response => {
      const { api_url } = response.data;
      apiClient.defaults.baseURL = api_url;
      return <App />;
    })
    .catch(e => {
      console.log(
        `Что-то ужасно сломалось при получении конфигурации по причине ${e}`
      );
      return (
        <div>
          Приложение не запущено. Пожалуйста, обратитесь в техподдержку.
          Информация об ошибке: {e.toString()}
        </div>
      );
    })
    .then(app => {
      ReactDOM.render(app, rootElement);
    });
}
