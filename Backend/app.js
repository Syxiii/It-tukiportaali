//fix
import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();

// Global middleware

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: "http://localhost:5173", // must match frontend exactly
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
}

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/stats", statsRoutes);

app.set("trust proxy", 1);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "IT-tukiportaali API on käynnissä",
    version: "1.0.0"
  });
});

// Global error handler (LAST)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Palvelinvirhe" });
});

const isProd = process.env.NODE_ENV === "production";
const PORT = isProd ? 3000 : 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running in ${isProd ? "production" : "development"} on port ${PORT}`
  );
});

export default app;
