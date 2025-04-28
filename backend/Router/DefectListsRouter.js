const express = require('express');
const { DefectCreate, AllDefect, SingleDefect, deleteDefect, UpdateDefect } = require('../Controller/DefectListsController');

const router = express.Router();

router.post('/',DefectCreate);

router.get('/',AllDefect);

router.get('/:id',SingleDefect)

router.delete('/:id',deleteDefect)

router.put('/:id',UpdateDefect)
module.exports = router;