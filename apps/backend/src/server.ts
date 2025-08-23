// apps/backend/src/server.ts
import express from "express";
import cors from "cors";
import apiRoutes from "./routes";

const app = express();
const PORT = 5001;

// Body-Parser
app.use(express.json());

// ✅ CORS zuerst einhängen (vor allen Routen)
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Preflight-Requests beantworten
app.options("*", cors());

// 🔎 Health/Info
app.get("/", (_req, res) => res.send("Please use /api!"));
app.get("/api", (_req, res) => res.send("Successful connection!"));

// ✅ API v1
app.use("/api/v1", apiRoutes);

// 404 Fallback für unbekannte Endpunkte
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Zentrale Fehlerbehandlung (falls next(err) aufgerufen wird)
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(err?.status || 500).json({ error: err?.message || "Internal Server Error" });
  }
);

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/api`);
});
