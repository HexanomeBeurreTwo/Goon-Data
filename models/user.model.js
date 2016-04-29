'use strict'

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true},
    username: { type: DataTypes.STRING, allowNull: false, unique: true},
    email: { type: DataTypes.STRING, allowNull: false, unique: true},
    password: { type: DataTypes.STRING, allowNull: false},
    citizen: {
      type:   DataTypes.ENUM,
      values: ['lyon'],
    },
    age: { type: DataTypes.INTEGER},
    //subscription: { type: DataTypes.STRING},
    tags: { type: DataTypes.ARRAY(DataTypes.TEXT)},
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Channel, {as: 'channels'});
      }
    }
  });
  return User;
};
