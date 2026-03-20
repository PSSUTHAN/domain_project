# Java Backend (Spring Boot) for Engineers Veedu

This module is a Java replacement for the previous Python Flask backend.

## Features
- MySQL storage via JDBC and Spring Data JPA
- Authentication endpoints: `/api/register`, `/api/login`, `/api/profile`
- Chat endpoints: `/api/health`, `/api/chat`, `/api/clear`
- Uses `knowledge_base.json` from existing data

## Setup
1. Install Java 17+ and Maven.
2. Create MySQL database:
   - `CREATE DATABASE engineers_veedu;`
3. Configure `src/main/resources/application.properties` MySQL credentials.
4. Build and run:
   - `mvn clean install`
   - `mvn spring-boot:run`
5. Open `http://localhost:8080/api/health`

## Notes
- Password hashing uses BCrypt.
- JWT is mocked as `mock-jwt-token-xyz-123` (replace with real JWT flow for production).
- Existing `backend/app.py` remains in repository as reference; new backend lives in `backend-java`.
