const MiniApp = require('../models/MiniApp.model');

exports.getActiveMiniApps = async (req, res, next) => {
    try {
        const miniApps = await MiniApp.find({ isActive: true });
        res.status(200).json({ success: true, data: miniApps });
    } catch (error) {
        next(error);
    }
};

exports.createMiniApp = async (req, res, next) => {
    try {
        const miniApp = await MiniApp.create(req.body);
        res.status(201).json({ success: true, data: miniApp });
    } catch (error) {
        next(error);
    }
};

exports.updateMiniApp = async (req, res, next) => {
    try {
        const miniApp = await MiniApp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!miniApp) return res.status(404).json({ success: false, message: 'MiniApp not found' });
        res.status(200).json({ success: true, data: miniApp });
    } catch (error) {
        next(error);
    }
};
