require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
// Error Middleware Imports
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes Import
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const progressRoutes = require("./routes/progressRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));




// API Base Routes
app.use("/api/auth", authRoutes);
app.use("/api", pageRoutes); // Home, About

app.use("/api/user", userRoutes); // User Profile
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use("/api/admin", adminRoutes); // Dashboard, Users
app.use('/api/contact', contactRoutes);
// ------------------------------------
// ERROR HANDLING MIDDLEWARES (Must be at the end)
// ------------------------------------

// 1. Invalid Route Handler (404)
app.use(notFound);

// 2. Global Exception Handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend server is running" });
});





async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});