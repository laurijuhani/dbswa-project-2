<script>
  import Spinner from "./Spinner.svelte";

  const getCourses = async () => {
    const response = await fetch("/api/courses"); 
    const data = await response.json(); 
    return data;
  };

  let coursesPromise = getCourses(); 
</script>



{#await coursesPromise}
  <Spinner /> 
  <p>Loading courses...</p>
{:then courses} 
{#if courses.length === 0}
  <p>No courses yet</p>
  {:else}
  <ul>  
    {#each courses as course}
    <li>
    <button class="font-bold p-4 rounded m-4 bg-gray-500 hover:bg-gray-700"
    on:click={() => window.location.href = `/course/${course.id}`}>
    {course.name}
  </button>
    </li>
    {/each}
  </ul>  
{/if}
{/await}

