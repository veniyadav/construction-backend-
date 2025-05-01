const express=require('express');
const { getSuperAdminDashboard } = require('../Controller/superAdminDashboardController');

const router = express.Router()

router.get('/',getSuperAdminDashboard)



 module.exports = router 