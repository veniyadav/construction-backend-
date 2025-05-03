const express = require('express');
const { PlantMachineryCreate, AllPlantMachinery, SinglePlantMachinery, deletePlantMachinery, UpdatePlantMachinery } = require('../Controller/PlantMachineryController');

const router = express.Router();

router.post('/',PlantMachineryCreate);

router.get('/',AllPlantMachinery);

router.get('/:id',SinglePlantMachinery)

router.delete('/:id',deletePlantMachinery)

router.patch('/:id',UpdatePlantMachinery)

module.exports = router;
