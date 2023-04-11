export const capitalize = (str, lowercaseRest = false) => {
  const remainingChars = !lowercaseRest
    ? str.slice(1)
    : str.slice(1).toLowerCase();

  return str.charAt(0).toUpperCase() + remainingChars;
};
