const { GraphQLObjectType, GraphQLString } = require('graphql');
const { ItemType } = require('../models');
const mondayService = require('../services/mondayService');

const mutationType = new GraphQLObjectType({
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

        try {
          const item = await mondayService.createItem(
            name,
            url,
            company,
            email
          );

          return item;
        } catch (err) {
          console.log(`Mutation error ${err}`);
        }
      },
    },
  },
});

module.exports = mutationType;
