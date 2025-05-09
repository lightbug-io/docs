---
aside: false
---

# Authentication

Authentication for the Lightbug APIs make use of Bearer tokens in the `Authorization` header.

API calls that require authentication must have a bearer token submitted in the header, such as `Authorization: <token>`.

Tokens can be used universally across the various Lightbug API versions.

## Recommended

We recommend using the latest version of the API for authentication.

 - **POST** `/v2/users/login` [Username & Password login (preferred)](/apis/v2/post-users-login)
 - **POST** `/v2/users/refreshToken` [Optionally refresh a login token](/apis/v2/post-users-refreshToken)
 - **POST** `/v2/users/personalAccessTokens` [Generate a personal access token (longer life)](/apis/v2/post-users-personalAccessTokens)

## Legacy

The V1 API is still available for authentication, but does not support refresh tokens or personal access tokens.

 - **POST** `/api/users/login` [Username & Password login](/apis/v1/post-users-login)
