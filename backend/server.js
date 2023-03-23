const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');
const axios = require('axios');
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', () => console.error('MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB database!'));

let accessToken =
  'AQVSes_h2vKQPgUbDExmRAQxA6MYFbVMIUfx0VYkDgV8SPYnDiNgOLzKcG6rUJOfSKIDyyqc67hdWmS9icL1NlD7ju3_01WsUtSyamsSSobWEd8FAtMeeJWKOq7CHKdOjdHWRm7EGD90GaSrmG-P8Wg2pdlPqYJzGJ-6eDOur3qt-UdTtPOiLBk8_RUNfp5zVPJU8Uv47Ms84fx61fi02Rh12Jm62o1wexJxWgQVrQWvScWeq1HJ9pBp85JAl6gjQa3dNoNTx9lAaUxiDogscUFFVqlbN26yChVZAgdPsanOhH7oZdf5maTNtvgkEyig5uER7RzqJd9C4azHB1v1LpEO91jaEA';
let clientID = '861v33rqidrqhx';
let clientSecret = '861v33rqidrqhx';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => 'Hello, world!',
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

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

app.get('/api/profile-by-id/:id', async (req, res) => {
  const { id } = req.params;
  let personID = '12321';
  try {
    const response = await axios.get(
      `https://api.linkedin.com/v2/people/${id}`,
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

app.listen(3000, () => console.log('Server started on port 3000!'));
