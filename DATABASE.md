### Database schema 

# Courses
- This table stores information about courses 
- Attributes: 
* id
* name: `Name of the course`

# Questions 
- This table stores questions related to courses
- Attributes: 
* id 
* question_text
* course_id: `References to id in courses`
* user_uuid 
* votes: `Integer, stores number of votes`
* created_at: `Timestamp indicating the creation time`

# Answers 
- This table stores answers to questions
- Attributes: 
* id 
* answer_text 
* question_id: `References to id in questions`
* user_uuid 
* votes: `Integer, stores number of votes`
* created_at: `Timestamp indicating the creation time`

# Votes 
- This table stores users votes on questions and answers
- Attributes: 
* id 
* user_uuid 
* question_id: `References to id in questions`
* answer_id : `References to id in questions`
* voted_at: `Timestamp indicating the creation time`

# Indexes
- Indexes have been created on the `question_id` and `answer_id` columns of the `votes` table to optimize querying performance

# Caching 

- The project uses server-side caching using Redis. 
- The cache is flushed when new question or answer are  posted or someone votes either of the two. 