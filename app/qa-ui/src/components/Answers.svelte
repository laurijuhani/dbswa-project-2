<script>
  import { onMount } from "svelte";
  import { userUuid, aCooldown } from "../stores/stores";
  import { setCooldown, setNotification } from "../services/utility";
  import Spinner from "./Spinner.svelte";

  export let cid; 
  export let qid; 
  
  const goBack = () => {
  window.location.href = `/course/${cid}`; 
}; 

let newAnswer = ''; 
let loading = false; 
let question; 
let answers = []; 
let eventSource; 

const connectToSSE = (url) => {
  eventSource = new EventSource(url);
  eventSource.onmessage = (event) => {
    const jsonData = JSON.parse(event.data);
    answers.unshift(jsonData[0]);

    // force rerender
    const temp = answers;
    answers = temp; 
  }
}

const closeSSE = () => {
  if (eventSource) {
    eventSource.close(); 
    eventSource = null; 
  };
};

const getAnswers = async () => {
  if (loading) return; 
  loading = true;

  const response = await fetch(`/api/course/${cid}/question/${qid}?offset=${answers.length}`);
  const res = await response.json(); 
  question = res.question[0].question_text;

  if (res.answers.length < 20) {
    window.removeEventListener('scroll', handleScroll)
  }

  answers = [...answers, ...res.answers]
  loading = false; 
  return; 
}; 

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement; 

  if (scrollHeight - scrollTop <= clientHeight) {
    getAnswers();
  }
};

onMount(() => {
  getAnswers(); 
  window.addEventListener('scroll', handleScroll);
  connectToSSE(`/api/sse/answers/${qid}`);
  return () => {
    closeSSE();
    window.removeEventListener('scroll', handleScroll);
  }
});


const postAnswer = async () => {
  const response = await fetch(`/api/course/${cid}/question/${qid}`, {
    method: "POST",
    headers: {
      'user': JSON.stringify($userUuid),
    },
    body: JSON.stringify(newAnswer),
  }); 
  
  if (response.status === 403) {
    setNotification(await response.text(), true);
    return;
  }
  
  setCooldown(1); // sets cooldown so that can't post answer within a minute. 
  setNotification(`Added new answer: ${newAnswer}`);
  newAnswer = '';
  return; 
}; 

const handleButtonClick = () => {
  if ($aCooldown) {
    setNotification("You need to wait a minute to post new answer", true); 
    return;
  }
  if (newAnswer !== "") {
    postAnswer(); 
  }
};

const vote = async (id) => {
  const response = await fetch(`/api/vote/answer/${id}`, {
    method: "POST",
    headers: {
      'user': JSON.stringify($userUuid),
    },
  });

  if (response.ok) {
    answers = answers.map((answer) => 
    answer.id === id ? {...answer, votes: answer.votes + 1 } : answer)

    answers.sort((a, b) => {
      if (a.id === id) {
        return -1;
      } else if (b.id === id) {
        return 1;
      } else return 0; 
    });
    setNotification('Answer voted!', false);
  } else {
    setNotification(await response.text(), true);
  }

  return;
};

const handleVoteClick = (id) => {
  vote(id);
};


</script>

<button class="p-3 rounded m-4 bg-gray-500 hover:bg-gray-700" on:click={goBack}>Back</button>

{#if loading}
<Spinner /> 
<p>Loading answers...</p>
{:else}
<h2 class="text-2xl text-gray-700 font-serif">{question}</h2>

<textarea bind:value={newAnswer} placeholder="Add a answer..."></textarea>
<button class="p-2 rounded m-4 bg-gray-500 hover:bg-gray-700" on:click={handleButtonClick}>Add</button>

{#if answers.length === 0}
  <p>No answers yet</p>
{:else}
  <ul>
    {#each answers as answer}
      <li class="border-b border-black p-2">
        {answer.answer_text}
        <div>
          Votes: {answer.votes}
          <button class="p-3 rounded m-4 bg-green-700 hover:bg-green-900"
          on:click={handleVoteClick(answer.id)}>Vote</button>
        </div>
      </li>
    {/each}
  </ul>
{/if}


{/if}