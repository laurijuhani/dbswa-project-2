<script>
import { onMount } from "svelte";
import { userUuid, qCooldown } from "../stores/stores";
import { setCooldown, setNotification} from "../services/utility";
import Spinner from "./Spinner.svelte";
export let course_id;

let newQuestion = "";
let loading = false;
let eventSource;

const goBack = () => {
  window.location.href = "/"; 
}; 

const connectToSSE = (url) => {
  eventSource = new EventSource(url);
  eventSource.onmessage = (event) => {
    const jsonData = JSON.parse(event.data);
    console.log(jsonData);
    questions.unshift(jsonData[0]);
    // to force svelte to rerender
    const temp = questions; 
    questions = temp;
    
  };
};

const closeSSE = () => {
  if (eventSource) {
    eventSource.close(); 
    eventSource = null;
  };
};


const getQuestions = async () => {
  if (loading) return; 
  loading = true;

  const response = await fetch(`/api/course/${course_id}?offset=${questions.length}`);
  const data = await response.json();
  course = data.course[0].name;

  // if less than 20 questions are received no need to get anymore
  if (data.questions.length < 20) {
    window.removeEventListener('scroll', handleScroll);
  }

  questions = [...questions, ...data.questions];

  loading = false; 
  return; 
}


const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // if at the bottom of the page load new guestions
  if (scrollHeight - scrollTop <= clientHeight) {
    getQuestions(); 
  }
}

onMount(() => {
  getQuestions(); 
  window.addEventListener('scroll', handleScroll);
  connectToSSE(`/api/sse/questions/${course_id}`)
  return () => {
    closeSSE(); 
    window.removeEventListener('scroll', handleScroll);
  }
}); 

let questions = [];   
let course;

const postQuestion = async () => {
  const response = await fetch(`/api/course/${course_id}`, {
    method: "POST",
    headers: {
      'user': JSON.stringify($userUuid), 
    },
    body: JSON.stringify(newQuestion),
  });
  
  if (response.status === 403) {
    const message = await response.text()
    setNotification(message, true);
    return;
  }

  
  setCooldown(0); // sets one a minute cooldown so that can't post question. 
  setNotification(`Added new question: ${newQuestion}`, false);
  newQuestion = ''; 
  
  return; 
}; 

const handleButtonClick = () => {
  if ($qCooldown) {
    setNotification("You need to wait a minute to post new question", true);
    return;
  }
  if (newQuestion !== "") {
    postQuestion(); 
  }
};

const vote = async (id) => {
  const response = await fetch(`/api/vote/question/${id}`, {
    method: "POST",
    headers: {
      'user': JSON.stringify($userUuid),
    },
  }); 

  if (response.ok) {
    questions = questions.map((question) => 
      question.id === id ? {...question, votes: question.votes + 1 } : question
    )

    questions.sort((a, b) => {
      if (a.id === id) {
        return -1; 
      } else if (b.id == id) {
        return 1; 
      } else return 0; 
    }); 
    setNotification('Question voted!', false); 
  } else {
    setNotification(await response.text(), true);
  }

  return; 
}; 

const handleVoteClick = (id) => {
  vote(id)
};

</script>


<button class="p-3 rounded m-4 bg-gray-500 hover:bg-gray-700" on:click={goBack}>Back</button>

{#if loading && questions.length === 0}
 <Spinner />
<p>Loading questions...</p>
{:else}

<h2 class="text-2xl text-gray-700 font-serif">{course}</h2>
<textarea bind:value={newQuestion} placeholder="Add a question..."></textarea>
<button class="p-2 rounded m-4 bg-gray-500 hover:bg-gray-700" on:click={handleButtonClick}>Add</button>
{#if questions.length === 0}
<p>No questions yet</p>
{:else}
  
  <ul>
    {#each questions as question}
      <li class="border-b border-black p-2">
        <button class="font-bold p-4 rounded m-4 bg-gray-500 hover:bg-gray-700"
     on:click={() => window.location.href = `/course/${course_id}/question/${question.id}`}>
     {question.question_text}
    </button>
    <div class={question.id}>
      Votes: {question.votes} 
      <button class="{question.id} p-3 rounded m-4 bg-green-700 hover:bg-green-900"
        on:click={handleVoteClick(question.id)}>
        Vote
      </button>
    </div>
      </li>
    {/each}
  </ul>
{/if}



{#if loading && questions.length !== 0}
  <p>Loading more questions...</p>
{/if}


  
{/if}