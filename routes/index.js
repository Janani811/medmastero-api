import UserType from './user_type/index.js';
import Auth from './auth/index.js';
import User from './user/index.js';
import Public from './public/index.js';

export default function routes(app) {
  app.use('/', Public)
  app.use('/user-type', UserType);
  app.use('/auth', Auth);
  app.use('/user', User);
};
