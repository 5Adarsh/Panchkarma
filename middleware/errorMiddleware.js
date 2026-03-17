// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);

  // If API request → return JSON error
  if (req.originalUrl.startsWith('/api')) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  // Otherwise render an error page
  res.status(500).render('error', {
    title: "Error",
    message: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;
