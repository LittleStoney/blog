// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportRedis = require('../../../app/lib/redis');
import ExportUtils = require('../../../app/lib/utils');

declare module 'egg' {
  interface Application {
    lib: T_custom_lib;
  }

  interface T_custom_lib {
    redis: AutoInstanceType<typeof ExportRedis>;
    utils: AutoInstanceType<typeof ExportUtils>;
  }
}
