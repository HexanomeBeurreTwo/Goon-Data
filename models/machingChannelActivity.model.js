'use strict'

module.exports = function(sequelize, DataTypes) {
  var MachingChannelActivity = sequelize.define('MachingChannelActivity', {
    id: {type: DataTypes.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true},
    maching: { type: DataTypes.STRING},
  }, {
    classMethods: {
      associate: function(models) {
        MachingChannelActivity.hasOne(models.Channel);
        MachingChannelActivity.hasOne(models.Activity);
      }
    }
  });
  return MachingChannelActivity;
};
