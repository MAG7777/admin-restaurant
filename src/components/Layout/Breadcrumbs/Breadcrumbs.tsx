import React from 'react';
import { PageHeader, Breadcrumb, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import { breadCrumbsHash } from './breadCrumbsHash';

type TProps = {
  pageTitle?: string;
  extraButtonsList?: React.ReactNode[];
  pageTitleFooter?: string;
  subTitle?: string;
};

export const Breadcrumbs: React.FC<TProps> = ({
  pageTitle = 'Редактирование кафе и ресторана',
  extraButtonsList = [],
  pageTitleFooter = '',
  subTitle = '',
}) => {
  const location = useLocation();
  const breadCrumbs = React.useMemo(() => {
    //TODO: first item should be link to dashboard
    const breadCrumbsArr: (string | React.ReactElement)[] = [
      'Администрирование',
    ];
    const slited = location.pathname.split('/').slice(1);

    slited.forEach((element, index) => {
      let content = '';
      if (breadCrumbsHash[element]) {
        content = breadCrumbsHash[element];
      } else {
        content = `#${element}`;
      }
      //no link for last item
      if (index + 1 !== slited.length) {
        breadCrumbsArr.push(
          <Link to={`/${[...slited].slice(0, index + 1).join('/')}`}>
            {content}
          </Link>
        );
      } else {
        breadCrumbsArr.push(content);
      }
    });
    return breadCrumbsArr;
  }, [location.pathname]);

  return (
    <div>
      <PageHeader
        footer={pageTitleFooter}
        ghost={false}
        title={
          <Typography.Text
            style={{ fontSize: '20px', lineHeight: '28px', fontWeight: 400 }}
          >
            {pageTitle}
          </Typography.Text>
        }
        subTitle={subTitle}
        breadcrumbRender={() => (
          <Breadcrumb>
            {breadCrumbs.map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        )}
        extra={extraButtonsList}
      ></PageHeader>
    </div>
  );
};
