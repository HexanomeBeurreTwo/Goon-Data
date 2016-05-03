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
    type: {
      type:   DataTypes.ENUM,
      values: ["PATRIMOINE_CULTUREL", "RESTAURATION", "DEGUSTATION", "COMMERCE_ET_SERVICE", "HEBERGEMENT_LOCATIF", "HEBERGEMENT_COLLECTIF", "HOTELLERIE", "EQUIPEMENT", "EVENT"],
    },
    source: {
      type:   DataTypes.STRING,
    },
    idSource: {
      type:   DataTypes.DECIMAL,
    },
  }, {
    classMethods: {
      associate: function(models) {
        Activity.belongsToMany(models.Channel, { through: 'ChannelActivity', foreignKey: 'ActivityId', as: 'Channels' });
      }
    }
  });
  return Activity;
};
