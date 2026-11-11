// middleware/errorMiddleware.js

// 404 Not Found Middleware (Jab koi aisa route hit ho jo exit hi nahi karta)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  // Agar status code pehle se set na ho ya 200 ho, toh default 500 (Server Error) set karein
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Development mode mein error details/stack trace milegi, production mein hide ho jayegi
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };