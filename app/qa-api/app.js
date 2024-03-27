import { serve } from "./deps.js";
import * as courseService from "./services/coursesService.js";
import * as questionService from "./services/questionService.js"; 
import * as answerService from "./services/answerService.js";
import * as voteService from "./services/voteService.js";
//import { cacheMethodCalls } from "./util/cacheUtil.js";

const cachedQuestionService = cacheMethodCalls(questionService, ["addQuestion"]); 
const cachedAnswerService = cacheMethodCalls(answerService, ["addAnswer"]); 
const cachedCourseService = cacheMethodCalls(courseService, []); 
const cachedVoteService = cacheMethodCalls(voteService, ["insertAnswerVote", "insertQuestionVote", "deleteVote"]);

let controllers = new Set(); 
const encoder = new TextEncoder();

const getCourses = async () => {
  const courses = await cachedCourseService.findAll(); 
  return Response.json(courses);
};

const getQuestionsByCourseId = async (request) => {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  const course_id = parts[2];
  const urlParams = new URLSearchParams(request.url.split("?")[1] || "");
  const offset = urlParams.get("offset") || "0";

  const course = await cachedCourseService.findById(course_id); 
  const questions = await cachedQuestionService.findByCourseId(course_id, offset);

  // make votes an int instead of a string 
  questions.forEach(question => {
    question.votes = parseInt(question.votes);
  });

  const response = {
    course,
    questions,
  }; 

  return Response.json(response);
}; 

const getAnswersByQuestionId = async (request) => {
  const url = new URL(request.url); 
  const parts = url.pathname.split('/');
  const course_id = parts[2];
  const question_id = parts[4];
  const urlParams = new URLSearchParams(request.url.split("?")[1] || "");
  const offset = urlParams.get("offset") || "0";

  const question = await cachedQuestionService.findQuestion(course_id, question_id);

  if ((question[0].id).toString() === question_id.toString()) {
    const answers = await cachedAnswerService.findAnswers(question_id, offset);
    answers.forEach(answer => {
      answer.votes = parseInt(answer.votes);
    });

    const resposne = {
      question,
      answers,
    }; 
    return Response.json(resposne);
  } else {
    // if question id does not match 
    const response = {
      question: "error",
      answers: "error",
    };
    return Response.json(response);
  }
}; 


const addQuestion = async (request) => {
  const url = new URL(request.url);
  const course_id = (url.pathname.split("/"))[2];
  const user = request.headers.get("user").replace(/^"|"$/g, "");

  try {
    const lastQuestion = await cachedQuestionService.lastQuestionByUser(user);
    if (lastQuestion.length > 0) {
      const questionTime = new Date(lastQuestion[0].created_at);
      const currentTime = new Date();
      const diff = (currentTime - questionTime) / 1000; 
      if (diff < 60) {
        return new Response("You need to wait a minute to post new question", { status: 403 });
      }
      
    }

    const text = await request.json(); 
    const newQuestion = await cachedQuestionService.addQuestion(course_id, text, user);
    sendQuestionSSE(newQuestion); 
    generateAnswers(newQuestion);
    return new Response('OK', {status: 201 }); 
  } catch (e) {
    console.error("Error adding question: ", e); 
    return new Response("Error adding question", { status: 500 });
  }
};

const sendQuestionSSE = (newQuestion) => {
  const msg = encoder.encode(`data: ${JSON.stringify(newQuestion)}\n\n`);
    controllers.forEach((item) => {
      if (item.type.startsWith("questions") && parseInt(item.id) === parseInt(newQuestion[0].course_id)) {
        item.controller.enqueue(msg);
      }
    });
}; 

const generateAnswers = async (question) => {
  try {
    const data = {
      question: question[0].question_text,
    };

    // generate 3 answers using AI and sending it to client via SSE 
    for (let i = 0; i < 3; i++) {
      const response = await fetch("http://llm-api:7000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    
      const responseBody = await response.json(); 
    
      const text = responseBody[0].generated_text.replace(data.question, '');
      const answer = await cachedAnswerService.addAnswer(text, question[0].id, 'generated'); 
      sendAnswerSSE(answer);
    }; 
  } catch (e) {
    console.error(e);
  }
};

const addAnswer = async (request) => {
  const user = request.headers.get("user").replace(/^"|"$/g, "");

  const url = new URL(request.url); 
  const parts = url.pathname.split('/');
  const question_id = parts[4];

  try {
    const lastAnswer = await cachedAnswerService.lastAnswerByUser(user);
    if (lastAnswer.length > 0) {
      const answerTime = new Date(lastAnswer[0].created_at);
      const currentTime = new Date();
      const diff = (currentTime - answerTime) / 1000;
      if (diff < 60) {
        return new Response("You need to wait a minute to post new answer", {status: 403 });
      }
    }
    
    const answer = await request.json(); 
    const newAnswer = await cachedAnswerService.addAnswer(answer, question_id, user);
    sendAnswerSSE(newAnswer);
    return new Response('OK', { status: 201 });
  } catch (e) {
    console.error("Error adding answer: ", e); 
    return new Response("Error adding answer", { status: 500 });
  }
}; 

const sendAnswerSSE = (newAnswer) => {
  const msg = encoder.encode(`data: ${JSON.stringify(newAnswer)}\n\n`);
  controllers.forEach((item) => {
    if (item.type.startsWith("answers") && parseInt(item.id) == parseInt(newAnswer[0].question_id)) {
      item.controller.enqueue(msg);
    }
  });
};

const vote = async (request) => {
  const user = request.headers.get("user").replace(/^"|"$/g, "");

  const url = new URL(request.url); 
  const parts = url.pathname.split('/'); 
  const category = parts[2]; 
  const id = parts[3]; 

  try {
    if (category.startsWith('question')) {
      const previousVotes = await cachedVoteService.findUserVotesById(user, id, 0);
      if (previousVotes.length >= 1) {
        return new Response("You have already voted this question", { status: 400 });
      }
      await cachedVoteService.insertQuestionVote(user, id);
    } else if (category.startsWith('answer')) {
      const previousVotes = await cachedVoteService.findUserVotesById(user, 0, id);
      if (previousVotes.length >= 1) {
        return new Response("You have already voted this answer", { status: 400 });
      }
      await cachedVoteService.insertAnswerVote(user, id);
    }  
    return new Response("OK", { status: 200 });  
  } catch (e) {
   console.error('Error at voting', e);
   return new Response("Error adding vote", { status: 500 });
  }
};

const openSSE = (request) => {
  const url = new URL(request.url); 
  const parts = url.pathname.split('/'); 
  const type = parts[2]; 
  const id = parts[3];

  let item;
  let controller;
  
  const body = new ReadableStream({
    start(c) {
      controller = c;
      item = { controller, type, id }; 
      controllers.add(item); 
    }, 
    cancel() {
      controllers.delete(item);
    },
  }); 

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "*",
      "Connection": "keep-alive",
    },
  });
}; 



const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses"}),
    fn: getCourses,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/course/:id"}),
    fn: getQuestionsByCourseId,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/course/:cId/question/:qId"}),
    fn: getAnswersByQuestionId,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/sse/:type/:id" }),
    fn: openSSE,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/course/:id"}),
    fn: addQuestion,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/course/:cId/question/:qId"}),
    fn: addAnswer,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/vote/:category/:id"}),
    fn: vote,
  },
]; 

const handleRequest = async (request) => {

  
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  ); 

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 });
  }
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);