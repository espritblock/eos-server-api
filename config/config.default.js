'use strict';

module.exports = appInfo => {
  
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_eos_server_api';

  // add your config here
  config.middleware = [];

  exports.security = {
    domainWhiteList: ["localhost"],
    protocolWhiteList: [],
    defaultMiddleware: 'csrf,hsts,methodnoallow,noopen,nosniff,csp,xssProtection,xframe,dta',

    csrf: {
      enable: false,
      useSession: false,
      ignoreJSON: false,
      // can be function(ctx) or String
      cookieDomain: undefined,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
      headerName: 'x-csrf-token',
      bodyName: '_csrf',
      queryName: '_csrf',
    },

    xframe: {
      enable: true,
      // 'SAMEORIGIN', 'DENY' or 'ALLOW-FROM http://example.jp'
      value: 'SAMEORIGIN',
    },

    hsts: {
      enable: false,
      maxAge: 365 * 24 * 3600,
      includeSubdomains: false,
    },

    dta: {
      enable: true,
    },

    methodnoallow: {
      enable: true,
    },

    noopen: {
      enable: true,
    },

    nosniff: {
      enable: true,
    },

    referrerPolicy: {
      enable: false,
      value: 'no-referrer-when-downgrade',
    },

    xssProtection: {
      enable: true,
      value: '1; mode=block',
    },

    csp: {
      enable: false,
      policy: {},
    },

    ssrf: {
      ipBlackList: null,
      checkAddress: null,
    },
  };


  return config;
};
