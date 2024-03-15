import { qCooldown, aCooldown, notificationText, notificationType } from "../stores/stores";
export const setCooldown = (type) => {
  if (type === 0) {
    qCooldown.set(true);
  } else {
    aCooldown.set(true);
  }
  setTimeout(() => {
    if (type === 0) {
      qCooldown.set(false);
    } else {
      aCooldown.set(false);
    }
  }, 60000);
};

export const setNotification = (text, type) => {
  notificationText.set(text, type);
  if (type) notificationType.set("error")
  else notificationType.set("success") 
  setTimeout(() => {
    notificationText.set("", false);
  }, 5000);
}