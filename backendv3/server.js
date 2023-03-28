const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mondaySDK = require('monday-sdk-js');
const { v1: uuidv1 } = require('uuid');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = require('graphql');

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
const BOARD_ID = 4189447431;
const GROUP_ID = 'new_group37570';
const COLUMN_ID = 4202038482;

const ITEM_NAME = uuidv1();

const ItemType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    company: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      greeting: {
        type: GraphQLString,
        resolve: async () => 'Hello world!',
      },
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createItem: {
        type: ItemType,
        args: {
          name: { type: GraphQLString },
          url: { type: GraphQLString },
          company: { type: GraphQLString },
          email: { type: GraphQLString },
        },
        resolve: async (_, args) => {
          const { name, url, company, email } = args;

          const columnValues = {
            [NAME_COLUMN_ID]: name,
            [EMAIL_COLUMN_ID]: email,
            [COMPANY_COLUMN_ID]: company,
            [URL_COLUMN_ID]: url,
          };

          const res = await monday.api(`
          mutation {
            create_item(
              board_id: ${BOARD_ID},
              group_id: ${GROUP_ID},
              item_name: "${ITEM_NAME}",
              column_values: "${JSON.stringify(columnValues).replace(
                /"/g,
                '\\"'
              )}"
            ) {
              id
              name
              column_values {
                id
                title
                value
              }
            }
          }
           `);

          const { id, column_values } = res.data.create_item;
          const createdItem = {
            id,
            name,
          };
          return createdItem;
        },
      },
    },
  }),
});

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

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const UserSchema = mongoose.Schema;

const userSchema = new UserSchema({
  name: String,
  url: String,
  company: String,
  email: String,
});

const MyModel = mongoose.model('LinkedInData', userSchema);

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

// Define your schema and model
const MondaySchema = mongoose.Schema;

const mondaySchema = new MondaySchema({
  boardId: Number,
  itemId: Number,
  columnId: Number,
  value: String,
});

app.post('/monday-webhook', (req, res) => {
  const { challenge } = req.body;

  // If a challenge parameter is present, return the challenge value in the response body
  if (challenge) {
    res.status(200).send(req.body);
  } else {
    // Process the webhook data and update your database or perform any other actions required
    const { event, payload } = req.body;

    console.log(event);
    console.log(
      `Received ${event.columnValues[EMAIL_COLUMN_ID].value} event from Monday.com with payload:`,
      payload
    );

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

// Start the server
const port = 3000;

app.listen(port, () => {
  console.log('Server started on port 3000');
});
