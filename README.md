# Keycloak Integration Proof of Concept (PoC) README

This README outlines the setup and configuration for a Proof of Concept (PoC) integrating Keycloak for authentication within an Express.js application. The setup includes a Dockerized environment for Keycloak and PostgreSQL, and demonstrates secure access to protected resources within the Express.js app using Keycloak's authentication and authorization capabilities.

## Overview

The purpose of this PoC is to demonstrate how Keycloak can be integrated with a Node.js Express application to manage user authentication and secure access to resources. This setup uses Docker to run Keycloak and PostgreSQL services, and provides instructions on configuring the Express app to verify tokens and protect routes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker and Docker Compose
- Node.js and npm
- An editor

## Setup Instructions

### Step 1: Docker Environment Setup

1. **Create `.env.docker` File**: Create a file named `.env.docker` in the same directory as your `docker-compose.yml`. This file should contain environment variables for the Docker services.

   Example `.env.docker` content:

   ```env
   POSTGRES_DB=keycloak
   POSTGRES_USER=keycloak
   POSTGRES_PASSWORD=password
   KEYCLOAK_ADMIN=admin
   KEYCLOAK_ADMIN_PASSWORD=admin
   ```

2. **Start Docker Services**: Run the following command to start Keycloak and PostgreSQL services:

   ```bash
   docker-compose up -d
   ```

### Step 2: Node.js Application Configuration

1. **Create `.env` File for Node.js App**: Inside the root directory of your Node.js application, create a `.env` file to store your application-specific environment variables.

   Example `.env` content:

   ```env
   KEYCLOAK_CONFIG_PATH=keycloak.json
   STATIC_FILES_PATH=./views/img
   PORT=3000
   ```

2. **Install Node.js Dependencies**: Navigate to your Node.js application directory and install required packages:

   ```bash
   npm install express keycloak-connect express-session jwt-decode cookie-parser dotenv ejs
   ```

3. **Run the Node.js Application**: Execute the following command to start your Express.js application:

   ```bash
   npm start
   ```

### Step 3: Accessing the Application

- Open your web browser and navigate to `http://localhost:3000` to view the home page of your Express application.
- Access protected routes like `/bye` and `/ressource` to test the authentication flow.

## Keycloak Configuration

- **Admin Console**: Access the Keycloak Admin Console via `http://localhost:8890` (or the port you configured) to manage realms, clients, and users.
- **Realm Setup**: Create or modify realms and clients according to your authentication requirements.
- **Client Configuration**: Ensure your Express app is configured as a client within Keycloak, and update the `keycloak.json` configuration file accordingly.

## Security

Ensure that sensitive information such as passwords, secrets, and private keys are not committed to version control. Use environment variables and `.env` files to manage these values securely.

## Troubleshooting

- **Docker Services**: If you encounter issues with the Docker services, use `docker-compose logs` to inspect the logs for Keycloak and PostgreSQL.
- **Keycloak Connection**: Verify that the Keycloak service is accessible and that the realm and client configurations match those expected by your application.

## Conclusion

This PoC demonstrates the integration of Keycloak with an Express.js application for secure authentication and resource protection. By following these instructions, you should have a basic yet functional setup showcasing Keycloak's capabilities within a Node.js environment.