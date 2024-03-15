<script>
  import { notificationText, notificationType } from "../stores/stores";

  let dynamicClass; 

  const setNotification = () => {
    if ($notificationText === "") {
      dynamicClass = null; 
      return; 
    }

    // determine the color of the notification
    if ($notificationType === "success") {
      dynamicClass = "bg-green-500 text-white font-bold p-4 rounded m-4";
    } else if ($notificationType === "error") {
      dynamicClass = "bg-red-500 text-white font-bold p-4 rounded m-4";
    } else {
      // not correct type 
      dynamicClass = null; 
    }
  };

  $: ($notificationText || $notificationType) && setNotification();

</script>

{#if ($notificationText !== "")}
  <p class="notification {dynamicClass} p-4 m-4 mb-0">{$notificationText}</p>
{/if}