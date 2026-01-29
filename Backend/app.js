import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();

// Global middleware
app.use(cors({
  origin: "https://luckybunny.eu", // frontend domain
  credentials: true,
}));
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
