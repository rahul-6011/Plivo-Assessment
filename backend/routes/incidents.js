const express = require('express');
const incidentController = require('../controllers/incidentController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public', incidentController.getPublicIncidents);
router.get('/maintenances/public', incidentController.getPublicMaintenances);

// Protected routes
router.get('/', authenticateToken, incidentController.getAllIncidents);
router.post('/', authenticateToken, requireAdmin, incidentController.createIncident);
router.put('/:id', authenticateToken, requireAdmin, incidentController.updateIncident);
router.post('/:id/updates', authenticateToken, requireAdmin, incidentController.addIncidentUpdate);
router.patch('/:id/resolve', authenticateToken, requireAdmin, incidentController.resolveIncident);

router.get('/maintenances', authenticateToken, incidentController.getAllMaintenances);
router.post('/maintenances', authenticateToken, requireAdmin, incidentController.createMaintenance);

module.exports = router;