import { Request, Response } from 'express';
import CreateSessionsService from '../../../services/CreateSessionsService';
import { classToClass } from 'class-transformer';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = new CreateSessionsService();

    const session = await createSession.execute({
      email,
      password,
    });

    return res.json(classToClass(session));
  }
}