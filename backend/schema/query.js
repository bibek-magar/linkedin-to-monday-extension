const { GraphQLObjectType, GraphQLString } = require('graphql');

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    greeting: {
      type: GraphQLString,
      resolve: async () => 'Hello world!',
    },
  },
});

module.exports = queryType;
