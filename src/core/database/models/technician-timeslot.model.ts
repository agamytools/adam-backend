import {BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, Index, Model, Table, UpdatedAt,} from 'sequelize-typescript';
import {Technician} from './technician.model';

@Table({
    tableName: 'technician_time_slot',
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
@Index(['technician_id', 'start_time', 'end_time', 'is_booked'])
export class TechnicianTimeSlot extends Model<TechnicianTimeSlot> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: number;

    @ForeignKey(() => Technician)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    technicianId: number;

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
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isBooked: boolean;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;

    @DeletedAt
    declare deleted_at: Date;

    @BelongsTo(() => Technician)
    technician: Technician;
}
