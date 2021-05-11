import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new AppError('JWT Token is missing.');

  const parts = authHeader.split(' ');

  if (parts.length !== 2) throw new AppError('Token error');

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) throw new AppError('Token malformatted');

  verify(token, authConfig.jwt.secret, (err, decoded) => {
    if (err) throw new AppError('Token invalid');

    const { sub } = decoded as ITokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  });
}
