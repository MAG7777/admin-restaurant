export const addTargetBlankToLinks = text => {
  // http://stackoverflow.com/a/17204198
  // eslint-disable-next-line max-len
  const regex =
    /(<a)((?=\s|>)(?!(?:[^>=]|=(['"])(?:(?!\1).)*\1)*?\starget=['"]?_blank['"]?)[^>]*>.*?<\/a>)/gi;

  return text.replace(regex, '$1 target="_blank"$2');
};
