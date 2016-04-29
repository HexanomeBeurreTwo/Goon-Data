'use strict'

module.exports = function(sequelize, DataTypes) {
  var Channel = sequelize.define('Channel', {
    id: {type: DataTypes.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true},
    name: { type: DataTypes.STRING, allowNull: false, unique: true},
    description: { type: DataTypes.STRING},
    tags: { type: DataTypes.ARRAY(DataTypes.TEXT)},
  }, {
    classMethods: {
      associate: function(models) {
        Channel.belongsToMany(models.User, {through: 'UserChannel'});
        Channel.belongsToMany(models.MachingChannelActivity, {through: 'MachingChannel'});
        Channel.hasMany(models.MachingChannelActivity, {as: 'activities'});
      }
    }
  });
  return Channel;
};
