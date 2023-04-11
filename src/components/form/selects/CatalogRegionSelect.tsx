import React from 'react';

import { isEmpty } from 'utils/helpers';
import { apiClient } from 'utils/http';
import { urls } from 'store/api';

import { Select } from '../base/Select';

export type TRegionType = { name: string; fiasId: string };

export const CatalogRegionSelect: React.FC<any> = ({ ...props }) => {
  const [regions, setOptions] = React.useState<TRegionType[] | []>([]);

  const fetchRegions = async () => {
    const res = await apiClient.get(urls.api.catalog.regions.get);
    setOptions(res?.data);
  };

  const options = React.useMemo(() => {
    return regions?.map(region => ({
      label: region.name,
      value: region.fiasId,
    }));
  }, [regions.length]);

  React.useEffect(() => {
    if (isEmpty(regions)) {
      fetchRegions();
    }
  }, []);

  return <Select {...props} allowClear options={options} />;
};
