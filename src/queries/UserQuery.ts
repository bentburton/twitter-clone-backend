import { getAllUsers, getUserByAuth } from '../controllers/UserController';

/**
 * @description holds user queries
 */

export const UserQuery = {
  users: {
    resolve: async (
      _parent: any,
      _args: any,
      context: { dbConn: any; auth: string },
      _info: any,
    ) => {
      return getAllUsers(context.dbConn);
    },
  },
  currentUser: {
    resolve: async (
      _parent: any,
      _args: any,
      context: { dbConn: any; auth: string },
      _info: any,
    ) => {
      return getUserByAuth({ connection: context.dbConn, auth: context.auth });
    },
  },
};
