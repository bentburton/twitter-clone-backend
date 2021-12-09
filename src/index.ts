import { ApolloError } from 'apollo-server';

/**
 * @description holds server main
 */

// configuring environment variables
import dotenv from 'dotenv';

// creating apollo server
import apolloServer from './graphql';

dotenv.config();

const port: string = process.env.PORT as string;

if (!port) throw new ApolloError('PORT missing from ENV');

// start listening
apolloServer.listen(port).then(({ url }) => {
  console.log(`Apollo Server is running on ${url} `);
});
