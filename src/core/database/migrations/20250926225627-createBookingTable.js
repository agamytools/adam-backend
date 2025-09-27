'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('booking', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            customer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'customer',
                    key: 'id'
                }
            },
            customer: { // denormalized customer details snapshot
                type: Sequelize.JSONB,
                allowNull: false,
                // store a snapshot of customer details at the time of order creation for historical reference
            },
            technician_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'technician',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            technician: { // denormalized technician details snapshot
                type: Sequelize.JSONB,
                allowNull: false,
                // store a snapshot of technician details at the time of assignment for historical reference
            },
            time_slot_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'technician_time_slot',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            start_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            status: {
                type: Sequelize.SMALLINT, // use small int to save space and improve performance for indexing
                allowNull: false,
            },
            total_amount: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            },
        });
        // Add indexes for better performance
        await queryInterface.addIndex('booking', ['customer_id', 'status', 'deleted_at'], {
            name: 'bookings_customer_status_deleted_idx' // use composite index because most time we search by customer and status together
        });
        await queryInterface.addIndex('booking', ['technician_id', 'status', 'deleted_at'], {
            name: 'bookings_technician_status_deleted_idx' // use composite index because most time we search by technician and status together
        });
        await queryInterface.addIndex('booking', ['time_slot_id', 'status', 'deleted_at'], {
            name: 'bookings_time_slot_status_deleted_idx' // use composite index because most time we search by time slot and status together
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('bookings');
    }
};
