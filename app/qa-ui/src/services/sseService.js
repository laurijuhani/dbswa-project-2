let eventSource = null;

export const connectToSSE = (url, callback) => {
  eventSource = new EventSource(url);
  eventSource.onmessage = (event) => {
    callback(JSON.parse(event.data));
  };
}; 

export const closeSSE = () => {
  if (eventSource) {
    eventSource.close(); 
    eventSource = null;
  };
}; 
