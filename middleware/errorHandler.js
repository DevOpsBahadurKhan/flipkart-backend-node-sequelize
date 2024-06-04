module.exports = (error, req, res, next) => {
  let status = error.statusCode || 500;
  let message = error.message;
  const validation = error.validation;
  let data = null;


  if (error.name === 'SequelizeValidationError') {
    status = 400;
    message = 'Validation Error';
    data = error.errors.map((errorItem) => ({
      field: errorItem.path,
      message: errorItem.message,
    }));
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    message = 'Unique Constraint Violation';
    data = error.errors.map((errorItem) => ({
      field: errorItem.path,
      message: `Duplicate value found for ${errorItem.path}.`,
    }));
  }

  // Log the error for debugging purposes.
  console.error(error);



  res.status(status).json({
    statusCode: status,
    message,
    data,
    validation,

  });
};
