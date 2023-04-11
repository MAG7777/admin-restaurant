import { stripTagsAndTrim } from './helpers';

export const wrapInsideHtmlParagraph = (str: string) => {
  const htmlTagRegExp = /^<[a-z][\s\S]*[a-z]*>$/i;

  if (htmlTagRegExp.test(str)) {
    return str;
  }

  if (str === '') {
    str = '<br>';
  }

  return `<p>${str}</p>`;
};

export const isWysiwygValueEmpty = (value: string) => !stripTagsAndTrim(value);
