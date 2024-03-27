import { postgres } from "../deps.js";

// Please change which configuration is commented out based on do you want to deploy on docker or k8s
// For Kubernetes comment out all the code form line 9 to line 24.


// For Kubernetes:

const PGPASS = Deno.env.get("PGPASS").trim();
const PGPASS_PARTS = PGPASS.split(":");

const host = PGPASS_PARTS[0];
const port = PGPASS_PARTS[1];
const database = PGPASS_PARTS[2];
const username = PGPASS_PARTS[3];
const password = PGPASS_PARTS[4];

const sql = postgres({
  host,
  port,
  database,
  username,
  password,
})



// For docker: 

//const sql = postgres({});

export { sql }; 