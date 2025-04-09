# Monolitic Vyppers Serverless

<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <h2>Versatile Backend Solution with Clean Architecture</h2>
</div>

## 🌐 Overview

Monolitic Vyppers Serverless is a robust, scalable backend solution designed using Clean Architecture principles. Built with NestJS, this project demonstrates a sophisticated approach to creating modern web applications that can be deployed both as AWS Lambda functions and as a traditional server.

### 🚀 Key Features

- **Dual Deployment Options**: Run as AWS Lambda functions or as a standard server
- **Clean Architecture Implementation**: Clear separation of concerns with well-defined layers
- **Authentication & Authorization**: Comprehensive user management system including social logins
- **Payment Processing**: Integration with Stripe for subscription and payment handling
- **Media Processing**: Advanced image and video manipulation with blurring and watermarking
- **AWS Integration**: Full S3 integration for media storage
- **Serverless Ready**: Optimized for AWS Lambda with Serverless Framework

## 🗂️ Architecture

This project is built on Clean Architecture principles, ensuring separation of concerns, testability, and maintainability:

### 📁 Layers

- 📝 **Domain Layer**: Contains business entities, interfaces, and use cases independent of external frameworks
  - `src/domain/entity`: Business entities and models
  - `src/domain/interfaces`: Contracts for repositories and services
  - `src/domain/usecases`: Application-specific business rules

- 📊 **Presentation Layer**: Handles HTTP requests and responses, validation, and routing
  - `src/presentation/controller`: API controllers
  - `src/presentation/dtos`: Data Transfer Objects
  - `src/presentation/middleware`: Request middlewares and guards
  - `src/presentation/pipes`: Input validation and transformation

- 📈 **Data Layer**: Implements data-related interfaces, models, and repositories
  - `src/data`: Database models, repositories, and data sources
  - `src/data/repositories`: MongoDB repository implementations

- 📦 **Infrastructure Layer**: External frameworks, tools, and database adapters
  - `src/infra/adapters`: External service integrations
  - `src/infra/db`: Database connection and configuration
  - `src/infra/config`: Environment configuration

- 📁 **Shared Layer**: Utilities and helpers shared across the application
  - `src/shared`: Common utilities, helpers, and templates
  - `src/shared/utils`: Helper functions
  - `src/shared/helpers`: Business logic helpers

## 📚 API Routes

### 🔒 Authentication & Users

- 🔑 **POST `/auth/v1/common`**: Standard email/password authentication
- 🔑 **GET `/auth/v1/google`**: Google OAuth authentication
- 🔑 **GET `/auth/v1/google/redirect`**: Google OAuth callback
- 🔑 **GET `/auth/v1/facebook`**: Facebook authentication
- 🔑 **GET `/auth/v1/facebook/redirect`**: Facebook authentication callback
- 📝 **POST `/register/v1/user`**: User registration
- 📝 **POST `/recovery/v1/generate-code`**: Password recovery request
- 📝 **POST `/recovery/v1/validate-code`**: Validate recovery code
- 📝 **POST `/recovery/v1/change-password`**: Reset password
- 📊 **GET `/user/v1/profile`**: Get user profile
- 📊 **GET `/user/v1/validate/profile`**: Validate user profile

### 📁 Content Management

- 📁 **POST `/content/v1/create`**: Create new content
- 🚮 **DELETE `/content/v1/{contentId}/delete`**: Delete content
- 📝 **PUT `/content/v1/{contentId}/edit`**: Edit content
- 📊 **GET `/content/v1/all`**: List all content
- 📊 **GET `/content/v1/unique/{contentId}/{vypperId}`**: Get specific content
- 📸 **GET `/content/v1/profile/picture`**: Get profile picture

### 💸 Payment Processing

- 💸 **POST `/payment/v1/create`**: Create payment
- 💸 **GET `/payment/v1/checkout/session`**: Get checkout session
- 💸 **POST `/payment/v1/webhook`**: Payment webhook

### 📄 API Documentation

- 📄 **GET `/swagger`**: Swagger UI
- 📄 **GET `/swagger/swagger-ui.css`**: Swagger stylesheet
- 📄 **GET `/swagger/swagger-ui-bundle.js`**: Swagger bundle
- 📄 **GET `/swagger/swagger-ui-standalone-preset.js`**: Swagger preset
- 📄 **GET `/swagger/swagger-ui-init.js`**: Swagger initialization

## 💸 Payment Processing

The application includes a comprehensive payment system integrated with Stripe:

- **Subscription Management**: Create, update, and cancel subscriptions
- **Product Catalog**: Manage products and pricing
- **Payment Processing**: Secure payment handling with webhook support
- **Transaction History**: Track and manage payment history

## 📸 Media Processing Features

### 📸 Image Processing

- 📸 **Watermarking**: Automatically add watermarks to protect content
- 📸 **Blurring**: Apply configurable blur effects for premium content previews
- 📸 **Optimization**: Resize and compress images for optimal delivery

### 📹 Video Processing

- 📹 **Thumbnail Generation**: Automatically generate thumbnails from videos
- 📹 **Blurred Previews**: Create blurred previews for subscription content
- 📹 **Video Processing**: Using ffmpeg for video manipulation and transformation

## ⚡️ Serverless Capability

This project is fully configured for serverless deployment using AWS Lambda:

- **API Gateway Integration**: Endpoints exposed via API Gateway
- **Lambda Functions**: Business logic runs as stateless Lambda functions
- **Serverless Framework**: Easy deployment and management
- **Local Development**: Test serverless functions locally with serverless-offline

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn or npm
- AWS account (for serverless deployment)
- MongoDB instance

### Environment Setup

1. Clone the repository
2. Create an `.env` file based on `.env.example`
3. Install dependencies:

```bash
$ yarn install
```

### 🏃‍♂️ Running the Application

#### 🔄 Development Mode

```bash
# Start the application in development mode with hot-reload
$ yarn dev

# Debug mode
$ yarn debug
```

#### 🚀 Production Mode as Server

```bash
# Build the project
$ yarn build

# Run in production mode
$ yarn prod
```

#### ⚡️ Lambda Development (Local)

```bash
# Run as AWS Lambda with serverless-offline
$ yarn lambda:dev
```

### 🚀 Deployment

#### 🚀 Server Deployment

```bash
# Build for server deployment
$ yarn build

# Then deploy the dist folder to your server
```

#### ⚡️ Serverless Deployment

```bash
# Build for serverless deployment
$ yarn build:sls

# Deploy to AWS Lambda
$ serverless deploy
```

## 📊 Testing

```bash
# Unit tests
$ yarn test

# Test coverage
$ yarn test:cov
```

## 📄 API Documentation

API documentation is available through Swagger UI at `/swagger` when the application is running. This interactive documentation allows you to:

- Explore available endpoints
- Test API calls directly from the browser
- View request/response schemas
- Understand authentication requirements

Access Swagger UI: `https://your-api-url/swagger` or `http://localhost:4001/swagger` when running locally.

## 🗂️ Project Structure

```
├── src/
│   ├── data/           # Data layer - repositories and data sources
│   ├── domain/         # Domain layer - business logic and entities
│   │   ├── entity/     # Business entities
│   │   ├── interfaces/ # Repository and service interfaces
│   │   └── usecases/   # Application-specific business rules
│   ├── infra/          # Infrastructure layer - external frameworks
│   │   └── adapters/   # External service adapters (S3, payments, etc.)
│   ├── presentation/   # Presentation layer - controllers and DTOs
│   │   ├── controller/ # API controllers
│   │   └── dtos/       # Data Transfer Objects
│   ├── shared/         # Shared utilities and helpers
│   ├── lambda.ts       # Lambda function entry point
│   └── main.ts         # Server entry point
├── serverless.yaml     # Serverless configuration
└── package.json        # Project dependencies and scripts
```

## 🔒 Security Features

- JWT Authentication
- Password encryption
- Social login integration
- API rate limiting
- Environment variable encryption

## 📈 Technologies Used

- 📈 **NestJS**: Progressive Node.js framework
- 📈 **MongoDB**: NoSQL database with Mongoose ODM
- ⚡️ **AWS Lambda**: Serverless compute service
- 📦 **AWS S3**: Object storage for media files
- 💸 **Stripe**: Payment processing and subscription management
- 🔑 **Passport**: Authentication middleware with OAuth strategies
- 📸 **Sharp**: High-performance image processing
- 📹 **FFmpeg**: Video processing and transformation
- 📄 **Swagger**: API documentation and testing
- 📈 **TypeScript**: Strongly typed JavaScript
- 📊 **Jest**: Testing framework
- 📈 **ESLint & Prettier**: Code quality and formatting
- ⚡️ **Serverless Framework**: Deployment and management of serverless applications

## 📚 Skills Demonstrated

- 📚 **Clean Architecture Design**: Implementation of separation of concerns
- 📈 **Microservice Architecture**: Modular serverless functions
- 📊 **Backend Development**: RESTful API design and implementation
- ⚡️ **Cloud Development**: AWS integration and serverless architecture
- 📈 **Database Design**: MongoDB schema and repository patterns
- 💸 **Payment Integration**: Secure handling of financial transactions
- 📸 **Media Processing**: Advanced image and video manipulation techniques
- 🔑 **Authentication & Security**: JWT, OAuth, and secure credential storage
- 🔒 **Data Encryption**: Protection of sensitive information
- 📊 **Testing**: Unit and integration test strategies

## 📄 License

This project is [MIT licensed](LICENSE).
