const express = require('express');
const router = express.Router();

/* Ping */
router.get('/', (req, res, next) => {
  res.send('Pong!');
});

module.exports = router;
