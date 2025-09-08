// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/Error.middleware");

// Import routes
const authRoutes = require("./routes/Auth.routes");
const userRoutes = require("./routes/User.routes");

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// API Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// Custom Error Handling Middleware
app.use(notFound); 
app.use(errorHandler); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
