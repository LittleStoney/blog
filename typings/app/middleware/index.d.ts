// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportLogin = require('../../../app/middleware/login');
import ExportNotFound = require('../../../app/middleware/notFound');

declare module 'egg' {
  interface IMiddleware {
    login: typeof ExportLogin;
    notFound: typeof ExportNotFound;
  }
}
