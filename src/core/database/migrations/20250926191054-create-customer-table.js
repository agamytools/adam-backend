'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('customer', {
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
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            orders_count: { // denormalized field to keep track of the number of orders
                type: Sequelize.INTEGER,
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
            }
        });

        // Add indexes for better performance
        // use this index as covered index
        await queryInterface.addIndex('customer', ['email', 'deleted_at', 'is_active'], {
            name: 'customer_email_active_deleted_idx' // use composite index because most time we search by email and active status together
        });

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('customer');
    }
};
