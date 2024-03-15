import { sql } from "../database/database.js";

const findAnswers = async (question_id, offset) => {
  return await sql`SELECT answers.*, 
                   CASE 
                    WHEN COALESCE(MAX(votes.voted_at), answers.created_at) > answers.created_at 
                    THEN COALESCE(MAX(votes.voted_at), answers.created_at)
                    ELSE answers.created_at
                   END AS updated_at,
                   COUNT(votes.id) AS votes FROM answers 
                   LEFT JOIN votes ON answers.id = votes.answer_id 
                   WHERE answers.question_id = ${question_id} GROUP BY answers.id
                   ORDER BY updated_at DESC LIMIT 20 OFFSET ${offset};`;
}; 

const addAnswer = async (answer_text, question_id, user_uuid) => {
  return await sql`INSERT INTO answers (answer_text, question_id, user_uuid) VALUES
            (${answer_text}, ${question_id}, ${user_uuid}) RETURNING answer_text, id, question_id, votes;`;
};

const lastAnswerByUser = async (user) => {
  return await sql`SELECT created_at FROM answers WHERE user_uuid = ${user}
                   ORDER BY created_at DESC LIMIT 1;`;
};

export { findAnswers, addAnswer, lastAnswerByUser };