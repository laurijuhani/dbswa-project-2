### Scalable online question and answer platform

# Overview 

- G&A application where users can post questions on courses and answer to them as well. Users can also vote for each qurestion and answer once. 
- There is a cooldown for single user that they can't post another question/answer within minute. 
- There is also a notification pop-up which gives information about the action user has made. 
- The page shows questions/answers sorted so that the most recent ones are on the top (posted or voted).
- There is sample data in database which includes 4 courses and 23 questions on the first course (no AI generated answers for them)

# Design decisions 

- The AI answer genereting is done so that qa-api backend receives post request for new question, adds it to the database and makes 3 requests to the llm-api which generates answers. 
- Server uses SSE for the updating of the site so that user doesn't have to refresh site to see new questions/answers. The SSE is implemented so that the backend keeps track on the users path so it only sends data to users that are currently on that part of the site where the updated data takes place. 
- When user accesses each page of question/answer only 20 of those are requested at once. More are requested as user approaches end of the site.

# Performane improvements 

- One easy improvement would be increasing available processing power each cluster can use in k8s. I had to keep them quite low as my computer was struggling. 
- The qa-api could make all three requests for the answer generation to llm-api at the same time instead of making one request and waiting for it to finish before making another request. 