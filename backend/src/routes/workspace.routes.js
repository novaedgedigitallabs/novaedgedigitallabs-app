const express = require('express');
const router = express.Router();
const { getWorkspaceOverview } = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/overview', protect, getWorkspaceOverview);

module.exports = router;
