const express = require('express');
const router = express.Router();
const miniAppController = require('../controllers/miniApp.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkAdmin } = require('../middleware/admin.middleware');

router.get('/', miniAppController.getActiveMiniApps);
router.post('/', protect, checkAdmin, miniAppController.createMiniApp);
router.put('/:id', protect, checkAdmin, miniAppController.updateMiniApp);

module.exports = router;
