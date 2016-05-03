'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ChannelActivities', {
      ActivityId: {
        type: Sequelize.INTEGER,
      },
      ChannelId: {
        type: Sequelize.INTEGER,
      },
      match: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('ChannelActivities');
  }
};
