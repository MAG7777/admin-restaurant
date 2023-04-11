import { TImage } from 'types/image';

export type WidgetType = 'event' | 'place' | 'article' | 'manual';

type TTextBlock = {
  type: 'text';
  text: string;
};

type TImageBlock = {
  type: 'image';
  image: TImage;
};

type TGalleryBlock = {
  type: 'gallery';
  gallery: TImage[];
};

type TVideoBlock = {
  type: 'video';
  video: any;
};

type TWidgetBlock = {
  type: 'widget';
  widget: any;
};

export type TContentBlock =
  | TTextBlock
  | TImageBlock
  | TGalleryBlock
  | TVideoBlock
  | TWidgetBlock;

export type ContentType = TContentBlock['type'];
