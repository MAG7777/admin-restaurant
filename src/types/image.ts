interface TBaseImage {
  author: string;
  description?: string;
  source: string;
  crop: { x: number; y: number; width: number; height: number };
  cropCanvas: any;
}

export interface TLocalImage extends TBaseImage {
  file: any;
}

export interface TUploadedImage extends TBaseImage {
  averageColor: string;
  path: string;
  baseUrl: string;
}

export type TImage = TLocalImage | TUploadedImage;
