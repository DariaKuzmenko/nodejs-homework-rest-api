export const handleSaveError = (error, data, next) => {
  error.status = 400;
  next();
};

export const runValidatorsAtUpdate = function (next) {
  this.getOptions.runValidators = true;
  this.options.new = true;
  next();
};
