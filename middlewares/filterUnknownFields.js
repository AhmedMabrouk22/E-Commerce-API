module.exports = (allowedFields) => (req, res, next) => {
  Object.keys(req.body).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete req.body[field];
    }
  });
  next();
};
