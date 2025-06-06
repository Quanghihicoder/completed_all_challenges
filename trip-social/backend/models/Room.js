const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mapSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  winCondition: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Room;