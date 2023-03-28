const { GraphQLSchema } = require('graphql');
const queryType = require('./query');
const mutationType = require('./mutation');

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

module.exports = schema;
