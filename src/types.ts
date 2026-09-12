export type Language = 'ar' | 'en' | 'fr' | 'de' | 'zh' | 'it';

export type Paper = {
  id: string;
  title: string;
  topic: string;
  year: number;
  authors: string;
  doi: string;
  language: string;
  abstract?: string;
};

export type Filters = {
  topic: string;
  year: string;
  author: string;
  doi: string;
  language: string;
};
