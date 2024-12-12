---
outline: deep
---

# Examples

| Description                          | Example |
| ---------------------------------- | -- |
| Type 3, header empty, data empty | 3 11 0 1 0 0 0 0 0 75 190 |
| .. as above, with LB prefix bytes |  76 66 3 11 0 1 0 0 0 0 0 75 190 |
| Type 6, header (1:1), data empty | 3 14 0 6 0 1 0 1 1 1 0 0 217 95 |
| Type 6, header (1:9), data empty | 3 14 0 6 0 1 0 1 1 9 0 0 120 246 |
| Type 10009, header empty, data (10:hello) | 3 18 0 25 39 0 0 1 0 10 5 104 101 108 108 111 118 77 |
