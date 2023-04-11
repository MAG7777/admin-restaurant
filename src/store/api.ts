import { isString } from 'utils/helpers';

export const urls = {
  api: {
    auth: {
      login: {
        post: '/auth/login',
      },
      register: {
        post: '/auth/register',
      },
      registerEmailRetry: {
        post: '/auth/register-email-retry',
      },
      refreshToken: {
        post: '/auth/refresh-token',
      },
      passwordResetRequest: {
        get: '/auth/password-reset-request',
      },
      passwordResetConfirm: {
        post: '/auth/password-reset-confirm',
      },
      emailConfirm: {
        get: '/auth/email-confirm',
      },
    },
    users: {
      get: '/users',
      profile: {
        get: '/users/profile',
      },
    },
    attractions: {
      get: '/attractions',
      getOne: '/attractions/:id',
      post: '/attractions',
      patch: '/attractions/:id',
      draft: {
        post: '/attractions/draft',
        patch: '/attractions/draft/:id',
      },
      publish: {
        patch: '/attractions/publish/:id',
      },
      unPublish: {
        patch: '/attractions/unPublish/:id',
      },
    },
    resorts: {
      get: '/resorts',
      getOne: '/resorts/:id',
      post: '/resorts',
      patch: '/resorts/:id',
      draft: {
        post: '/resorts/draft',
        patch: '/resorts/draft/:id',
      },
      publish: {
        patch: '/resorts/publish/:id',
      },
      unPublish: {
        patch: '/resorts/unPublish/:id',
      },
    },
    routes: {
      get: '/routes',
      getOne: '/routes/:id',
      post: '/routes',
      patch: '/routes/:id',
      draft: {
        post: '/routes/draft',
        patch: '/routes/draft/:id',
      },
      publish: {
        patch: '/routes/publish/:id',
      },
      unPublish: {
        patch: '/routes/unPublish/:id',
      },
    },
    catalog: {
      post: '/catalog',
      patch: '/catalog/:id',
      get: '/catalog',
      getOne: '/catalog/:id',
      delete: '/catalog/:id',
      relations: {
        get: '/catalog/relations',
      },
      regions: {
        get: '/catalog/regions',
      },
    },
    news: {
      draft: {
        post: '/news/draft',
        patch: '/news/draft/:id',
      },
      post: '/news',
      get: '/news',
      getOne: '/news/:id',
      patch: '/news/:id',
      delete: '/news/:id',
      publish: {
        patch: '/news/publish/:id',
      },
      unPublish: {
        patch: '/news/unPublish/:id',
      },
    },
    articles: {
      draft: {
        post: '/articles/draft',
        patch: '/articles/draft/:id',
      },
      post: '/articles',
      get: '/articles',
      getOne: '/articles/:id',
      patch: '/articles/:id',
      delete: '/articles/:id',
      publish: {
        patch: '/articles/publish/:id',
      },
      unPublish: {
        patch: '/articles/unPublish/:id',
      },
    },
    events: {
      get: '/events',
      getOne: '/events/:id',
      post: '/events',
      patch: '/events/:id',
      delete: '/events/:id',
      draft: {
        post: '/events/draft',
        patch: '/events/draft/:id',
      },
      publish: {
        patch: '/events/publish/:id',
      },
      unPublish: {
        patch: '/events/unPublish/:id',
      },
    },
    upload: {
      image: {
        post: '/uploads/image',
      },
      audio: {
        post: '/uploads/audio',
      },
    },
    faq: {
      get: '/question-answer',
      getOne: '/question-answer/:id',
      post: '/question-answer',
      patch: '/question-answer/:id',
    },
  },
};

export const getUrlWithParams = (url: string, params = {}) => {
  if (!isString(url)) {
    throw new Error('url must be string');
  }
  let urlWithParams = url;
  Object.keys(params).forEach(param => {
    if (!params[param]) {
      throw new Error(`Not found param ${param} in url pattern ${url}`);
    }
    urlWithParams = urlWithParams.replace(
      `:${param}`,
      params[param].toString()
    );
  });
  return urlWithParams;
};
