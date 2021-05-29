import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../infra/typeorm/entities/Order';
import { OrderRepository } from '../infra/typeorm/repositories/OrderRepository';

class ShowOrderService {
  public async execute(id: string): Promise<Order> {
    const orderRepository = getCustomRepository(OrderRepository);

    const order = await orderRepository.findById(id);

    if (!order) throw new AppError('Order not found.');

    return order;
  }
}

export default ShowOrderService;
