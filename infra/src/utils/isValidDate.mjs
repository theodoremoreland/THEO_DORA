const isValidDate = (date) => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

export default isValidDate;
