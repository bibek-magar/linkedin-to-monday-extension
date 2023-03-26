const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mondaySDK = require('monday-sdk-js');
const { v1: uuidv1 } = require('uuid');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = require('graphql');

const monday = mondaySDK();

const MONDAY_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI0NjkyNTYwOSwidWlkIjo0MTM4MDIyOSwiaWFkIjoiMjAyMy0wMy0yNVQxNDowODozNi4zNTRaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTYyMDE5NDEsInJnbiI6InVzZTEifQ.b1cPBfc1kr99_CYaDXEieoIeJeBSymmKdZRgyTa8U1Q';
monday.setToken(MONDAY_API_KEY);

const BOARD_ID = 4189447431;
const GROUP_ID = 'new_group37570';
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
        resolve: async (parent, args) => {
          const { name, url, company, email } = args;

          const columnValues = {
            text35: name,
            text3: email,
            dup__of_url: company,
            text0: url,
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

          console.log(res.data);
          const { id, column_values } = res.data.create_item;
          const createdItem = {
            id,
            name,
            // name: column_values.find((c) => c.id === '<YOUR_URL_COLUMN_ID>')
            //   .value,

            // url: column_values.find((c) => c.id === '<YOUR_URL_COLUMN_ID>')
            //   .value,
            // company: column_values.find(
            //   (c) => c.id === '<YOUR_COMPANY_COLUMN_ID>'
            // ).value,
            // email: column_values.find((c) => c.id === '<YOUR_EMAIL_COLUMN_ID>')
            //   .value,
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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
