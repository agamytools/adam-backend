'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('technician', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            total_repairs: { // denormalized field to keep track of the number of repairs completed
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            rating: { // average rating from customers
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            reviews_count: { // number of reviews received
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            internal_score: { // internal performance score for the technician
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: { // use for soft deletes
                allowNull: true,
                type: Sequelize.DATE
            },
        });

        // Add indexes for better performance
        await queryInterface.addIndex('technician', ['email', 'deleted_at', 'is_active'], {
            name: 'technician_email_active_deleted_idx' // use composite index because most time we search by email and active status together
        });
        await queryInterface.addIndex('technician', ['phone_number', 'deleted_at', 'is_active'], {
            name: 'technician_phone_active_deleted_idx' // use composite index because most time we search by phone number and active status together
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('technician');
    }
};
