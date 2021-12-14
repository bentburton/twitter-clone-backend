import jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server';
import dotenv from 'dotenv';
import { Connection } from 'mongoose';

dotenv.config();
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) throw new ApolloError('JWT_SECRET Missing');

interface JWTTokenDecoded {
  id: string;
  username: string;
}

export const generateToken = ({ id, username }: JWTTokenDecoded) => {
  return jwt.sign(
    {
      id,
      username,
    },
    JWT_SECRET,
  );
};

interface GetUserFromTokenParams {
  auth: string;
}

export const getUserFromToken = async ({
  auth,
}: GetUserFromTokenParams): Promise<JWTTokenDecoded> => {
  if (!auth) throw new ApolloError('you must be logged in!');

  const token = auth.split('Bearer ')[1];
  if (!token) throw new ApolloError('you should provide a token!');

  await jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) throw new ApolloError('invalid token!');
    return decoded;
  });

  const user = jwt.decode(token);

  if (user && !(typeof user === 'string') && user?.id && user?.username) {
    return { id: user.id, username: user.username };
  }
  throw new ApolloError('Token miss formatted');
};

export interface AuthenticatedEndpointContext {
  connection: Connection;
  auth: string;
}
