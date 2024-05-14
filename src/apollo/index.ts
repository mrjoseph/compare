import { gql } from 'apollo-server-micro'
import { helloResolver } from './resolvers'

export const typeDefs = gql`
  type Query {
    hello: String
  }
`
export const resolvers = {
  Query: {
    hello: helloResolver,
  },
  // Mutations: {},
}

export const dataSources = () => {
  return {
    // Add data sources here
  }
}
