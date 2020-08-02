'use strict';

module.exports = options => {
  return async function notFound(ctx, next) {
    await ctx.render('404.html');
    await next();
  };
};
