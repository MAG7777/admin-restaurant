import querystring from 'query-string';
import { useLocation } from 'react-router';

export const useQuery = () => {
  const location = useLocation();
  return Object.assign({}, querystring.parse(location.search));
};
