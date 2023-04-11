import React from 'react';
import classNames from 'classnames';
import { CloseOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { prepareTextForModeration } from 'utils/content';
import { isEmpty, isString, omit, pick } from 'utils/helpers';
import { useDeepEffect } from 'utils/useDeepEffect';
import { getValueByStringKeyWithArr } from 'utils/objects';

import { Toolbar } from './Toolbar';
import { TextFormContent } from './Text';
import { FormContentImage } from './Image/Image';
import { GalleryContent } from './Gallery';
import { Video } from './Video';
// import { WidgetContent } from './Widget';
import { ContentType, WidgetType } from './contentTypes';
import { prepareContent } from './utils';
import { ErrorTooltip } from '../ErrorTooltip';

const contentItemHash = {
  text: TextFormContent,
  image: FormContentImage,
  gallery: GalleryContent,
  video: Video,
  // widget: WidgetContent,
};

interface IContentProps {
  name: string;
  label?: string | JSX.Element;
  enabledTypes?: ContentType[];
  withPreparingForModeration?: boolean;
  withWidgetsDescription?: boolean;
  hint?: string;
  placeholder?: string;
  required?: boolean;
}
interface IComponentData {
  index: number;
  line: number;
}

export const Content: React.FC<IContentProps> = ({
  enabledTypes = ['image', 'gallery', 'video', 'widget'],
  withWidgetsDescription = false,
  withPreparingForModeration = false,
  label = 'Описание',
  name,
  placeholder = 'Начните печатать текст',
  required,
}) => {
  const { control, formState, setValue, reset, getValues } = useFormContext();
  const fields = useWatch({ name, control });
  const [toolbarPosition, setToolbarPosition] = React.useState(0);
  const [showToolbar, setShowToolbar] = React.useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = React.useState(false);
  const [isPreparedForModeration, setIsPreparedForModeration] =
    React.useState(false);
  const [activeTextComponentData, setActiveTextComponentData] =
    React.useState<IComponentData>({
      index: 0,
      line: 0,
    });
  const refContentEl = React.useRef(null);
  const componentsRefs = React.useRef([]);

  useDeepEffect(() => {
    if (isPreparedForModeration) {
      setIsPreparedForModeration(false);
    }
  }, [fields]);

  const onAddItem = (type: string, data: { type: WidgetType }) => {
    const index = activeTextComponentData.index;
    const line = activeTextComponentData.line;
    const component = componentsRefs.current[index];

    const content = fields.map(item => omit(item, 'id'));
    const texts = component.splitText(line);
    const contentData = {
      type,
      ...(data && { [type]: { ...data } }),
    };

    content[index] = {
      ...content[index],
      ...{ text: texts[0] },
    };

    content.splice(index + 1, 0, contentData, { type: 'text', text: texts[1] });

    setShowToolbar(false);
    setIsToolbarOpen(false);
    reset({
      ...getValues(),
      [name]: prepareContent(content),
    });
  };

  const onRemoveItem = index => {
    const newValue = [...fields];
    newValue.splice(index, 1);
    reset({
      ...getValues(),
      [name]: prepareContent(newValue),
    });
  };

  const onCaretNearEmptyLine = (index, position, line) => {
    const contentPosition = refContentEl.current.getBoundingClientRect();
    const toolbarPosition = position.top - contentPosition.top - 20;

    setActiveTextComponentData({ index, line });
    setToolbarPosition(toolbarPosition);
    setShowToolbar(true);
    setIsToolbarOpen(false);
  };

  const onCaretInsideText = () => {
    setShowToolbar(false);
    setIsToolbarOpen(false);
  };

  const toggleToolbar = () => {
    setIsToolbarOpen(!isToolbarOpen);
  };

  const prepareForModeration = () => {
    fields.map((item, index) => {
      if (
        item.type === 'text' &&
        prepareTextForModeration(item.text) !== item.text
      ) {
        setValue(`${name}[${index}]`, {
          type: item.type,
          text: prepareTextForModeration(item.text),
        });
      }
    });
  };

  const makePropsHash = {
    text: (index, props) => {
      props = {
        onCaretNearEmptyLine: (position, line) =>
          onCaretNearEmptyLine(index, position, line),
        onCaretInsideText,
        ...props,
      };

      if (!index) {
        props.placeholder = placeholder;
      }

      return props;
    },
    widget: (index, props) => ({
      ...props,
    }),
    image: (index, props) => props,
    gallery: (index, props) => props,
    clickableImage: (index, props) => props,
    video: (index, props) => props,
  };
  const contentItems = fields.map((item, index) => {
    const Component = contentItemHash[item.type];
    const options = makePropsHash[item.type](index, pick(item, item.type));
    const sectionTypes = ['video', 'widget'];
    return (
      <div
        key={`${item.id} + ${index}`}
        className={classNames('ant-content-block', {
          ['ant-content-block__section']: sectionTypes.includes(item.type),
        })}
      >
        {item.type !== 'text' && (
          <Button
            shape='circle'
            type='primary'
            icon={<CloseOutlined />}
            onClick={() => onRemoveItem(index)}
            className='ant-content__remove-item-button'
          />
        )}
        {item.type === 'widget' || item.type === 'video' ? (
          <Component
            {...options}
            // eslint-disable-next-line no-return-assign
            ref={ref => (componentsRefs.current[index] = ref)}
            // errors={errors}
            name={`${name}[${index}].${item.type}`}
            withWidgetsDescription={withWidgetsDescription}
            defaultLocation={{}}
          />
        ) : (
          <Controller
            name={`${name}[${index}].${item.type}`}
            render={({ field, fieldState }) => (
              <Component
                {...options}
                {...field}
                error={fieldState.error}
                // eslint-disable-next-line no-return-assign
                ref={ref => (componentsRefs.current[index] = ref)}
                errorRef={field.ref}
              />
            )}
            control={control}
          />
        )}
      </div>
    );
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className='content-wrapper' ref={field.ref} tabIndex={0}>
          <Form.Item
            label={label}
            help={fieldState.error?.message}
            validateStatus={fieldState.error ? 'error' : 'success'}
            required={required}
          >
            <div style={{ backgroundColor: '#fff' }}>
              <div
                className='content ant-content ant-form ant-form-vertical'
                ref={refContentEl}
              >
                {withPreparingForModeration && (
                  <Button
                    disabled={isPreparedForModeration}
                    type='link'
                    onClick={() => prepareForModeration()}
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '16px',
                      padding: 0,
                      zIndex: 2,
                    }}
                    icon={<ThunderboltOutlined />}
                  >
                    Подготовить к модерации
                  </Button>
                )}
                {Boolean(enabledTypes.length) && showToolbar && (
                  <div
                    className='content_toolbar'
                    style={{ top: toolbarPosition }}
                  >
                    <Toolbar
                      open={isToolbarOpen}
                      onAddItem={onAddItem}
                      onOpenClick={toggleToolbar}
                      enabledTypes={enabledTypes}
                    />
                  </div>
                )}
                <div className='content_items'>{contentItems}</div>
                <ErrorTooltip
                  error={
                    isString(fieldState.error?.message)
                      ? fieldState.error?.message
                      : !isEmpty(fieldState.error) &&
                        'Проверьте правильность заполнения полей'
                  }
                />
              </div>
            </div>
          </Form.Item>
        </div>
      )}
    />
  );
};
