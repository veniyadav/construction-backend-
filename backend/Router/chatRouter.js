const express=require('express');
const { createChat, getAllChats, searchChats, sendMessage, deleteChat  } = require('../Controller/chatController');

const router = express.Router()

router.post('/',createChat)

router.get('/',getAllChats)

router.get('/:searchTerm',searchChats)

router.patch('/',sendMessage)

router.delete('/:id',deleteChat)

router.post('/',createGroupChat)


module.exports = router 
