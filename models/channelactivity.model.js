'use strict'

module.exports = function(sequelize, DataTypes) {
  var ChannelActivity = sequelize.define('ChannelActivity', {
    match: {
      type: DataTypes.INTEGER
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
