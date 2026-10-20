const isValidDate = (date) => {
  const _date = new Date(date);

  return _date instanceof Date && !Number.isNaN(_date.getTime());
};

export default isValidDate;
