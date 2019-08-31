import { Admin } from './models/admin';

export const adminsProviders = [
  {
    provide: 'ADMINS_REPOSITORY',
    useValue: Admin,
  },
];
