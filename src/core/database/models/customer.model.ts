import {Column, DataType, Index, Model, Table} from 'sequelize-typescript';

@Table({
    tableName: 'customer',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // enables soft deletes
})
export class Customer extends Model<Customer> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    })
    declare id: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    name: string;

    @Index('customer_email_active_deleted_idx')
    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    password: string;

    @Index('customer_email_active_deleted_idx')
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    isActive: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'denormalized field to keep track of the number of orders',
    })
    ordersCount: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare updatedAt: Date;

    @Index('customer_email_active_deleted_idx')
    @Column({
        type: DataType.DATE,
        allowNull: true,
        comment: 'use for soft deletes',
    })
    declare deletedAt: Date;
}
