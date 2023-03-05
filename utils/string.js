const DATA_TYPE_STRING = "string";

export function isString(value) {
  return typeof value === DATA_TYPE_STRING;
}

export function camelCaseToSpacedWords(str) {
  return str.replace(/[A-Z]/g, (match) => ` ${match.toLowerCase()}`);
}

export function camelCaseToCapitalizedWords(str) {
  str = str.replace(/[A-Z]/g, (match) => ` ${match}`);
  return `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`;
}

export function getWordAssociations(context, word) {
  let result = `${word} of ${context[0]}`;
  const contextLength = context.length;
  if (contextLength > 1){
    result += `
      's${context.slice(1, contextLength - 1).map((token) => ` ${token}'s `)}
      ${context[contextLength - 1]}
    `;
  }
  return result;
}
