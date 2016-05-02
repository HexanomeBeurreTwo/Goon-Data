'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Activities', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement:true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      address: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.DECIMAL
      },
      longitude: {
        type: Sequelize.DECIMAL
      },
      temporary: {
        type: Sequelize.BOOLEAN
      },
      date_start: {
        type: Sequelize.DATE
      },
      date_end: {
        type: Sequelize.DATE
      },
      opening_hours: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      type: {
        type:   Sequelize.ENUM,
        values: ["PATRIMOINE_CULTUREL", "RESTAURATION", "DEGUSTATION", "COMMERCE_ET_SERVICE", "HEBERGEMENT_LOCATIF", "HEBERGEMENT_COLLECTIF", "HOTELLERIE", "EQUIPEMENT", "EVENT"],
      },
      source: {
        type:   Sequelize.STRING,
        primaryKey: true
      },
      idSource: {
        type:   Sequelize.DECIMAL,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Activities');
  }
};
