### Running the application 

## NOTE:
- If qa-ui image gives error not finding app/dist/server/entry.mjs when trying to run in production just run `npm run build` inside qa-ui folder and it fixed it for me
- don't know why it doesn't build it in dockerfile.prod. In kubectl and minikube it works fine, atleast for me. 

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

### Running using Kubernetes 
- NOTE: This configuration doesn't work with minikube on Apple Silicon because minikube can't run amd64 docker images via emulator
- NOTE V2: If you are deploying to k8s, please go and see `app/qa-api/database/database.js` and change database credentials for it to work on k8s. Instructions are on the database.js

# Deploying the application
- First you need to enable `ingress` on minikube if you haven't already. To enable it run command `minikube addons enable ingress`
- You also need `CloudNativePG`. You can get it by running command `kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.19/releases/cnpg-1.19.1.yaml`

# Building docker images 
- app-database-migrations: in `/app/flyway` run command `minikube image build -t app-database-migrations -f ./Dockerfile .`
- llm-api: in `/app/llm-api` run command `minikube image build -t llm-api -f ./Dockerfile .`
- qa-api: in `/app/qa-api` run command `minikube image build -t qa-api -f ./Dockerfile.prod .`
- qa-ui: in `/app/qa-ui` run command `minikube image build -t qa-ui -f ./Dockerfile.prod .`

# Configuring yaml files 
- In root directory of the project run command `kubectl apply -f kubernetes/*.yaml`

# Exposing the application 
- Please note that it can take several minutes before all the dpeloyments are ready. 
- To be able to access the application outside the cluster run command `minikube service ingress-nginx-controller -n ingress-nginx --url`