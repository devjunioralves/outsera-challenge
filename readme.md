## OUTSERA-CHALLENGE

This project is a Node service that, when started, reads a csv file and saves the data in an in-memory database. This API provides a get route to list the producer with the longest gap between two consecutive awards, and what
got two awards faster.

### How to run the project?

To run the project you need to have npm and node installed. You need to copy the `.env.example` file and rename it to `.env`. After that you need to run the `npm run dev` command to start the project. To run the integration tests you can run `npx jest`

To change the `movielist.csv` file you need replace the file on `src/data`

### How to run the tests?

- `npx jest`

### What would I improve on this project?

- Develop unit tests for the CSV reading service and database initialization
- Would work on standardization and objective messages in error handling

```
.
├── jest-unit-config.js
├── jest.config.js
├── package-lock.json
├── package.json
├── tsconfig.json
├── src
│   ├── jest.setup.ts
│   ├── index.ts
│   ├── application
│   ├── di
│   │   ├── container.ts
│   │   └── tokens.ts
│   ├── domain
│   │   └── **
│   │       ├── entities
│   │       │   ├── **.ts
│   │       ├── infra
│   │       │   ├── **Repository.ts
│   │       ├── services
│   │       │   ├── **Service.ts
│   │       ├── models
│   │       │   ├── **.ts
│   │       └── types
│   ├── infra
│   │   └── sqlite
│   │       └── SqliteConnection.ts
│   ├── presentation
│   │   └── http
│   │       ├── controllers
│   │       │   └── **
│   │       ├── routes
│   │       └── types
│   └── shared
│       ├── exceptions
│       └── http
│           ├── adapters
│           ├── controller
│           └── interfaces
```

- **`src/`**: The main source code directory.

  - **`application/`**: Contains application logic, including use cases and application coordinators.

  - **`di/`**: Directory for dependency injection, including container configuration and dependency tokens.

  - **`domain/`**: Contains the core domain logic, including:

    - **`entities/`**: Definitions of domain entities.
    - **`infra/`**: Domain-specific repository implementations and related interfaces.
    - **`services/`**: Domain services encapsulating business logic.
    - **`types/`**: Domain types and interfaces.

  - **`infra/`**: Application infrastructure, including:
  - - **`sqlite/`**: Sqlite-specific connection and operation implementations.

  - **`presentation/`**: Presentation layer, including:

    - **`http/`**: HTTP route handling and controllers.

  - **`shared/`**: Shared components, such as:
    - **`exceptions/`**: Definitions and handling of exceptions.
    - **`http/`**: HTTP adapters and common interfaces for communication.

Each directory is designed to maintain a clear separation between different aspects of the application, promoting modularity and easier maintenance.
