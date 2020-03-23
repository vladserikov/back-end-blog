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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor
};