const express = require('express');
const serviceController = require('../controllers/serviceController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public', serviceController.getPublicServices);

// Protected routes
router.get('/', authenticateToken, serviceController.getAllServices);
router.post('/', authenticateToken, requireAdmin, serviceController.createService);
router.put('/:id', authenticateToken, requireAdmin, serviceController.updateService);
router.patch('/:id/status', authenticateToken, requireAdmin, serviceController.updateServiceStatus);
router.delete('/:id', authenticateToken, requireAdmin, serviceController.deleteService);
router.get('/:id/history', authenticateToken, serviceController.getStatusHistory);

module.exports = router;