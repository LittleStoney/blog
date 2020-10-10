'use strict';

module.exports = options => {
  return async function https(ctx, next) {
    if (ctx.protocol === 'http') {
      ctx.redirect(ctx.href.replace('http', 'https'));
    } else {
      return next();
    }
  };
};
