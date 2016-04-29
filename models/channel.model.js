'use strict'

module.exports = function(sequelize, DataTypes) {
  var Channel = sequelize.define('Channel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
  }, {
    classMethods: {
      associate: function(models) {
        Channel.belongsToMany(models.User, {through: 'UserChannel', foreignKey: 'userId' });
        Channel.belongsToMany(models.Activity, {through: 'ChannelActivity', foreignKey: 'ActivityId', as: "Activities" });
      }
    }
  });
  return Channel;
};
