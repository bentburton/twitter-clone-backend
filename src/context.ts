import { ApolloError } from 'apollo-server';
import { getConnection } from './database/Provider';

/**
 * @description holds context for Apollo Server
 */

export const context = async ({ req }: any) => {
  try {
    const dbConn = await getConnection();
    return { dbConn, auth: req.headers.authorization || '' };
  } catch (e) {
    throw new ApolloError(`Error connecting to DB: ${e}`);
  }
};
