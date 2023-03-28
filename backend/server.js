const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mondaySDK = require('monday-sdk-js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = require('graphql');
const { UserModel, ItemType } = require('./models');
const schema = require('./schema/schema');
const { port, mondayAPIKey, mongoURL } = require('./config');

const monday = mondaySDK();

const NAME_COLUMN_ID = 'text35';
const EMAIL_COLUMN_ID = 'text3';
const COMPANY_COLUMN_ID = 'dup__of_url';
const URL_COLUMN_ID = 'text0';

monday.setToken(mondayAPIKey);

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

// Handle preflight requests
app.options('*', function (req, res, next) {
  res.sendStatus(200);
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

app.post('/data', (req, res) => {
  const { name, url, company, email } = req.body;
  const data = new MyModel({ name, url, company, email });
  data
    .save()
    .then(() => {
      res.status(200).send('Document saved successfully');
    })
    .catch((error) => {
      res.status(500).send(`Error saving document: ${error}`);
    });
});

function saveDataToMongo(data) {
  const { name, url, company, email } = data;
  const newData = new MyModel({ name, url, company, email });
  newData
    .save()
    .then(() => {
      console.log('Document saved successfully');
    })
    .catch((error) => {
      console.log(`Error saving document: ${error}`);
    });
}

app.post('/monday-webhook', (req, res) => {
  const { challenge } = req.body;

  // If a challenge parameter is present, return the challenge value in the response body
  if (challenge) {
    res.status(200).send(req.body);
  } else {
    // Process the webhook data and update your database or perform any other actions required
    const { event } = req.body;

    const result = {
      name: event.columnValues[NAME_COLUMN_ID].value ?? '',
      email: event.columnValues[EMAIL_COLUMN_ID].value ?? '',
      company: event.columnValues[COMPANY_COLUMN_ID].value ?? '',
      url: event.columnValues[URL_COLUMN_ID].value ?? '',
    };

    saveDataToMongo(result);
    // Send a 200 OK status code back to confirm receipt of the data
    res.sendStatus(200);
  }
});

//API to get user info
app.get('/api/profile/:vanityName', async (req, res) => {
  const { vanityName } = req.params;
  try {
    const response = await axios.get(
      `https://api.linkedin.com/v2/people/(vanityName:${vanityName})?projection=(id,firstName,lastName,company,email,siteStandardProfileRequest)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    const { firstName, lastName, email, company, siteStandardProfileRequest } =
      response.data;

    const data = {
      Name: `${firstName} ${lastName}`,
      Email: email ? email.elements[0]['handle~'].emailAddress : 'N/A',
      Company: company ? company.name : 'N/A',
      URL: siteStandardProfileRequest ? siteStandardProfileRequest.url : 'N/A',
    };

    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
