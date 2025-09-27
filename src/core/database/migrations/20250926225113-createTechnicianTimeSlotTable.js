'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('technician_time_slot', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            technician_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'technician',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            start_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            is_booked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
            }
        });

        // Add indexes for better performance
        await queryInterface.addIndex('technician_time_slot', ['technician_id', 'start_time', 'end_time', 'is_booked'], {
            name: 'technician_time_slot_technician_time_booked_idx'
        });
        // add index on start_time and end_time to optimize queries filtering by time range
        await queryInterface.addIndex('technician_time_slot', ['start_time', 'end_time'], {
            name: 'technician_time_slot_start_end_time_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        // remove the index first
        await queryInterface.removeIndex('technician_time_slot', 'technician_time_slot_technician_time_booked_idx');
        await queryInterface.dropTable('technician_time_slot');

    }
};
