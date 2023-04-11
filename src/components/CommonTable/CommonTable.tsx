import { Table, TablePaginationConfig } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';
import { SorterResult } from 'antd/lib/table/interface';

import { useQuery } from 'hooks/useQuery';
import { omit } from 'utils/helpers';
import { pluralize } from 'utils/pluralize';

interface IProps extends React.ComponentProps<typeof Table> {
  total: number;
  limit: number;
  setSort?: (sort?: string) => void;
  customPagination?: TablePaginationConfig;
}

export const CommonTable: React.FC<IProps> = ({
  columns,
  dataSource,
  total,
  limit,
  setSort = () => undefined,
  customPagination = {},
  ...props
}) => {
  const query = useQuery();
  const navigate = useNavigate();
  return (
    <Table
      rowKey='_id'
      columns={columns}
      dataSource={dataSource}
      bordered
      locale={{
        emptyText: 'К сожалению, по вашему запросу ничего не найдено',
        triggerDesc: 'Сортировать по убыванию',
        triggerAsc: 'Сортировать по возрастанию',
        cancelSort: 'Отменить сортировку',
      }}
      onChange={(pagination, filters, sorter: SorterResult<any>) => {
        if (!sorter.order) {
          setSort();
        } else {
          const sort =
            (sorter.order === 'descend' ? '-' : '') +
            (sorter.field === 'authorData' ? 'authorName' : sorter.field);
          setSort(sort as string);
        }
      }}
      pagination={
        total > limit
          ? {
              onChange: (page, size) => {
                const offset = (page - 1) * size;
                const newQuery = omit(query, 'offset');

                if (offset) {
                  newQuery.offset = offset;
                }
                const queryString = new URLSearchParams(newQuery).toString();

                navigate(`${location.pathname}?${queryString}`);
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} из ${total} ${pluralize(
                  'результат',
                  total,
                  true
                )}`,
              current: 1 + (Number(query.offset) || 0) / limit,
              total,
              pageSize: limit,
              showSizeChanger: false,
              position: ['bottomRight'],
              ...customPagination,
            }
          : false
      }
      {...props}
    />
  );
};
