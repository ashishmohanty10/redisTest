import express, { Request, Response } from "express";
import { createClient } from "redis";

let redisClient: any;
(async () => {
  redisClient = createClient();
  redisClient.on("error", (error: any) =>
    console.error("Redis Client Error", error)
  );

  await redisClient.connect();
})();

const app = express();
app.use(express.json());

const CACHE_TTL = 3600;

app.get("/withoutredis", async (req: Request, res: Response) => {
  try {
    const data = await fetch("https://jsonplaceholder.typicode.com/todos").then(
      (res) => res.json()
    );

    res.json({ data });
  } catch (error) {
    console.error("Error while fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/withredis", async (req: Request, res: Response) => {
  try {
    const cacheKey = "todos_data";
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      res.json({ data: JSON.parse(cachedData), source: "cache" });
      return;
    }

    const data = await fetch("https://jsonplaceholder.typicode.com/todos").then(
      (res) => res.json()
    );

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));

    res.json({ data, source: "api" });
  } catch (error) {
    console.error("Error while fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

process.on("SIGTERM", async () => {
  await redisClient.quit();
  process.exit(0);
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
