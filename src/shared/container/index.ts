import { container } from 'tsyringe';

import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import CustomerRepository from '@modules/customers/infra/typeorm/repositories/CustomerRepository';

import '@modules/users/providers/HashProvider';

container.registerSingleton<ICustomersRepository>(
  'CustomerRepository',
  CustomerRepository,
);
