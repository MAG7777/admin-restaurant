const pluralizeFn = (value: number, words: string[], genitive) => {
  value = Math.abs(value) % 100;
  const num = value % 10;
  if (genitive) {
    if (num == 1) return words[1];
    return words[2];
  }
  if (value > 10 && value < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
};

const dictionary = [
  ['раздел', 'раздела', 'разделов'],
  ['результат', 'результата', 'результатов'],
  ['отфильтрован', 'отфильтровано', 'отфильтровано'],
  ['дубликат', 'дубликата', 'дубликатов'],
  ['сеанс', 'сеанса', 'сеансов'],
  ['расписание', 'расписания', 'расписаний'],
];

export const pluralize = (
  string: string,
  value: number,
  genitive = false
): string => {
  const words = dictionary.find(item => item[0] === string);
  if (words) {
    return pluralizeFn(value, words, genitive);
  }
};
