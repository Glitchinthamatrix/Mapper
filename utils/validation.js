import EntityModel from "../models/entityModel.js";
import { isDate } from "./date.js";
import { isNumber } from "./number.js";
import { getFieldValue, hasNestedObjects, isObject } from "./object.js";
import {
  isString, getWordAssociations, camelCaseToSpacedWords, camelCaseToCapitalizedWords
} from "./string.js";
import mongoose from "mongoose";

const TYPE_BOOLEAN = "BOOL";
const TYPE_DATE = "DATE";
const TYPE_FLOAT = "FLOT";
const TYPE_INTEGER = "INTG";
const TYPE_MONGOOSE_ID = "MON_ID";
const TYPE_NUMBER = "NUMR";
const TYPE_STRING = "STRG";

const ENTITY_MODEL_CLAUSE_TYPE = "type";
const ENTITY_MODEL_CLAUSE_REQUIRED = "required";
const ENTITY_MODEL_CLAUSE_UNIQUE = "unique";
const ENTITY_MODEL_CLAUSE_PATTERN = "pattern";

export const REGEX_PATTERNS = {
  email: /^[A-Za-z0-9._]+@{1}[A-Za-z0-9]+\.[A-Za-z0-9]+$/,
  fullName: /^[A-Za-z]+\s{1}[A-Za-z]+$/,
};
export const REGEX_PATTERNS_FOR_CLIENT = {};
for (const key in REGEX_PATTERNS){
  REGEX_PATTERNS_FOR_CLIENT[camelCaseToCapitalizedWords(key)] = key;
}
// const SUPPORTED_DATA_TYPES =
//[ TYPE_BOOLEAN, TYPE_DATE, TYPE_FLOAT, TYPE_INTEGER, TYPE_MONGOOSE_ID, TYPE_NUMBER, TYPE_STRING ];

export const types = {
  boolean: TYPE_BOOLEAN,
  date: TYPE_DATE,
  float: TYPE_FLOAT,
  integer: TYPE_INTEGER,
  mongooseId: TYPE_MONGOOSE_ID,
  number: TYPE_NUMBER,
  string: TYPE_STRING,
};

export const GENERIC_NAME_TO_DATA_TYPE = {
  "Text": TYPE_STRING,
  "Number": TYPE_NUMBER,
  "ID": TYPE_MONGOOSE_ID,
  "Date": TYPE_DATE,
  "Boolean": TYPE_BOOLEAN,
  "Number (integer)": TYPE_INTEGER,
  "Number (float)": TYPE_FLOAT,
};

export const ENTITY_MODEL_CLAUSES = [
  ENTITY_MODEL_CLAUSE_TYPE, ENTITY_MODEL_CLAUSE_REQUIRED,
  ENTITY_MODEL_CLAUSE_UNIQUE, ENTITY_MODEL_CLAUSE_PATTERN
];

export const typeValidators = {
  [TYPE_BOOLEAN]: function(value) {
    return typeof value === "boolean";
  },

  [TYPE_DATE]: function(value) {
    return isDate(value);
  },

  [TYPE_FLOAT]: function(value) {
    return isNumber(value) && !Number.isInteger(value);
  },

  [TYPE_INTEGER]: function(value){
    return Number.isInteger(value);
  },

  [TYPE_MONGOOSE_ID]: function(value) {
    return mongoose.Types.ObjectId.isValid(value);
  },

  [TYPE_NUMBER]: function(value) {
    return isNumber(value);
  },

  [TYPE_STRING]: function(value) {
    return isString(value);
  },
};

const ERROR_MESSAGE_INVALID_PATTERN = "Invalid pattern";
const ERROR_MESSAGE_INVALID_VALUE = "Invalid value";
const ERROR_MESSAGE_UNKNOWN_FIELD = "Unknown field";

export async function schemaEnforcer({ Model, next, properties, req, res }) {
  try {
    const errors = {};
    await _schemaEnforcer(
      { properties: properties, requestBody: req.body, errors: errors, Model: Model }
    );
    if (Object.keys(errors).length === 0){
      next();
    } else {
      res.status(422).json(errors);
    }
  } catch (e) {
    res.status(500).json({});
  }
}

async function _schemaEnforcer(
  { Model, errors, prefix = "", properties, requestBody }
) {
  // Check for unknown fields
  setUnknownFieldErrors(properties, requestBody, errors);

  for (const propertyName in properties) {
    // Get the right prefix for error messages, works best in case of nested properties
    // eg. property1.property2.propert3 will produce a prefix "propert3 of property1's property2"
    // Might turn out to be unncessary though
    const fullFieldName = prefix ? `${prefix}.${propertyName}` : propertyName;
    if (getFieldValue(errors, fullFieldName) !== undefined){
      continue;
    }
    const errorMessagePrefix = prefix ?
      getWordAssociations(prefix.split(".").
        map((token) => camelCaseToSpacedWords(token)), camelCaseToSpacedWords(propertyName)) :
      camelCaseToSpacedWords(propertyName);

    // TODO: Check for unknown fields? or just ignore them?
    if (hasNestedObjects(properties[propertyName])){
      _schemaEnforcer({
        properties: properties[propertyName],
        requestBody: requestBody[propertyName],
        errors : errors,
        Model: Model,
        prefix: fullFieldName,
      });
    } else {
      const propertyContraints = properties[propertyName];
      if (propertyContraints.required &&
        (requestBody[propertyName] === null || requestBody[propertyName] === undefined)
      ) {
        setMessageArray(errors, fullFieldName, `${errorMessagePrefix} is required`);
      }
      if (propertyContraints.type && requestBody[propertyName]) {
        // TODO: Check type and match regex
        if (!typeValidators[propertyContraints.type](requestBody[propertyName])){
          setMessageArray(errors, fullFieldName, ERROR_MESSAGE_INVALID_VALUE);
        }
        if (
          propertyContraints.pattern &&
            !REGEX_PATTERNS[propertyContraints.pattern].test(requestBody[propertyName])
        ) {
          setMessageArray(errors, fullFieldName, ERROR_MESSAGE_INVALID_PATTERN);
        }
      }
      if (propertyContraints.unique && getFieldValue(errors, fullFieldName) === undefined) {
        const exists = await Model.exists({
          [fullFieldName]: requestBody[propertyName]
        });
        if (exists) {
          setMessageArray(errors, fullFieldName, `${requestBody[propertyName]} already exists`);
        }
      }
      if (propertyContraints.mustExist && getFieldValue(errors, fullFieldName) === undefined) {
        const exists = await Model.exists({
          [fullFieldName]: requestBody[propertyName]
        });
        if (!exists) {
          setMessageArray(errors, fullFieldName, `${requestBody[propertyName]} does not exist`);
        }
      }
    }
  }
}

function setUnknownFieldErrors(model, object, errors, prefix = ""){
  for (const key in object){
    const fullFieldName = prefix ? `${prefix}.${key}` : key;
    // The below code does not penetrate unknown objects
    const isUnknown =
      getFieldValue(model, fullFieldName, (value) => !(hasNestedObjects(value))) === undefined;
    if (isUnknown) {
      setMessageArray(errors, fullFieldName, ERROR_MESSAGE_UNKNOWN_FIELD);
    }
    if (isObject(object[key]) && getFieldValue(errors, fullFieldName) === undefined){
      setUnknownFieldErrors(model, object[key], errors, fullFieldName);
    }
    // NOTE: The below code penetrates unknown objects, getting all the unknown fields
    // if (isObject(object[key]) && getFieldValue(errors, fullFieldName) === undefined){
    //   setUnknownFieldErrors(model, object[key], errors, fullFieldName);
    // } else {
    //   const isUnknown =
    //     getFieldValue(model, fullFieldName, (value) => !(hasNestedObjects(value))) === undefined;
    //   if (isUnknown) {
    //     setMessageArray(errors, fullFieldName, ERROR_MESSAGE_UNKNOWN_FIELD);
    //   }
    // }
  }
}

function setMessageArray(object, field, message) {
  if (field.includes(".")){
    const fieldNames = field.split(".");
    for (let i = 0; i < fieldNames.length ; i++){
      const fieldName = fieldNames[i];
      if (i === (fieldNames.length - 1)){
        if (object[fieldName] === undefined){
          object[fieldName] = [ message ];
        } else {
          object[fieldName].push(message);
        }
      } else if (!(fieldName in object)){
        object[fieldName] = {};
      }
      object = object[fieldName];
    }
  } else {
    if (object[field] === undefined){
      object[field] = [ message ];
    } else {
      object[field].push(message);
    }
  }
}

export function nullifyPseudoNull(value) {
  if (Array.isArray(value)) {
    value.forEach((val) => {
      if (isStructure(val)){
        nullifyPseudoNull(val);
      } else {
        val = isPseudoNull ? null : val;
      }
    });
  } else if (isObject(value)) {
    for (const field in value) {
      if (isStructure(value[field])){
        nullifyPseudoNull(value[field]);
      } else {
        value[field] = isPseudoNull(value[field]) ? null : value[field];
      }
    }
  }
}

export function isPseudoNull(value) {
  return value === undefined || (isString(value) && value.trim().length === 0);
}

export function isStructure(value) {
  return isObject(value) || Array.isArray(value);
}

// TODO: can a trie be used to do this?, reference: aho corasick(pattern matching) algorithm
export async function validateSchemaObject(req, res, next) {
  try {
    const errors = {};
    const object = req.body;
    if (object.name === undefined){
      setMessageArray(errors, "name", "Name is required");
    } else if (!typeValidators[TYPE_STRING](object.name)){
      setMessageArray(errors, "name", ERROR_MESSAGE_INVALID_VALUE);
    } else {
      const exists = await EntityModel.exists({ name: { $regex: object.name, $options: "i" } });
      if (exists){
        setMessageArray(errors, "name", `${object.name} is already in use`);
      }
    }
    if (req.body.properties === undefined){
      setMessageArray(errors, "properties", "Properties are required");
    } else if (!isObject(req.body.properties)) {
      setMessageArray(errors, "Properties", ERROR_MESSAGE_INVALID_VALUE);
    } else {
      _validateSchemaObject(object.properties, errors, "properties");
    }
    if (Object.keys(errors).length === 0){
      next();
    } else {
      res.status(422).json(errors);
    }
  } catch (e) {
    res.status(500).json({});
  }
}

function _validateSchemaObject(object, errors, prefix = "") {
  for (const field in object){
    const fullFieldName = prefix ? `${prefix}.${field}` : field;
    const fieldValue = object[field];
    // Check if field has nested fields
    if (hasNestedObjects(fieldValue)){
      _validateSchemaObject(fieldValue, errors, fullFieldName);
      continue;
    }
    for (const fieldRuleName in fieldValue) {
      const fullRuleName = `${fullFieldName}.${fieldRuleName}`;
      if (fieldValue.type === undefined){
        setMessageArray(errors, fullRuleName, "Type is required");
      } else {
        if (fieldRuleName === ENTITY_MODEL_CLAUSE_TYPE){
          if (typeValidators[fieldValue[fieldRuleName]] === undefined){
            setMessageArray(errors, fullRuleName, ERROR_MESSAGE_INVALID_VALUE);
          }
        } else if (fieldRuleName === ENTITY_MODEL_CLAUSE_REQUIRED){
          if (!typeValidators[TYPE_BOOLEAN](fieldValue[fieldRuleName])){
            setMessageArray(errors, fullRuleName, ERROR_MESSAGE_INVALID_VALUE);
          }
        } else if (fieldRuleName === ENTITY_MODEL_CLAUSE_UNIQUE){
          if (!typeValidators[TYPE_BOOLEAN](fieldValue[fieldRuleName])){
            setMessageArray(errors, fullRuleName, ERROR_MESSAGE_INVALID_VALUE);
          }
        } else if (fieldRuleName === ENTITY_MODEL_CLAUSE_PATTERN){
          if (fieldValue.type === TYPE_STRING){
            if (REGEX_PATTERNS[fieldValue[fieldRuleName]] === undefined){
              setMessageArray(errors, fullRuleName, "Unknown pattern");
            }
          } else {
            setMessageArray(errors, fullRuleName, "Pattern is not required");
          }
        } else {
          setMessageArray(errors, fullRuleName, ERROR_MESSAGE_UNKNOWN_FIELD);
        }
      }
    }
  }
}
