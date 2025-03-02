---
aside: true
outline: [1,3]
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

API calls that require authentication must have a bearer token submitted as part of the request.

```sh
curl -X GET "https://api.lightbug.cloud/apiEndpoint" -H "Authorization: <token>"'
```

Tokens can be generated from both the v1 and v2 REST APIs, and tokens from either API can be used to authenticate requests to either API.

Tokens might look something like this:
 - `aLB1MKbtxLBb02A0fLFUwJ2nLBMaEFeo8ZLB0gHNCTYIGTJ12oBLB0FMlLBjAlLB`
 - `xLBJhbGciOiJIUzILBiIsILBhjd76IkpXCJ9.eyJle2hs0cy3MjMwMjk1OTjkdhcmcyI6ImdnIiwianRpIjoiZ0luLXNhN3BWYjFTNnhOZFAkchdy2kF2RzlFYzhfV0hlVnJUFUQ0QjN4X3BrbLBvcFh2VUMtX2poM0d0cVlkZ2dvVUUxZ3k0ckg4YTJPNDFxVW8PdUw4OHNPR2hQlkjdbxpWMjU5UE1vb3N5bVFHbmxibW1iYlZRYkNuN2tnRUllTLBLSksyNlNEOEpqbW1qSS15ZjBJSnZHU3NCeWhBekN3R1dwTXhoLBFrcE9VbS1lVkxTb1pwYUlhWkhkQlVycWtlUi1aNE55SnF4SEg4ZmpUaGw1bE81aHZFNVY1lkg890FCTk85anZjMlRRcGdiUGN0dGNazsdfyzBGOFdzIiwibmFtZSI6ImFkYW1AbGllkHRidWcuaW8iLCJzdWIiOjM4MDh9.LBpcVEbm0sywbcPScTg9j54SxdNydJuC_vncrh-fDps`

## Version 2

<OAOperation operationId="post-users-login" :spec="spec2" :isDark="isDark" :hideBranding="true"/>

<OAOperation operationId="post-users-refreshToken" :spec="spec2" :isDark="isDark" :hideBranding="true"/>

## Version 1

<OAOperation operationId="post-users-login" :spec="spec1" :isDark="isDark" :hideBranding="true"/>
