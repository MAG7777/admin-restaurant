import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Card, Row } from 'antd';
import { useNavigate } from 'react-router';
import { DefaultOptionType } from 'antd/lib/select';

import { TextAreaField } from 'components/form/base/TextAreaField';
import { InputField } from 'components/form/base/InputField';
import Yup from 'utils/yup';
import { Select } from 'components/form/base/Select';
import { FAQCategoryType, FAQItem } from 'store/slices/faq/interfaces';

const validationSchema = Yup.object().shape({
  question: Yup.string().required(),
  answer: Yup.string().required(),
  category: Yup.mixed().required(),
});

export const CATEGORY_OPTIONS: FAQCategoryOption[] = [
  {
    label: 'Бизнесу',
    value: 'Бизнесу',
  },
  {
    label: 'Туристам',
    value: 'Туристам',
  },
];

export interface FormValues {
  question: string;
  answer: string;
  category: DefaultOptionType | FAQCategoryOption | null;
}

export interface FAQFormProps {
  onSubmit: (values: FAQItem) => void;
  defaultValues?: Partial<FormValues>;
}

export type FAQCategoryOption = DefaultOptionType & {
  value: FAQCategoryType | '';
};

export const FAQForm = ({ onSubmit, defaultValues = {} }: FAQFormProps) => {
  const navigate = useNavigate();
  const methods = useForm<FormValues>({
    defaultValues: {
      question: '',
      answer: '',
      category: null,
      ...defaultValues,
    },
    resolver: yupResolver(validationSchema),
  });

  const cancelButtonHandler = () => {
    navigate('/faq');
  };

  const onSubmitHandler = (values: FormValues) => {
    const { category } = values;

    onSubmit({ ...values, category: category?.value as FAQCategoryType });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        className='ant-form ant-form-vertical'
      >
        <Card bordered={false}>
          <InputField
            name='question'
            label='Вопрос'
            required
            placeholder='Напишите вопрос'
            maxLength={255}
          />
          <TextAreaField
            name='answer'
            label='Ответ'
            required
            placeholder='Напишите ответ'
            maxLength={500}
            showCount
          />
          <Select
            name='category'
            required
            label='Категория'
            style={{ maxWidth: 302 }}
            options={CATEGORY_OPTIONS}
            placeholder='Выберите категорию'
          />
          <Row justify='end' style={{ gap: 18, marginTop: 48 }}>
            <Button onClick={cancelButtonHandler}>Отмена</Button>
            <Button type='primary' htmlType='submit'>
              Сохранить
            </Button>
          </Row>
        </Card>
      </form>
    </FormProvider>
  );
};

export default FAQForm;
