# Simple Experiment to Benchmark Redis Performance

This project demonstrates the performance improvement that Redis caching can provide for API responses.

## Overview

The experiment includes two endpoints:

1. **`/withoutredis`**: 
   - Fetches data from an external API and returns the response.
   - Response time is typically **1000 ms or more**, as each request fetches fresh data without caching.

2. **`/withredis`**: 
   - Fetches data from the same API, but leverages Redis caching.
   - On the **first request**, data is fetched from the external API, resulting in a response time similar to `/withoutredis`.
   - On **subsequent requests**, the response is served from Redis, reducing the response time to **4–10 ms**, demonstrating the speed advantage of using Redis caching.

## How It Works

- The **first request** to `/withredis` fetches data from the API, similar to `/withoutredis`, resulting in a higher response time.
- On **subsequent requests** to `/withredis`, the data is served directly from the Redis cache, leading to faster response times (4-10 ms).
- Redis stores the API response, allowing repeated queries to avoid fetching the same data from the original API.

## Benefits of Using Redis Cache

- **Faster Response Times**: Redis caching reduces response times from over 1000 ms to just 4-10 ms on subsequent requests.
- **Reduced Load on External API**: Once data is cached in Redis, subsequent requests are served from the cache, reducing the load on the external API and improving overall system performance.
