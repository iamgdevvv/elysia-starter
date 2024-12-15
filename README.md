# ElysiaStarter: Lightweight Elysia.js Starter

ElysiaStarter is a lightweight, fast, and secure starter template for building web applications using **Elysia.js**. It follows the best practices outlined in the **Elysia.js** and **Bun** documentation. The starter includes out-of-the-box **authentication** (JWT-based) and **authorization** endpoints with role-based access control. The project is powered by **Prisma** as the ORM and uses **Biome** for formatting, linting, and code checking.


## Features

- **Elysia.js** as the web framework: small, fast, and highly customizable.
- **Authentication and Authorization**: JWT-based login with role-based access.
- **Prisma ORM**: PostgreSQL as the database backend.
- **Biome**: Integrated formatter, linter, and code checker.
- **Swagger** API Documentation: Auto-generated OpenAPI specs for your endpoints.
- Fully customizable environment variables.
- Production-ready with build scripts and minimal dependencies.


## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Bun](https://bun.sh) (Version >= 1.0.0)
- [PostgreSQL](https://www.postgresql.org) (Version >= 12.0)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iamgdevvv/elysia-starter
   cd spyon
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your database:
   - Create a PostgreSQL database.
   - Update the `.env` file with your database URL.

   Example `.env`:
   ```env
   SERVER_PORT=3000
   DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
   JWT_SECRETS=xxx
   JWT_EXPIRED=1d
   ```

4. Generate Prisma client:
   ```bash
   bun run db:generate
   ```

5. Run database migrations:
   ```bash
   bun run db:migrate
   ```

6. Start the development server:
   ```bash
   bun run dev
   ```

Your application will be running at [http://localhost:3000](http://localhost:3000).


## Scripts

The project includes the following scripts for common tasks:

| Script             | Description                              |
|--------------------|------------------------------------------|
| `bun run dev`      | Starts the development server.           |
| `bun run build`    | Builds the project for production.       |
| `bun run start`    | Runs the built project.                  |
| `bun run db:push`  | Pushes the Prisma schema to the database.|
| `bun run db:migrate`| Runs database migrations.               |
| `bun run db:generate`| Generates Prisma client code.          |
| `bun run lint`     | Lints the codebase using Biome.          |
| `bun run format`   | Formats the codebase using Biome.        |
| `bun run check`    | Runs static code analysis with Biome.    |



## Environment Variables

| Variable       | Description                                              |
|----------------|----------------------------------------------------------|
| `SERVER_PORT`  | Port where the server runs (default: `3000`).             |
| `DATABASE_URL` | Database connection string for Prisma.                   |
| `JWT_SECRETS`  | Secret key for signing JWTs.                             |
| `JWT_EXPIRED`  | Expiration duration for JWT tokens (e.g., `1d`, `12h`).   |


## Authentication and Authorization

### JWT-Based Authentication

- Login endpoint issues a JWT token upon successful authentication.
- Each JWT includes the following payload:
  ```json
  {
    "sub": "userId",
    "exp": 1234567890
  }
  ```

### Role-Based Authorization

- Protect specific routes by role.
- Example:
  - **Admin-only endpoint**: Accessible only to users with the `ADMIN` role.
  - **Customer endpoint**: Accessible to users with any valid role.

## API Documentation with Swagger

This project includes Swagger for API documentation, making it easy to visualize and test endpoints.

### Accessing Swagger UI

Once the server is running, navigate to:

http://localhost:3000/swagger

### Features

- Auto-generated API documentation based on route definitions.

- Supports testing API requests directly from the browser.

### Adding Swagger to New Routes

Swagger documentation is automatically generated from the Elysia.js route definitions. Ensure your routes have detailed configurations for parameters, responses, and descriptions.

## Tools and Technologies

### Dependencies

| Package                 | Purpose                                  |
|-------------------------|------------------------------------------|
| `elysia`                | Core web framework.                     |
| `@elysiajs/jwt`         | Middleware for JWT-based authentication.|
| `@elysiajs/cors`        | CORS support for cross-origin requests. |
| `prisma` / `@prisma/client` | Database ORM and generated client.     |
| `dayjs`                 | Date and time library.                  |

### Dev Dependencies

| Package           | Purpose                                 |
|-------------------|-----------------------------------------|
| `@biomejs/biome`  | Linter, formatter, and static checker.  |
| `bun-types`       | TypeScript definitions for Bun.         |


## Deployment

1. Build the project:
   ```bash
   bun run build
   ```

2. Start the production server:
   ```bash
   bun run start
   ```

3. Ensure the environment variables are properly set in your production environment.


## License

[MIT License](https://github.com/iamgdevvv/elysia-starter?tab=MIT-1-ov-file)


## Contributions

Contributions are welcome! Please open an issue or submit a pull request to contribute to this project.

## Support

You can also support us by:

<p align="left">
	<a href='https://teer.id/iamgdev'><img src="https://button.ibnux.net/trakteer/iamgdev.png" width="128" /></a>
</p>

---

> [iamgdev.my.id](iamgdev.my.id) &nbsp;&middot;&nbsp;
> GitHub [@iamgdevvv](https://github.com/iamgdevvv) &nbsp;&middot;&nbsp;
> Youtube [@iamgdev](https://www.youtube.com/@iamgdev)