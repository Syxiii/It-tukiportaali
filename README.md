1. BACKEND AND FRONTEND

- Pre-requisites: Docker Desktop and docker-compose.

- To launch a dev only version of the project use the provided docker-compose.dev.yml in the root folder by running docker compose -f docker-compose.dev.yml up --build
- After running you should have frontend runnning on localhost:5173 and backend on localhost:8080, and any changes you make to the code will be hotswapped to the container.

- For Production deployment push to the main branch and it will automatically run tests and deploy it on the cloud

3. MOBILE