'use strict'

module.exports = function(sequelize, DataTypes) {
  var ChannelActivity = sequelize.define('ChannelActivity', {
    match: {
      type: DataTypes.FLOAT
    },
    ActivityId: {
      type: DataTypes.INTEGER
    },
    ChannelId: {
      type: DataTypes.INTEGER
    }
  });
  return ChannelActivity;
};
