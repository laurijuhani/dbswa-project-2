import { sql } from "../database/database.js";

const findAll = async () => {
  return await sql`SELECT * FROM courses;`;
}; 


const findById = async (id) => {
  return await sql`SELECT * FROM courses WHERE id = ${id};`;
};


export { findAll, findById }; 