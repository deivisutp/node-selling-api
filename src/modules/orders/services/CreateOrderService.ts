import { CustomerRepository } from '@modules/customers/typeorm/repositories/CustomerRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import { OrderRepository } from '../typeorm/repositories/OrderRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const orderRepository = getCustomRepository(OrderRepository);
    const customerRepository = getCustomRepository(CustomerRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customerRepository.findById(customer_id);

    if (!customerExists) throw new AppError('Customer not found.');

    const productsExists = await productsRepository.findAllByIds(products);

    if (!productsExists.length) throw new AppError('Products not found.');

    const existsProductsIds = productsExists.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length)
      throw new AppError(`Product ${checkInexistentProducts[0].id} not found.`);

    const quantityAvailable = products.filter(
      product =>
        productsExists.filter(pr => pr.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length)
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}.`,
      );

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: productsExists.filter(pr => pr.id === product.id)[0].price,
    }));

    const order = await orderRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const updatedProductQuantity = order.order_products.map(product => ({
      id: product.product_id,
      quantity:
        productsExists.filter(pr => pr.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
