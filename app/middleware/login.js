'use strict';

module.exports = options => {
  return async function login(ctx, next) {
    if (ctx.request.url !== '/admin/login' && ctx.request.url !== '/admin/check') {
      if (ctx.cookies.get('login')) {
        await next();
      } else {
        ctx.body = '<script>location.href="/admin/login"</script>';
      }
    } else {
      await next();
    }
  };
};
