const formatErrors = errors => {
  const formattedErrors = [];
  errors.forEach(error => {
    formattedErrors.push(error.message);
  });

  return formattedErrors;
};

module.exports = formatErrors;
