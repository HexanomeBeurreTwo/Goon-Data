'use strict'

module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define('Activity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
    address: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.DECIMAL
    },
    longitude: {
      type: DataTypes.DECIMAL
    },
    temporary: {
      type: DataTypes.BOOLEAN
    },
    date_start: {
      type: DataTypes.DATE
    },
    date_end: {
      type: DataTypes.DATE
    } ,
    opening_hours: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    ActivityTypeId: {
      type: DataTypes.STRING
    },
  }, {
    classMethods: {
      associate: function(models) {
        Activity.hasOne(models.ActivityType, { foreignKey: 'ActivityTypeId' });
        Activity.belongsToMany(models.Channel, { through: 'ChannelActivity', foreignKey: 'ChannelId', as: 'Channels' });
      }
    }
  });
  return Activity;
};
