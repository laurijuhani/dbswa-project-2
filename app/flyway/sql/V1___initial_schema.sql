CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
); 

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  course_id INTEGER REFERENCES courses(id),
  user_uuid TEXT NOT NULL,
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE answers ( 
  id SERIAL PRIMARY KEY,
  answer_text TEXT NOT NULL,
  question_id INTEGER REFERENCES questions(id),
  user_uuid TEXT NOT NULL,
  votes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_uuid TEXT NOT NULL, 
  question_id INTEGER REFERENCES questions(id) DEFAULT NULL,
  answer_id INTEGER REFERENCES answers(id) DEFAULT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE INDEX idx_votes_question_id ON votes (question_id);
CREATE INDEX idx_votes_answer_id ON votes (answer_id);