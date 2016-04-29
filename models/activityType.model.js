'use strict'

module.exports = function(sequelize, DataTypes) {
  var ActivityType = sequelize.define('ActivityType', {
    description: { type: DataTypes.DECIMAL},
  }, {
    classMethods: {
      associate: function(models) {
        //ActivityType.belongsToMany(models.Activity, {through: 'ActivityType'});
      }
    }
  });
  return ActivityType;
};
