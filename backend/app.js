const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const mongoose = require('mongoose');

const graphqlSchema = require('./schema/schema');
const dataRoutes = require('./routes/data');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const schema = makeExecutableSchema(graphqlSchema);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use('/data', dataRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to connect to MongoDB: ${err}`);
  });
