const validFields = (obj, requiredFields, objName) => {
  const missingFields = [];

  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === "" || obj[field] === null) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new TypeError(
      `${objName} is missing the following required fields: ${missingFields.join(", ")}`,
    );
  }

  return obj;
};

export default validFields;
