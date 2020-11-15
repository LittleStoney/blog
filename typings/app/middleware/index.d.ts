// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHttps = require('../../../app/middleware/https');
import ExportLogin = require('../../../app/middleware/login');
import ExportNotFound = require('../../../app/middleware/notFound');

declare module 'egg' {
  interface IMiddleware {
    https: typeof ExportHttps;
    login: typeof ExportLogin;
    notFound: typeof ExportNotFound;
  }
}
