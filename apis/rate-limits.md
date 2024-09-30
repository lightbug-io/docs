---
aside: false
---

# Rate Limits

All API requests can be rate limited and send a [429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) response.

All API responses can include the following headers to help you determine your current rate limit status:

| Header | Description |
| --- | --- |
| X-Ratelimit-Reset | The time at which the current rate limit window resets in UTC epoch seconds. |
| X-Ratelimit-Limit | The maximum number of requests that the consumer is permitted to make per rate limit window. |
| X-Ratelimit-Remaining | The number of requests remaining in the current rate limit window. |

::: tip ℹ️ Info
In some cases, if a rate limit is exceeded, the API will return a `429 Too Many Requests` response without the rate limit headers.
:::

## Example headers:

```txt
x-ratelimit-limit	2000
x-ratelimit-remaining	999
x-ratelimit-reset	1697448304
```

Actual rate limits may vary depending on the API endpoint and vary depending on system loads.

For example, user authentication related endpoints have a much lower rate.
