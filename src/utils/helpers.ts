export const isEmpty = obj =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;
export const reject = function (arr, predicate) {
  const complement = function (f) {
    return function (x) {
      return !f(x);
    };
  };

  return arr.filter(complement(predicate));
};

export const getTagRegex = function () {
  return /<\/?[^>]+>|&nbsp;/g;
};

export const stripTagsAndTrim = function (str) {
  return str.replace(getTagRegex(), '').trim();
};

export const isObject = obj =>
  typeof obj === 'object' && !Array.isArray(obj) && obj !== null;

export const isString = str => {
  if (str != null && typeof str.valueOf() === 'string') {
    return true;
  }
  return false;
};

export const isNumber = n => {
  return typeof n === 'number' && isFinite(n);
};

export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const flatten = arr => arr.reduce((a, b) => a.concat(b), []);

export const removeEmptyValues = obj => {
  Object.entries(obj).forEach(
    ([key, val]) =>
      (val && typeof val === 'object' && removeEmptyValues(val)) ||
      ((val === null || val === '' || isEmpty(val) || val === undefined) &&
        delete obj[key])
  );
  return obj;
};

export const pick = (obj, ...props) => {
  return props.reduce((result, prop) => {
    result[prop] = obj[prop];
    return result;
  }, {});
};

export const omit = (obj, ...keys) => {
  const keysToRemove = new Set(keys.flat()); // flatten the props, and convert to a Set

  const result = { ...obj };
  keysToRemove.forEach(function (prop) {
    delete result[prop];
  });
  return result;
};

export const partition = (
  arr,
  filterFn: (item: any, index?: number) => boolean
) => {
  return arr.reduce(
    (acc, item, index) => {
      if (filterFn(item, index)) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }
      return acc;
    },
    [[], []]
  );
};
