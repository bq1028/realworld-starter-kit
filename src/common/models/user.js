const returnedInstance = (ctx) => ({
  user: {
    email: ctx.email,
    username: ctx.username,
    bio: ctx.bio || null,
    image: ctx.image || null,
    token: ctx.token,
  },
});

const normalizeInstance = (body) => ({
  email: body.email,
  password: body.password,
  username: body.username,
});

const normalizeLoginRequest = (body) => ({
  email: body.email,
  password: body.password,
});

module.exports = (User) => {
  User.beforeRemote('login', (ctx, modelInstance, next) => {
    const newBody = normalizeLoginRequest(ctx.req.body.user);
    ctx.req.body = newBody;
    ctx.args.data = newBody;
    ctx.args.credentials = newBody;
    next();
  });
  User.afterRemote('login', (ctx, modelInstance, next) => {
    const newResult = {
      user: {
        email: ctx.result.userId,
        token: ctx.result.id,
      },
    };

    ctx.result = newResult;
    next();
  });

  User.beforeRemote('create', (ctx, modelInstance, next) => {
    const normalizedBody = normalizeInstance(ctx.req.body.user);
    ctx.args.data = normalizedBody;
    ctx.req.body = normalizedBody;
    next();
  });

  User.afterRemote('create', (ctx, modelInstance, next) => {
    const data = returnedInstance(modelInstance);
    User.login(
      {
        email: ctx.req.body.email,
        password: ctx.req.body.password,
      },
      (err, token) => {
        data.user.token = token.id;
        ctx.result = data;
        next();
      }
    );
  });
};
