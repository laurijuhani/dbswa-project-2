### Running the application 

## NOTE:
- If qa-ui image gives error not finding app/dist/server/entry.mjs when trying to run in production just run `npm run build` inside qa-ui folder and it fixed it for me
- don't know why it doesn't always build it in dockerfile.prod. In kubectl and minikube it works fine, atleast for me. 
- It would be best to run this project using Ubuntu with amd64 architecture where the configurations are mainly made. 

# Installing neccessary dependecies 
- In qa-ui folder run `npm install`

# Development 
- To run the application in development mode open terminal in the app directory 
  of the project and run `docker compose up`.
- NOTE: After adding `deno adapter` to `qa-ui` for dynamic routes to work in production it somehow crashed the development build for apple silicon devices. So if you are using computer with Apple silicon processor and want to use this app in development mode I have made a folder in root directory called `docker_development_arm64` where there are `docker-compose.yml` and `astro.config.mjs` files, which you can use to start it development. 

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
- In root directory of the project run command `kubectl apply -f kubernetes`

# Exposing the application 
- Please note that it can take several minutes before all the dpeloyments are ready. 
- To be able to access the application outside the cluster run command `minikube service ingress-nginx-controller -n ingress-nginx --url`


## Running monitoring
- To run monitoring you need to have `helm` installed in your machine. Follow insctructions in this link `https://helm.sh/docs/intro/install/` to download helm if you don't have it already
- After installing helm and cluster running run command `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts` and `helm repo update`
- Then install prometheus to cluster with command `helm install prometheus prometheus-community/prometheus`
- You need to expose prometheus with `kubectl expose service prometheus-server --type=NodePort --target-port=9090 --name=prometheus-server-ext`
- And open the application with `minikube service prometheus-server-ext`
- The command gives you URL of prometheus
- Then we need to install Grafana 
- First run `helm repo add grafana https://grafana.github.io/helm-charts` and `helm repo update`
- Then install grafana with `helm install grafana grafana/grafana`
- Expose Grafana using command `kubectl expose service grafana --type=NodePort --target-port=3000 --name=grafana-ext`
- Then open the application with `minikube service grafana-ext`
- The command gives you the URL of Grafana. Open the page. 
- To login to Grafana you need password which you can get from terminal by running `kubectl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo` 
- Username is `admin`
- When inside Grafana go into `Data sources` and add `Prometheus` data source. Grafana asks for the URL of the Prometheus and it is the first url which you got when you opened Prometheus application
- Then click `Save & test`
- After that you are rady to add dashboard to Grafana. 
- Go to `Dashboards`and `add visualization` then click `import` and enter 315 and hit `Load`
- Select `Prometheus` as a data source
- Now you should have basic monitoring of the Kubernetes cluster