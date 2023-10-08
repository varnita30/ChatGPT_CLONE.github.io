const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const chatContainer = document.querySelector('.chat-container');
const themeButton = document.querySelector('#theme-btn');
const DeleteButton = document.querySelector('#delete-btn');


let userText = null;
const API_KEY = "";

const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");
    document.body.classList.toggle("light-mode", themeColor === "light-mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark-mode" : "light-mode";
    const defaultText = `<div class="default-text">
                        <h1>ChatGPT clone</h1>
                       <p>Start to Communicate with AI tool</p>
                        </div>`;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}
loadDataFromLocalstorage();

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}


const getChatResponse = async () => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "text-devinci-003",
            prompt: userText,
            max_tokens: 3000,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    }
    catch (error) {
        //console.log(error);
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong";
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    if (responseTextElement) {
        navigator.clipboard.writeText(responseTextElement.textContent);
        copyBtn.textContent = "done";
        setTimeout(() => copyBtn.textContent = "content_copy", 1000);
    }
}


const showTyoingAnimation = () => {
    const html = `  <div class="chat-content">
    <div class="chat-details">
        <img src="chatgpt-icon.webp" alt="chatbot-img">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s"></div>
            <div class="typing-dot" style="--delay: 0.3s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
    </div>
    <span onclick="copyResponse(this)" class="rounded"><i class="fas fa-copy copy-icon"></i></span>
</div>`;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = ` <div class="chat-content">
        <div class="chat-details">
            <img src="images.jpg" alt="user-img">
            <p>${userText}</p>
        </div>
    </div>`;

    const outgoingChatDiv = createElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatDiv);
    document.querySelector(".default-text")?.remove();
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTyoingAnimation, 500);
}



themeButton.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark-mode" : "light-mode";
});

DeleteButton.addEventListener("click", () => {
    if (confirm("Are you sure to delete all?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});



chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat)