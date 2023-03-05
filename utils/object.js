const DATA_TYPE_OBJECT = "object";

export function isObject(value) {
  return value !== null && typeof value === DATA_TYPE_OBJECT
    && !Array.isArray(value);
}

export function setFieldValue(object, field, value) {
  if (field.includes(".")){
    const fields = field.split(".");
    for (const fieldName of fields){
      if (fieldName === fields[fields.length - 1]){
        object[fieldName] = value;
      } else if (!(fieldName in object)){
        object[fieldName] = {};
      }
      object = object[fieldName];
    }
  } else {
    object[field] = value;
  }
}

export function getFieldValue(object, field, exclude) {
  let value;
  if (field.includes(".")){
    const fieldNames = field.split(".");
    for (let i = 0; i < fieldNames.length; i++){
      const fieldName = fieldNames[i];
      if (i === (fieldNames.length - 1)){
        value = object[fieldName];
      } else if (!isObject(object[fieldName]) || (exclude && exclude(object[fieldName]))
      ){
        break;
      }
      object = object[fieldName];
    }
  } else {
    value = object[field];
  }
  return value;
}

export function hasNestedObjects(value) {
  return isObject(value) && Object.values(value).some((value) => isObject(value));
}
