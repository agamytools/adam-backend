import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Unique,
    Default,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'technician',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // enables soft deletes
})
export class Technician extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @AllowNull(false)
    @Column(DataType.STRING(100))
    name: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(255))
    email: string;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    password: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(20))
    phoneNumber: string;

    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    isActive: boolean;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    totalRepairs: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.FLOAT)
    rating: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    reviewsCount: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.FLOAT)
    internalScore: number;

    @CreatedAt
    @Column({field: 'created_at'})
    declare createdAt: Date;

    @UpdatedAt
    @Column({field: 'updated_at'})
    declare updatedAt: Date;

    @DeletedAt
    @Column({field: 'deleted_at'})
    declare deletedAt: Date;
}
