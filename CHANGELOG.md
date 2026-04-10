# Changelog

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
