const express = require('express');
const router = express.Router();
const { 
    updateFcmToken, 
    getNotifications, 
    markAsRead, 
    sendPushNotification 
} = require('../controllers/notification.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Routes accessible to all authenticated users
router.use(protect);

router.post('/fcm-token', updateFcmToken);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

// Routes accessible only to admins
router.post('/send', authorize('admin'), sendPushNotification);

module.exports = router;
