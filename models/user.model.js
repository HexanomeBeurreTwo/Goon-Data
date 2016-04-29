'use strict'

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    citizen: {
      type:   DataTypes.ENUM,
      values: ['lyon'],
    },
    age: {
      type: DataTypes.INTEGER
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Channel, { through: 'UserChannel', foreignKey: 'channelId' });
      }
    }
  });
  return User;
};
