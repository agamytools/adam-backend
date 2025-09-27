import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
} from 'sequelize-typescript';
import {Customer} from './customer.model';
import {Technician} from './technician.model';
import {TechnicianTimeSlot} from './technician-timeslot.model';

@Table({
    tableName: 'booking',
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
        {
            name: 'bookings_customer_status_deleted_idx',
            fields: ['customer_id', 'status', 'deleted_at'],
        },
        {
            name: 'bookings_technician_status_deleted_idx',
            fields: ['technician_id', 'status', 'deleted_at'],
        },
        {
            name: 'bookings_time_slot_status_deleted_idx',
            fields: ['time_slot_id', 'status', 'deleted_at'],
        },
    ],
})
export class Booking extends Model<Booking> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    })
    declare id: number;

    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    customerId: number;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
        comment: 'Denormalized customer details snapshot for historical reference',
    })
    customer: object;

    @ForeignKey(() => Technician)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    technicianId: number;

    @Column({
        type: DataType.JSONB,
        allowNull: false,
        comment:
            'Denormalized technician details snapshot for historical reference',
    })
    technician: object;

    @ForeignKey(() => TechnicianTimeSlot)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    timeSlotId: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    startTime: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    endTime: Date;

    @Column({
        type: DataType.TINYINT,
        allowNull: false,
    })
    status: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    totalAmount: number;

    @CreatedAt
    @Column({
        field: 'created_at',
    })
    declare createdAt: Date;

    @UpdatedAt
    @Column({
        field: 'updated_at',
    })
    declare updatedAt: Date;

    @DeletedAt
    @Column({
        field: 'deleted_at',
    })
    declare deletedAt: Date;

    @BelongsTo(() => Customer)
    customerRef: Customer;

    @BelongsTo(() => Technician)
    technicianRef: Technician;

    @BelongsTo(() => TechnicianTimeSlot)
    timeSlot: TechnicianTimeSlot;
}
