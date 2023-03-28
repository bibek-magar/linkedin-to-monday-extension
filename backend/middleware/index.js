const bodyParser = require('body-parser');

const corsMiddleware = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://www.linkedin.com'); // replace with your origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Add support for the HTTP OPTIONS method
  next();
};

const preflightMiddleware = function (req, res, next) {
  res.sendStatus(200);
};

const bodyParserMiddleware = [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
];

module.exports = {
  corsMiddleware,
  preflightMiddleware,
  bodyParserMiddleware,
};
