---
aside: false
---

# Rate Limits

All API requests can be rate limited and send a [429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) response.

All API responses can include the following headers to help you determine your current rate limit status:

| Header                | Description                                                                                  | Source           |
| --------------------- | -------------------------------------------------------------------------------------------- | ---------------- |
| X-Ratelimit-Limit     | The maximum number of requests that the consumer is permitted to make per rate limit window. | All              |
| X-Ratelimit-Remaining | The number of requests remaining in the current rate limit window.                           | All              |
| X-Ratelimit-Reset     | The time at which the current rate limit window resets in UTC epoch seconds.                 | Application |
| X-Ratelimit-Window    | Number of seconds of the window.                                                             | Edge |

The `Source` refers to the source of the rate limit. Rate limits will most commonly be set by the application, but may also be set by the edge.

Actual rate limits may vary depending on the API endpoint and vary depending on system loads.

For example, user authentication related endpoints have a much lower rate.

## Example headers:

Generally the API will have a large rate limit.

The below example shows a rate limit of 2000 requests, with 1999 remaining, and the reset time in epoch seconds.

```txt
x-ratelimit-limit	    2000
x-ratelimit-remaining	1999
x-ratelimit-reset	    1697448304
```

Some endpoints may have a lower rate limit.

For example authentication related endpoints may have a rate limit of 12 requests.

```txt
x-ratelimit-limit	    12
x-ratelimit-remaining	11
x-ratelimit-reset	    1697448304
```

If you get rate limited by the edge, you won't receive a reset time, but you will receive a window period.

```txt
x-ratelimit-limit	    2000
x-ratelimit-remaining	0
x-ratelimit-window      300
```
