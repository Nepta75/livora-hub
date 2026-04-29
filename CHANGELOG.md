# Changelog

## [0.3.0](https://github.com/Nepta75/livora-hub/compare/livora-hub-v0.2.1...livora-hub-v0.3.0) (2026-04-29)


### Features

* **admin:** plan stripe sync UI, sub enrichment, audit logs page ([8507b10](https://github.com/Nepta75/livora-hub/commit/8507b10364dceafe3b1cbe9ce1336f38d7737f3d))
* **plans:** add plan CRUD and subscription management in hub ([b40c0d7](https://github.com/Nepta75/livora-hub/commit/b40c0d7fc5da6f34d78c493b3f56481dd1c734d2))
* **plans:** ctaLabel in admin form ([783b6cc](https://github.com/Nepta75/livora-hub/commit/783b6cc9b94e6002176ad7773e5d78f1c404524c))
* **plans:** dynamic pricing fields, isVisible/isFeatured, dual Stripe price IDs ([76e7d04](https://github.com/Nepta75/livora-hub/commit/76e7d04e8d36116539d3fb8190e42684e9d989d2))
* **plans:** edit safety banner + price change confirm dialog ([642578f](https://github.com/Nepta75/livora-hub/commit/642578f5ca796f7342eab61d08ef3ef1760cc7a6))
* **plans:** history section on plan detail + extract AuditLogCard ([73c479f](https://github.com/Nepta75/livora-hub/commit/73c479ff963e033d33f7e89d9cff0547878fefa7))
* **plans:** stripe sync badge on list, require monthly price ([e4dc297](https://github.com/Nepta75/livora-hub/commit/e4dc297dbf8938d61540604c553a8be35548c4fa))
* **promo-codes:** admin CRUD + shared action palette ([ecb7235](https://github.com/Nepta75/livora-hub/commit/ecb72359d311f6556665335cb72dcfcf0af87c24))
* **promo-codes:** edit + display applicable billing periods ([dc93ec9](https://github.com/Nepta75/livora-hub/commit/dc93ec9a0b4ef0961b13da0aa72ddc13f638d9f2))
* **promo-codes:** edit dialog for max redemptions ([9e22e0e](https://github.com/Nepta75/livora-hub/commit/9e22e0e69e4a0a6a2259fead4c0f5a76c1b0f2d3))
* **promo-codes:** show applicable billing periods on the edit dialog ([ba73be0](https://github.com/Nepta75/livora-hub/commit/ba73be0f90962e0b6b3cc6a6cb57d7ce0ebcea16))
* **promo-codes:** support trial and discount types in admin UI ([75700af](https://github.com/Nepta75/livora-hub/commit/75700af3064392edc401270316e9f7aaeb2128a7))
* **promo:** guard rules editor + map sync errors ([eb8b339](https://github.com/Nepta75/livora-hub/commit/eb8b33973e99e8a99362204a8f341e7e58913365))
* **tenant:** subscription invoices section on tenant detail ([afffc7e](https://github.com/Nepta75/livora-hub/commit/afffc7e5ebd3c64d3cc1fbc7cfcc4f5c4ee6a587))
* **types:** honor nullable:true in generated types ([3d86b32](https://github.com/Nepta75/livora-hub/commit/3d86b323fe128c560ced6d713c650fba74388d8d))


### Bug Fixes

* **docker:** expose env as .env in production image ([80e300e](https://github.com/Nepta75/livora-hub/commit/80e300edb4fceb146201073c439a4f944ec91939))
* **docker:** write env file to .env.production ([bdb1558](https://github.com/Nepta75/livora-hub/commit/bdb15586db0437f0b501e8af249a2d8fa7f74c38))
* **env:** set NEXT_PUBLIC_STRIPE_MODE per environment ([6e0d0a5](https://github.com/Nepta75/livora-hub/commit/6e0d0a56b5c6d49f3fd40d385c35ed02734c153a))
* **logs:** wrap useSearchParams in Suspense boundary ([8fdf3c4](https://github.com/Nepta75/livora-hub/commit/8fdf3c4335aa5d0402f4841656b67e7762abec45))
* **promo-codes:** apply review findings on admin UI ([1aaed14](https://github.com/Nepta75/livora-hub/commit/1aaed14d39da618e66d111ad15bafad80bd8cff1))

## [0.2.1](https://github.com/Nepta75/livora-hub/compare/livora-hub-v0.2.0...livora-hub-v0.2.1) (2026-04-10)


### Bug Fixes

* **docker:** replace cp with COPY to avoid same-file error on prod build ([aa7e3e3](https://github.com/Nepta75/livora-hub/commit/aa7e3e32b241ac09f0df81ecac67b1048bfdd781))

## [0.2.0](https://github.com/Nepta75/livora-hub/compare/livora-hub-v0.1.0...livora-hub-v0.2.0) (2026-04-10)


### Features

* add more info for audit logs ([3212d14](https://github.com/Nepta75/livora-hub/commit/3212d1450f8ef71fea9cffe587bd817326d437fd))
* display impersonation audit logs on tenant page ([8f2b586](https://github.com/Nepta75/livora-hub/commit/8f2b58667468a47b3c3c7fc4e93f8b1c8807f388))
* **hub:** add full admin back office for hub and tenant management ([1c02b72](https://github.com/Nepta75/livora-hub/commit/1c02b720d6553dc93b37009d7f8a42a450405db3))
* **hub:** make layout responsive for mobile ([a600d73](https://github.com/Nepta75/livora-hub/commit/a600d73d8278bd708723c119b49b242d19296319))
* impersonate per-user with button in users table ([e40cf22](https://github.com/Nepta75/livora-hub/commit/e40cf226fe31e28c3701034f40a05249857ab1a7))
* initial commit ([675647d](https://github.com/Nepta75/livora-hub/commit/675647ded2933da3f6d78c58beb26b90ed3ee0e9))
* **seed:** add seed button on dashboard for non-prod envs ([bf17ba5](https://github.com/Nepta75/livora-hub/commit/bf17ba52531d3a6d06b226b106a9aafe3739d7ba))
* **tenants:** add impersonation to access vista-app as tenant ([a94293b](https://github.com/Nepta75/livora-hub/commit/a94293b33d3b4f35023726e8a3675f09be6bd04a))
* **tenants:** add tenant edit form on detail page ([c82a954](https://github.com/Nepta75/livora-hub/commit/c82a95420ae968f8eee030fb4f1f47dd7f2178eb))


### Bug Fixes

* **auth:** clear stale hub_token cookie before login to prevent invalid JWT error ([2342764](https://github.com/Nepta75/livora-hub/commit/234276446fe17846384abe50184b4626119d14c7))
* **build:** use .env.preprod for preprod builds via ENV arg ([58db73b](https://github.com/Nepta75/livora-hub/commit/58db73b6ef650d6c6f22b7438d1a6fa284d8e6e3))
* **docker:** install curl in production stage for healthcheck ([6ec02e2](https://github.com/Nepta75/livora-hub/commit/6ec02e2ddba4a433fd3a970cce5c30018d89fd0d))
* **docker:** remove COPY of public/ dir which does not exist ([641f601](https://github.com/Nepta75/livora-hub/commit/641f6011426076222cdda31113089f42cf02f46a))
* **env:** correct vista-app URLs (no app. subdomain) ([9bd4eae](https://github.com/Nepta75/livora-hub/commit/9bd4eaecb48570345a0985ce8b0302a76f1c821a))
* **http:** include credentials for Cloudflare Access support ([e293d17](https://github.com/Nepta75/livora-hub/commit/e293d17cf41df941235285110645cc0eedd7ffcb))
* **http:** read message field from API error responses ([28617e7](https://github.com/Nepta75/livora-hub/commit/28617e72768f71a7cfe31531247b26efc96ddb02))
* **tenants:** add missing accountHolderName field to create tenant form ([5191d79](https://github.com/Nepta75/livora-hub/commit/5191d791a2d8a604758b1eeea2917274129409d5))
* use generated ImpersonationLog type instead of manual ([2ebadbe](https://github.com/Nepta75/livora-hub/commit/2ebadbe5dc8d484e7fc063e1bff2bb053cef70ef))
