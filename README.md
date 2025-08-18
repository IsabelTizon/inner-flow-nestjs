<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode ✅
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Features

- 🧘‍♀️ **Yoga Poses Management** - CRUD operations for yoga poses
- 🤖 **AI Descriptions** - Automatic pose descriptions using OpenAI
- 👤 **User Authentication** - JWT-based auth with role-based access
- 📝 **Sequences** - Create and manage custom yoga sequences
- 🔒 **Secure** - Password hashing and protected routes
- 📊 **SQLite Database** - Lightweight database with TypeORM

## Tech Stack

- **Framework:** NestJS + TypeScript
- **Database:** SQLite with TypeORM
- **Authentication:** JWT + Passport
- **AI:** OpenAI API
- **Validation:** class-validator

## API Endpoints

### Authentication

- `POST /users/auth/register` - Register new user
- `POST /users/auth/login` - Login user

### Poses

- `GET /poses` - Get all poses
- `GET /poses/:id` - Get pose by ID
- `POST /poses` - Create new pose (Auth required)
- `PUT /poses/:id` - Update pose (Admin only)
- `DELETE /poses/:id` - Delete pose (Admin only)

### Sequences

- `GET /sequences/my-sequences` - Get user sequences
- `POST /sequences` - Create new sequence
- `POST /sequences/:id/poses` - Add pose to sequence
- `DELETE /sequences/:id/poses/:poseId` - Remove pose from sequence

### DDBB Tables

1. Main DDBB Tables :

   - POSES: id - name - description - image
   - USERS: id - email - password - role
   - SEQUENCES: id - name - description - userId

2. JOIN TABLE: (sequence_poses) It is a junction table for handling many-to-many relationships: A sequence can have many poses and A pose can be in many sequences

- sequenceId (FK → sequences.id)
- poseId (FK → poses.id)

🚀 📌 ⚙️ ✅

### STRUCTURE 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

✅ => MODELS: (ENTITIES) database table structure
✅ => CONTROLLERS: Handle HTTP requests (GET, POST, PUT, DELETE) and route them to services
✅ => SERVICES: Business logic layer that processes data and interacts with the database. Injectable is a NestJS decorator that marks a class as a provider
✅ => MODULES: Organize related controllers, services, and providers into cohesive units
✅ => DTOs: (Data Transfer Objects) Define and validate the structure of incoming/outgoing data. Validan con: ValidationPipe, class-validator y class-transformer
✅ => GUARDS: Protect routes with authentication and authorization (JwtAuthGuard, RolesGuard)

### SPACKAGES 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀

📌 Components:
✅ common => Essential components for creating services, modules, and controllers in NestJS applications
📌 DDBB:
✅ typeorm => ORM for managing the SQLite database with entities, repositories, and migrations.
✅ class-validator => Validates incoming data using decorators (@IsString, @IsOptional, @IsEmail)
✅ sqlite3 => Lightweight database engine for development and small-scale applications
✅ uuid => Generate unique identifiers for database records
📌 AI:
✅ OpenAI => service to interact with the OpenAI API for generating pose descriptions
✅ axios => HTTP client for making API requests to external services like OpenAI
📌 Auth:
✅ JWT => (JSON Web Tokens) to generate tokens when the user logged in, for validating tokens in authorization, to configure the secret and the expiration time
✅ JwtStrategy => Defines how to validate JWT tokens, Extracts user information from the token and Runs automatically on protected routes
✅ PassportModule => Framework for managing different authentication strategies. Simplifies token validation
✅ dotenv/config => Load variables from the .env file, Allows you to use process.env.JWT_SECRET and Keeps secrets out of the code
✅ bcrypt => Hash passwords securely before storing them in the database
✅ nodemailer =>
✅ =>
✅ =>
✅ =>
✅ =>
✅ =>
