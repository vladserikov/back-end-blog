const errorHandler = (error, req, res, next) => {
  console.error('ERROR', error.message);
  console.log('Error name', error.name);

  if (error.name === 'ValidationError'){
    return res.status(401).json({
      error: 'username not unique'
    });
  }

  next(error);
};

module.exports = {
  errorHandler
};