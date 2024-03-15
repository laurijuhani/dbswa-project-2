import { sql } from "../database/database.js";

const findByCourseId = async (course_id, offset) => {
  return await sql`SELECT questions.*, 
                   CASE 
                    WHEN COALESCE(MAX(votes.voted_at), questions.created_at) > questions.created_at 
                    THEN COALESCE(MAX(votes.voted_at), questions.created_at)
                    ELSE questions.created_at
                   END AS updated_at,
                   COUNT(votes.id) AS votes FROM questions 
                   LEFT JOIN votes ON questions.id = votes.question_id 
                   WHERE questions.course_id = ${course_id} GROUP BY questions.id
                   ORDER BY updated_at DESC LIMIT 20 OFFSET ${offset};`;
};

const findQuestion = async (course_id, question_id) => {
  return await sql`SELECT * FROM questions WHERE id = ${question_id} AND course_id = ${course_id};`;
};

const addQuestion = async (course_id, text, user) => {
  return await sql`INSERT INTO questions (question_text, course_id, user_uuid) VALUES
            (${text}, ${course_id}, ${user}) RETURNING course_id, question_text, votes, id;`;
};

const lastQuestionByUser = async (user) => {
  return await sql`SELECT created_at FROM questions WHERE user_uuid = ${user}
                   ORDER BY created_at DESC LIMIT 1;`;
}; 

export { findByCourseId, findQuestion, addQuestion, lastQuestionByUser };