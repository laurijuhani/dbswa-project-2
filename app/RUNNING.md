### Running the application 

## NOTE:
- If qa-ui image gives error not finding app/dist/server/entry.mjs just run `npm run build` inside qa-ui folder and it fixed it for me
- don't know why it doesn't build it in dockerfile.prod

# Installing neccessary dependecies 
- In qa-ui folder run `npm install`

# Development 
- To run the application in development mode open terminal in the app directory 
  of the project and run `docker compose up`.

# Production 
- To run the application in production mode open terminal in the app directory 
  of the project and run `docker compose -f docker-compose.prod.yml up -d`.

# Tests 
- To run playwright tests open the project either in development or production and in the app directory 
  run `docker compose run --entrypoint=npx e2e-playwright playwright test && docker compose rm -sf`.

TODO: For merits, the RUNNING.md also outlines the steps needed to use Kubernetes to run the application with Minikube (or somilar), using kubernetes configuration files created as parts of the passing with merits requirements