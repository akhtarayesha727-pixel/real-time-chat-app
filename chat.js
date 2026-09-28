const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const typingIndicator = document.getElementById("typing-indicator");
const statusText = document.getElementById("status-text");
const clearBtn = document.getElementById("clear-btn");

const STORAGE_KEY = "chat_history";
let messageHistory = [];

function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function renderMessage(sender, text, timestamp) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  const bubbleDiv = document.createElement("div");
  bubbleDiv.classList.add("message-bubble");
  bubbleDiv.textContent = text;

  const timeSpan = document.createElement("span");
  timeSpan.classList.add("timestamp");
  timeSpan.textContent = timestamp;

  bubbleDiv.appendChild(timeSpan);
  messageDiv.appendChild(bubbleDiv);
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function saveMessage(sender, text, timestamp) {
  messageHistory.push({ sender, text, timestamp });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messageHistory));
}

function getBotReply(userText) {
  const text = userText.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! How can I help you today?";
  }
  if (text.includes("help")) {
    return "I can assist with account inquiries, order tracking, or general questions.";
  }
  if (text.includes("how are you")) {
    return "I'm doing well, thanks for asking! How about you?";
  }
  if (text.includes("bye")) {
    return "Goodbye! Have a great day ahead.";
  }

  return "Thanks for reaching out! A team member will follow up shortly if needed.";
}

function handleBotResponse(userText) {
  const delay = Math.floor(Math.random() * (1400 - 800 + 1)) + 800;

  statusText.textContent = "Typing...";
  typingIndicator.classList.remove("hidden");
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    typingIndicator.classList.add("hidden");
    statusText.textContent = "Online";

    const replyText = getBotReply(userText);
    const time = formatTime(new Date());

    renderMessage("received", replyText, time);
    saveMessage("received", replyText, time);
  }, delay);
}

function init() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      messageHistory = JSON.parse(saved);
      messageHistory.forEach((msg) => {
        renderMessage(msg.sender, msg.text, msg.timestamp);
      });
    } catch {
      messageHistory = [];
    }
  }

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    const time = formatTime(new Date());

    renderMessage("sent", text, time);
    saveMessage("sent", text, time);

    messageInput.value = "";
    messageInput.focus();

    handleBotResponse(text);
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    messageHistory = [];
    chatBox.innerHTML = "";
  });
}

init();