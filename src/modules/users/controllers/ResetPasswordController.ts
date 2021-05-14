import { Request, Response } from 'express';
import ResetPasswordService from '../services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;

    const resetPasswordService = new ResetPasswordService();

    await resetPasswordService.execute({
      password,
      token,
    });

    //no content
    return res.status(204).json();
  }
}
