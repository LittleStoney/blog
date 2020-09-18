// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAdmin = require('../../../app/service/admin');
import ExportBlogs = require('../../../app/service/blogs');
import ExportBlogtypes = require('../../../app/service/blogtypes');
import ExportComments = require('../../../app/service/comments');
import ExportHome = require('../../../app/service/home');
import ExportLogin = require('../../../app/service/login');

declare module 'egg' {
  interface IService {
    admin: AutoInstanceType<typeof ExportAdmin>;
    blogs: AutoInstanceType<typeof ExportBlogs>;
    blogtypes: AutoInstanceType<typeof ExportBlogtypes>;
    comments: AutoInstanceType<typeof ExportComments>;
    home: AutoInstanceType<typeof ExportHome>;
    login: AutoInstanceType<typeof ExportLogin>;
  }
}
