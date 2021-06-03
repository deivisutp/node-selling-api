import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSessionsService from '../../../services/CreateSessionsService';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = container.resolve(CreateSessionsService);

    const session = await createSession.execute({
      email,
      password,
    });

    return res.json(classToClass(session));
  }
}
