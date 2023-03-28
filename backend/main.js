const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mondaySDK = require('monday-sdk-js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRepository = require('./repository/saveUserInfo');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = require('graphql');
const { port } = require('./config');
const { UserModel } = require('./models');
const schema = require('./schema/schema');

const mongoConnectionString =
  'mongodb+srv://beevekmgr:test1234@cluster0.qyywtxu.mongodb.net/?retryWrites=true&w=majority';
const MONDAY_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI0NjkyNTYwOSwidWlkIjo0MTM4MDIyOSwiaWFkIjoiMjAyMy0wMy0yNVQxNDowODozNi4zNTRaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTYyMDE5NDEsInJnbiI6InVzZTEifQ.b1cPBfc1kr99_CYaDXEieoIeJeBSymmKdZRgyTa8U1Q';
const monday = mondaySDK();

const NAME_COLUMN_ID = 'text35';
const EMAIL_COLUMN_ID = 'text3';
const COMPANY_COLUMN_ID = 'dup__of_url';
const URL_COLUMN_ID = 'text0';

monday.setToken(MONDAY_API_KEY);

const app = express();

// Enable CORS middleware
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://www.linkedin.com'); // replace with your origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Add support for the HTTP OPTIONS method
  next();
});

// Handle preflight requests
app.options('*', function (req, res, next) {
  res.sendStatus(200);
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/monday-webhook', (req, res) => {
  const { challenge } = req.body;

  // If a challenge parameter is present, return the challenge value in the response body
  if (challenge) {
    res.status(200).send(req.body);
  } else {
    // Process the webhook data and update your database or perform any other actions required
    const { event, _ } = req.body;

    const result = {
      name:
        event.columnValues[NAME_COLUMN_ID] != null
          ? event.columnValues[NAME_COLUMN_ID].value
          : '',
      email:
        event.columnValues[EMAIL_COLUMN_ID] != null
          ? event.columnValues[EMAIL_COLUMN_ID].value
          : '',
      company:
        event.columnValues[COMPANY_COLUMN_ID] != null
          ? event.columnValues[COMPANY_COLUMN_ID].value
          : '',
      url:
        event.columnValues[URL_COLUMN_ID] != null
          ? event.columnValues[URL_COLUMN_ID].value
          : '',
    };

    userRepository.saveUserInfo(result);
    // Send a 200 OK status code back to confirm receipt of the data
    res.sendStatus(200);
  }
});

// Start the server
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

console.log('Monday', monday);

module.exports = {
  mondayServer: monday.api,
};
