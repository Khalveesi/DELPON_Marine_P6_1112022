const expressRateLimit = require('express-rate-limit')

const limiter = expressRateLimit({
	windowMs: 60 * 1000,
	max: 1,
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = limiter;