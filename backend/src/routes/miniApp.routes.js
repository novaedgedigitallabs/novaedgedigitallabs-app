const express = require('express');
const router = express.Router();
const miniAppController = require('../controllers/miniApp.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', miniAppController.getActiveMiniApps);
router.post('/', protect, authorize('admin'), miniAppController.createMiniApp);
router.put('/:id', protect, authorize('admin'), miniAppController.updateMiniApp);

module.exports = router;
