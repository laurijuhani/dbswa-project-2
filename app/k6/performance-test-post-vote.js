import http from "k6/http";

export const options = {
  duration: "10s",
  summaryTrendStats: ["avg", "p(99)"],
}; 

let user = 1; 

export default function() {
  http.post("http://localhost:7800/api/vote/question/1", 
  JSON.stringify(""), {
    headers: {
      "Content-Type":"application/json",
      "user": user.toString(),
    }
  });

  user++; 
};