// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUtils = require('../../../app/lib/utils');

declare module 'egg' {
  interface Application {
    utils: T_utils;
  }

  interface T_utils {
    utils: ExportUtils;
  }
}
