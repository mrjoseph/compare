// pages/api/graphql.js
import { ApolloServer, gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo Server!',
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

let handler;

async function initializeHandler() {
  await apolloServer.start();
  handler = apolloServer.createHandler({ path: '/api/graphql' });
}

initializeHandler();

export default async function graphql(req, res) {
  if (!handler) {
    await initializeHandler();
  }
  return handler(req, res);
}