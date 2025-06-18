const chatbotToggle = document.getElementById("chatbotToggle");
const chatbotPanel = document.getElementById("chatbotPanel");
const closeChatbot = document.getElementById("closeChatbot");
const chatbotBody = document.getElementById("chatbotBody");
const userInput = document.getElementById("userInput");
const sendMessage = document.getElementById("sendMessage");

chatbotToggle.addEventListener("click", () => {
  gsap.to(chatbotPanel, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
});

closeChatbot.addEventListener("click", () => {
  gsap.to(chatbotPanel, { scale: 0, opacity: 0, duration: 0.3 });
});

sendMessage.addEventListener("click", sendUserMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendUserMessage();
});

function sendUserMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  appendMessage(msg, "user");
  userInput.value = "";

  // Simulate typing
  const typingDots = document.createElement("div");
  typingDots.className = "bot-message typing";
  typingDots.innerHTML = "<span></span><span></span><span></span>";
  chatbotBody.appendChild(typingDots);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;

  // Send to API
  fetchOpenAI(msg).then((reply) => {
    chatbotBody.removeChild(typingDots);
    appendMessage(reply, "bot");

    // Scroll logic
    if (reply.toLowerCase().includes("project")) scrollToSection("#projects");
    if (reply.toLowerCase().includes("skills")) scrollToSection("#skills");
    if (reply.toLowerCase().includes("contact")) scrollToSection("#contact");
  });
}

function appendMessage(text, type) {
  const msgEl = document.createElement("div");
  msgEl.className = `${type}-message`;
  msgEl.textContent = text;
  chatbotBody.appendChild(msgEl);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

// ------------------ OpenAI GPT Integration ------------------

async function fetchOpenAI(userInput) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_OPENAI_API_KEY"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful AI guide for Azaz's portfolio website. Respond in friendly tone. If user asks to see projects, skills, or contact, suggest scrolling there." },
          { role: "user", content: userInput }
        ],
        temperature: 0.6
      })
    });

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI Error", err);
    return "Sorry, I couldn’t connect to the AI core.";
  }
}
