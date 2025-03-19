import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const authenticateToken = ({req}: any) => {
  // const authHeader = req.headers.authorization;
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
   return req;
  }

// Try to verify the token
  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    // If the token is valid, attach the user data to the request object
    req.user = data;
  } catch (err) {
    // If the token is invalid, log an error message
    console.log('Invalid token');
  }

// Return the request object
  return req;
};


export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY;

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};



// import type { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// import dotenv from 'dotenv';
// dotenv.config();

// interface JwtPayload {
//   _id: unknown;
//   username: string;
//   email: string,
// }

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     const secretKey = process.env.JWT_SECRET_KEY || '';

//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403); // Forbidden
//       }

//       req.user = user as JwtPayload;
//       return next();
//     });
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };

// export const signToken = (username: string, email: string, _id: unknown) => {
//   const payload = { username, email, _id };
//   const secretKey = process.env.JWT_SECRET_KEY || '';

//   return jwt.sign(payload, secretKey, { expiresIn: '1h' });
// };
