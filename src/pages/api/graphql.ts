// pages/api/graphql.js

import { ApolloServer } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { resolvers, typeDefs, dataSources } from '@/apollo'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  dataSources,
})

export default await server
  .start()
  .then(() => server.createHandler({ path: '/api/graphql' }))

export const config = {
  api: {
    bodyParser: false,
  },
}
