import { sql } from "../database/database.js";

const findVotes = async () => {
  return await sql`SELECT * FROM votes;`; 
};


const insertQuestionVote = async (user, question_id) => {
  return await sql`INSERT INTO votes (user_uuid, question_id) VALUES
                   (${user}, ${question_id});`;
}; 

const insertAnswerVote = async (user, answer_id) => {
  return await sql`INSERT INTO votes (user_uuid, answer_id) VALUES
                   (${user}, ${answer_id});`;
};

const deleteVote = async (user, question_id = 0, answer_id = 0)  => {
  return await sql`DELETE FROM votes WHERE user_uuid = ${user} AND 
                  (question_id = ${question_id} OR answer_id = ${answer_id});`;
};

const findUserVotesById = async (user, question_id = 0, answer_id = 0) => {
  return await sql`SELECT * FROM votes WHERE user_uuid = ${user} AND 
                  (question_id = ${question_id} OR answer_id = ${answer_id});`;
};



export { findVotes, insertAnswerVote, insertQuestionVote, deleteVote, findUserVotesById };