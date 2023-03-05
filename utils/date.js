const MESSAGE_INVALID_DATE = "Invalid Date";

export function isDate(value) {
  return new Date(value) !== MESSAGE_INVALID_DATE;
}
