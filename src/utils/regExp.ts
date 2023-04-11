/* Проверка корректного url на кириллице */
export const ruDomainRegex = new RegExp(
  /^(https?:\/\/)?((([а-я\d]([а-я\d-]*[а-я\d])*)\.)+[а-я]{2,}|((\d{1,3}\.){3}\d{1,3}))(\\:\d+)?(\/[-а-я\\d%_.~+]*)*(\\?[;&а-я\\d%_.~+=-]*)?(\\#[-а-я\\d_]*)?$/
);

/* Проверка корректного url на латинице */
export const enDomainRegex = new RegExp(
  /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\\:\d+)?(\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$/
);

/* Проверка языка ссылки */
export const checkEnLanguage = str => {
  const pattern = new RegExp(/^(https?:\/\/)([a-z\d]([a-z\d-]*[a-z\d])*)/gm);
  return !!pattern.test(str);
};
