import React from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { notification, Tooltip } from 'antd';
import loadImage from 'blueimp-load-image';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import classNames from 'classnames';

import { isString, omit, partition } from 'utils/helpers';
import { getImageUrl } from 'utils/image';
import editableList from 'hocs/editableList';
import { TImage } from 'types/image';
import { verifyFiles } from 'utils/files';
import { MAX_GALLERY_COUNT } from 'constants/upload';

import { Dropzone } from '../Dropzone/Dropzone';
import { CropperModal } from '../CropperModal/CropperModal';
import styles from './EditableGallery.module.less';

const width = 190;
const height = 190;

type TProps = {
  addItems: (files: TImage[]) => void;
  getItems: () => TImage[];
  removeAt: (index: number) => void;
  getItem: (index: number) => any;
  resetItems: (items: TImage[]) => void;
  onReject: (values: TImage[]) => any;
  errorRef?: React.RefObject<HTMLDivElement>;
  changeItem: (index: number, item: TImage, options?: any) => void;
  errors: any;
  name: string;
  value: TImage[];
};

const FormGallery = React.forwardRef(
  (
    { value, errors, ...props }: TProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const [fileList, setFileList] = React.useState([]);
    React.useEffect(() => {
      const items = props.getItems();
      setFileList(items);
      /**
     тут важно что бы items которые мы будем передавать анту были получены через функицю
     getItems(), потому что там какие-то модифицированные объекты в value приходит
     актуальный список файлов но он лажовый и использовать его тяжко
     **/
    }, [value]);
    const onDropFiles = files => {
      return verifyFiles(files, fileList).then(verificationResults => {
        if ([...files, ...value].length > MAX_GALLERY_COUNT) {
          notification.error({
            message: `Вы можете загрузить не более ${MAX_GALLERY_COUNT} фотографий в галерею`,
          });
          return;
        }
        const [verified, rejected] = partition(files, (file, index) =>
          Boolean(verificationResults[index])
        );
        /**
       с вероятностью в 100% это проверка на уникальность файлов
       **/
        if (rejected.length) {
          props.onReject(rejected);
        }
        /**
       вы спросите меня нафига я создал еще одну переменную с файлами, а я вам отвечу:
       после того как сохранился черновик проверка на уникальность файла работать не будет
       потому что самого файла уже нет есть только данные от сервера, грубо говоря url
       а по урлу сравнивать файлы такое себе занятие.
       **/
        props.addItems(verified);
      });
    };

    const moveRow = React.useCallback(
      (dragIndex, hoverIndex) => {
        const dragRow = fileList[dragIndex];
        const changedFileList = update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        });

        setFileList(changedFileList);
        props.resetItems(
          changedFileList
        ); /** <<<< эта штука реинициализирует айтемс**/
      },
      [fileList]
    );

    return (
      <div
        ref={ref}
        className={'ant-upload-list-picture-card'}
        style={{ display: 'flex', flexFlow: 'row wrap' }}
        tabIndex={0}
      >
        <DndProvider backend={HTML5Backend}>
          {fileList.map(item => (
            <Edit
              key={item._id}
              errors={errors}
              file={item}
              fileList={fileList}
              moveRow={moveRow}
              {...props}
            />
          ))}
        </DndProvider>
        <div
          className={'ant-upload ant-upload-select-picture-card'}
          style={{ position: 'relative' }}
        >
          <Dropzone
            name={props.name}
            multiple
            onDrop={onDropFiles}
            className={styles.dropzone}
          >
            <span>
              <PlusOutlined style={{ fontSize: '30px' }} />
              <div style={{ marginTop: 8 }}>Загрузить</div>
            </span>
          </Dropzone>
        </div>
      </div>
    );
  }
);

FormGallery.displayName = 'FormGallery';

const Edit = ({ file, errors, fileList, moveRow, ...props }) => {
  const type = 'DragableUploadList';
  const [cropModalIsOpen, setCropModalIsOpen] = React.useState(false);
  const index = fileList.indexOf(file);
  const errorObject = errors?.[index] || null;
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? 'drop-over-downward' : 'drop-over-upward',
      };
    },
    drop: (item: { index: number }) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  let cropUrl;
  //realName
  const originalUrl = isString(file.path)
    ? getImageUrl(file.path)
    : file?.file?.image?.currentSrc;
  if (typeof file?.cropCanvas?.toDataURL === 'function') {
    cropUrl = loadImage
      .scale(file.cropCanvas, {
        maxWidth: width,
        minWidth: width,
        maxHeight: height,
        minHeight: height,
        canvas: true,
        crop: true,
        downsamplingRatio: 0.5,
      })
      .toDataURL(); /** <<<эта штука создает кропнутое изображение если мы только что его кропнули  **/
    //realName
  } else if (typeof file?.path === 'string') {
    cropUrl =
      (file.file && (file.cropCanvas || file.file.image)) ||
      getImageUrl(file, width, height);
    /** эта штука создает кропнутое изображение если мы его уже кропали и изображение с сервера пришло  **/
  }
  return (
    <div>
      <div
        style={{ cursor: 'move' }}
        ref={ref}
        className={`ant-upload-list-picture-card-container ant-upload-draggable-list-item ${
          isOver ? dropClassName : ''
        }`}
      >
        <Tooltip
          placement='top'
          title={errorObject !== null && 'Заполните информацию об изображении'}
        >
          <div
            className={classNames(
              'ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card',
              {
                'ant-upload-list-item-error': errorObject !== null,
              }
            )}
          >
            <div className={'ant-upload-list-item-info'}>
              <span className={'ant-upload-span'}>
                <img
                  src={cropUrl ? cropUrl : originalUrl}
                  alt='img'
                  style={{
                    width: '100%',
                  }}
                />
              </span>
            </div>
            <div className={'ant-upload-list-item-actions'}>
              <DeleteOutlined
                onClick={() => {
                  props.removeAt(index);
                }}
              />
              {/* add 'anticon-delete' for color */}
              <EditOutlined
                className='anticon-delete'
                onClick={() => {
                  setCropModalIsOpen(true);
                }}
              />
            </div>
          </div>
        </Tooltip>
      </div>
      <CropperModal
        value={omit(file, ['id', 'uid'])}
        onChange={value => props.changeItem(index, value)}
        originalImageUrl={originalUrl}
        setCropModalIsOpen={setCropModalIsOpen}
        cropModalIsOpen={cropModalIsOpen}
      />
    </div>
  );
};

export const EditableGallery = editableList(FormGallery);
