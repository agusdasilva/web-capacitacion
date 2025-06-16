const express = require('express');
const router = express.Router();

// Simple health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

module.exports = router;
