const express=require('express');
const { getClientDashboard } = require('../Controller/clientDashboardController');

const router = express.Router()

router.get('/:projectId',getClientDashboard)




 module.exports = router 