# Adam Backend - NestJS with Sequelize

This project has been set up with Sequelize ORM integration for database operations with migrations and models.

## Database Setup

### Installed Packages

**Core Sequelize Packages:**
- `@nestjs/sequelize` - NestJS Sequelize integration
- `sequelize` - Sequelize ORM core
- `sequelize-typescript` - TypeScript decorators for Sequelize
- `sequelize-cli` - CLI tools for migrations and seeders

**Database Drivers:**
- `pg` - PostgreSQL driver
- `mysql2` - MySQL driver  
- `sqlite3` - SQLite driver

**Additional:**
- `dotenv` - Environment variable management

### Project Structure

```
src/
├── core/
│   ├── config/
│   │   ├── database.config.ts    # NestJS database configuration
│   │   └── database.js           # Sequelize CLI configuration
│   ├── database/
│   │   ├── migrations/           # Database migrations
│   │   └── seeders/              # Database seeders
│   └── services/
│       └── user.service.ts       # User service with CRUD operations
├── domain/
│   └── models/
│       ├── index.ts              # Model exports
│       └── user.model.ts         # User model with Sequelize decorators
├── controllers/
│   └── user.controller.ts        # REST API endpoints for users
└── app.module.ts                 # Main app module with Sequelize integration
```

### Configuration Files

- `.sequelizerc` - Sequelize CLI configuration pointing to proper directories
- `.env.example` - Environment variables template

### Available NPM Scripts

**Database Management:**
- `npm run db:create` - Create database
- `npm run db:drop` - Drop database
- `npm run db:migrate` - Run all pending migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:migrate:undo:all` - Undo all migrations
- `npm run db:seed` - Run all seeders
- `npm run db:seed:undo` - Undo all seeders

**Development:**
- `npm run migration:generate -- migration-name` - Generate new migration
- `npm run seed:generate -- seed-name` - Generate new seeder

## Getting Started

### 1. Environment Setup

Copy the example environment file and configure your database:

```bash
cp .env.example .env
```

Update the database configuration in `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=adam_db
```

### 2. Database Setup

Create your database:

```bash
npm run db:create
```

Run migrations to create tables:

```bash
npm run db:migrate
```

(Optional) Seed the database with sample data:

```bash
npm run db:seed
```

### 3. Start the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## User Model & API

### User Model Features

- **Soft Deletes**: Users are marked as deleted instead of being permanently removed
- **Timestamps**: Automatic `createdAt`, `updatedAt` tracking
- **Validation**: Email validation, required fields
- **Indexes**: Performance indexes on email, isActive, and deletedAt

### Available Endpoints

- `GET /users` - Get all users
- `GET /users/active` - Get all active users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user

### Example User Data Structure

```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "hashed_password",
  "isActive": true
}
```

## Database Configuration Options

The setup supports multiple database types. You can switch between them by updating the `databaseConfig` import in `app.module.ts`:

- `databaseConfig` - PostgreSQL (default)
- `mysqlConfig` - MySQL
- `sqliteConfig` - SQLite

## Migration & Model Development

### Creating New Models

1. Create model file in `src/domain/models/`
2. Add Sequelize decorators and TypeScript interfaces
3. Export from `src/domain/models/index.ts`
4. Add to models array in `app.module.ts`
5. Generate and run migration

### Creating Migrations

```bash
npm run migration:generate -- create-products-table
```

### Creating Seeders

```bash
npm run seed:generate -- demo-products
```

## Notes

- The project uses underscored naming convention (snake_case) for database columns
- Paranoid mode is enabled for soft deletes
- All models include created_at, updated_at, and deleted_at timestamps
- Database configuration supports environment-based setup for different environments
