const express = require('express');
const { createRoom, getRoom, listRooms, deleteRoom } = require('../controllers/roomController');
const router = express.Router();

router.post('/rooms', createRoom);
router.get('/rooms/:id', getRoom);
router.get('/rooms', listRooms);
router.delete('/rooms/:id', deleteRoom);

module.exports = router;