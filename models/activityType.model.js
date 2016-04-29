'use strict'

module.exports = function(sequelize, DataTypes) {
  var ActivityType = sequelize.define('ActivityType', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
  });
  return ActivityType;
};
