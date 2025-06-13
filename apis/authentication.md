---
aside: false
---

# Authentication

Authentication for the Lightbug APIs make use of Bearer tokens in the `Authorization` header.

API calls that require authentication must have a bearer token submitted in the header, such as `Authorization: <token>`.

Tokens can be used universally across the various Lightbug API versions.

## Recommended

We recommend using the latest version of the API for authentication.

 - <OAOperationLink method="POST" title="/v2/users/login - Username &amp; Password login (preferred)"/>
 - <OAOperationLink method="POST" title="/v2/users/refreshToken - Optionally refresh a login token"/>
 - <OAOperationLink method="POST" title="/v2/users/personalAccessTokens - Generate a personal access token (longer life)"/>

## Legacy

The V1 API is still available for authentication, but does not support refresh tokens or personal access tokens.

 - <OAOperationLink method="POST" title="/api/users/login - Username &amp; Password login"/>
