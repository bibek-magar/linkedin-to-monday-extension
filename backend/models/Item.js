const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

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

module.exports = ItemType;
