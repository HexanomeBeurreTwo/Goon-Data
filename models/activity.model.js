'use strict'

//TODO : define activity types
module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define('Activity', {
    id: {type: DataTypes.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true},
    name: { type: DataTypes.STRING, allowNull: false},
    description: { type: DataTypes.STRING},
    tags: { type: DataTypes.ARRAY(DataTypes.TEXT)},
    address: { type: DataTypes.STRING},
    latitude: { type: DataTypes.DECIMAL},
    longitude: { type: DataTypes.DECIMAL},
    temporary: { type: DataTypes.BOOLEAN},
    date_start: { type: DataTypes.DATE},
    date_end: { type: DataTypes.DATE},
    opening_hours: { type: DataTypes.ARRAY(DataTypes.INTEGER)},
  }, {
    classMethods: {
      associate: function(models) {
        Activity.hasOne(models.ActivityType, {as: 'type'});
        Activity.belongsToMany(models.MachingChannelActivity, {through: 'MachingActivity'});
      }
    }
  });
  return Activity;
};
