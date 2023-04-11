import { stripTagsAndTrim } from 'utils/helpers';
import { wrapInsideHtmlParagraph } from 'utils/wysiwyg';

export const getDefaultTextData = () => ({ type: 'text', text: '' });

export const prepareContent = ([...content]) => {
  const resultContent = [];
  const firstItem = content[0] || {};

  if (firstItem.type !== 'text') {
    resultContent.push(getDefaultTextData());
  }

  let previousItem = resultContent[resultContent.length - 1] || {};

  content.forEach((item, index) => {
    item = {
      ...item,
      originalIndex: index,
    };

    if (item.type === 'text' && previousItem.type === 'text') {
      const previousText = wrapInsideHtmlParagraph(previousItem.text);
      const currentText = stripTagsAndTrim(item.text)
        ? wrapInsideHtmlParagraph(item.text)
        : '';

      item = { ...item, text: previousText + currentText };

      resultContent[resultContent.length - 1] = item;
    } else if (item.type !== 'text' && previousItem.type !== 'text') {
      resultContent.push(getDefaultTextData());
      resultContent.push(item);
    } else {
      resultContent.push(item);
    }

    previousItem = item;
  });

  if (resultContent[resultContent.length - 1].type !== 'text') {
    resultContent.push(getDefaultTextData());
  }
  return [...resultContent];
};
