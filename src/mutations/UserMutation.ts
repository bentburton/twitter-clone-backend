import { registerUser, loginUser } from '../controllers/UserController';
import { IUser } from '../models/UserModel';

/**
 * @description holds user mutations
 */

export const UserMutation = {
  registerUser: {
    resolve: async (_parent: any, args: { input: IUser }, context: { dbConn: any }, _info: any) => {
      return registerUser(context.dbConn, args.input);
    },
  },
  loginUser: {
    resolve: async (_parent: any, args: { input: IUser }, context: { dbConn: any }, _info: any) => {
      return loginUser(context.dbConn, args.input);
    },
  },
};
