import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export default class UsersAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    return res.json(classToClass(user));
  }
}
