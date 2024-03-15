import { readable, writable } from "svelte/store";

let user = localStorage.getItem("userUuid");

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
} 

export const userUuid = readable(user);
export const qCooldown = writable(false); 
export const aCooldown = writable(false); 

export const notificationText = writable("");
export const notificationType = writable("");