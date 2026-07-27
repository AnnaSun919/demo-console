import _ from 'lodash';

export const validateFields = (fieldsToCheck, data) => {
  let errorFields = [];
  fieldsToCheck.forEach(field => {
    const value = data[field];
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
    if (isEmpty && !_.includes(errorFields, field)) {
      errorFields.push(field);
    }
  });

  const errorMessages = errorFields.length > 0
    ? ['Required fields must not be empty.']
    : [];

  return { fields: errorFields, messages: errorMessages };
};