const logger = (res, req, next) => {
  req.hello = "hello world";
  console.log("middleware");
  next();
};

module.exports = logger;
