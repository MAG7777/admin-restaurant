import { Collapse, Row, Typography } from 'antd';
import React, { useState } from 'react';

import { FAQItem } from 'store/slices/faq/interfaces';

import { SettingsDropdown } from '../SettingsDropdown';
import styles from './FAQList.module.less';

interface FAQListProps {
  items?: FAQItem[];
}

type GetExtraArgs = Pick<FAQItem, 'category' | 'id'>;

export const FAQList = ({ items = [] }: FAQListProps) => {
  const [activeTab, setActiveTab] = useState<string | string[]>([]);
  const noItems = items.length === 0;

  const getExtra = ({ category, id = '' }: GetExtraArgs) => (
    <Row
      style={{ gap: 10, padding: '0 27px 0 20px', flexWrap: 'nowrap' }}
      align='middle'
    >
      <Typography.Text className={styles.category}>{category}</Typography.Text>
      <SettingsDropdown id={id} />
    </Row>
  );

  if (noItems)
    return (
      <Typography.Text>
        К сожалению, по вашему запросу ничего не найдено
      </Typography.Text>
    );

  return (
    <Collapse
      expandIconPosition='end'
      onChange={value => setActiveTab(value)}
      activeKey={activeTab}
      className={styles.collapse}
    >
      {items.map(({ id = '', question, answer, category }) => (
        <Collapse.Panel
          key={id}
          header={question}
          extra={getExtra({ category, id })}
        >
          <Typography.Text>{answer}</Typography.Text>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default FAQList;
