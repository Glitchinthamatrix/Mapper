const DATA_TYPE_NUMBER = "number";

export function isNumber(value) {
  return typeof value === DATA_TYPE_NUMBER && isFinite(value);
}

export function isFinite(value) {
  return value < Infinity && value > -Infinity;
}
