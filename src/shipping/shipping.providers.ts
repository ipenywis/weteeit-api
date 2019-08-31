import { Shipping } from './models/shipping';

export const shippingsProviders = [
  {
    provide: 'SHIPPINGS_REPOSITORY',
    useValue: Shipping,
  },
];
