---
aside: false
---

<script setup lang="ts">
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi/client'
const { isDark } = useData()
import { loadSpec } from '../swagger/load'
const spec1 = loadSpec(1)
const spec2 = loadSpec(2)
useTheme().setHeadingLevels({ h1: 3, h2: 4, h3: 5 })
</script>

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
