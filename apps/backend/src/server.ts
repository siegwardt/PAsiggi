import express from "express";
import cors from "cors";
import apiRoutes from "./router";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.get("/", (_req, res) => res.send("Please use /api!"));
app.get("/api", (_req, res) => res.send("Successful connection!"));

app.use("/api/v1", apiRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(err?.status || 500).json({ error: err?.message || "Internal Server Error" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/api`);
});
