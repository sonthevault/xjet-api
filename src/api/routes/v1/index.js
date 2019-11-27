const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const mediaRoutes = require('./media.route');
const orderRoutes = require('./order.route');
const referralRoutes = require('./referral.route');
const airdropRoutes = require('./airdrop.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/orders', orderRoutes);
router.use('/referrals', referralRoutes);
router.use('/airdrops', airdropRoutes);


module.exports = router;
