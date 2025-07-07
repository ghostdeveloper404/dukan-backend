exports.next = ((error, req, res, next) => {
    
    const status = error.statusCode || 500 ;
    const message = error.message || 'Internal Server Error';
    const data = error.data || null ;
    res.status(status).json({
        message: message,
        statusCode: status,
        errorData: data
    });
});

exports.bodyValidator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log('Validation error:', error.details); // Add this line
    return res.status(400).json({ message: error.message, details: error.details });
  }
  next();
};

exports.route = ((req, res, next) => {
    const err = new Error('Think twice about route!')
    err.statusCode = 404;
    next(err)
})