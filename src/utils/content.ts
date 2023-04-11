export const prepareTypography = text => {
  const replaceQuotes = (str, substr) => `&laquo;${substr.trim()}&raquo;`;

  return text
    .trim()
    .replace(/((\s)|(&nbsp;))+/g, ' ')
    .replace(/&mdash;|—/g, '&ndash;')
    .replace(/(\s)-(\s)/g, '$1&ndash;$2')
    .replace(/"([^"]*)"/g, replaceQuotes)
    .replace(/„([^“]*)“/g, replaceQuotes)
    .replace(/“([^”]*)”/g, replaceQuotes)
    .replace(/‘([^’]*)’/g, replaceQuotes)
    .replace(/„([^”]*)”/g, replaceQuotes);
};

export const prepareTextForModeration = text => {
  const htmlOpenTagsRegexp = /(<[a-zA-Z]+\w*\s*[^>]*>)/g;

  text = decodeURI(text).replace(htmlOpenTagsRegexp, encodeURI);

  return decodeURI(prepareTypography(text));
};
