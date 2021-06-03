import BcryptHashProvider from './implementations/BcryptHashProvider';

import { container } from 'tsyringe';
import { IHashProvider } from './models/IHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
