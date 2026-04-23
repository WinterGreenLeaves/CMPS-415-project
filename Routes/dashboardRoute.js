const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');
const isAuthenticated = require('../middleware/auth');
 
router.get('/', isAuthenticated, dashboardController.getDashboard);
router.post('/createTopic', isAuthenticated, dashboardController.createTopic);
router.post('/postMessage', isAuthenticated, dashboardController.postMessage);
 
module.exports = router;