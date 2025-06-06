const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid');

const createRoom = async (req, res) => {
  try {
    const id = uuidv4().slice(0, 8);
    const { status, mapSize, winCondition } = req.body;
    const room = await Room.create({ id, status, mapSize, winCondition });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listRooms = async (req, res) => {
  try {
    const { status, mapSize, winCondition } = req.query;
    const rooms = await Room.findAll({
      where: { status, mapSize, winCondition },
      limit: 10,
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (room) {
      await room.destroy();
      res.status(200).json({ message: 'Room deleted successfully' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRoom, getRoom, listRooms, deleteRoom };