export type FAQCategoryType = 'Бизнесу' | 'Туристам';

export interface FAQItem {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  answer: string;
  category: FAQCategoryType;
  question: string;
}

export interface FAQState {
  list: FAQItem[] | [];
  item: FAQItem | null;
}
