const sideNavigation = document.querySelector(".sideNavigation"),
    sideBarToggle = document.querySelector(".fa-bars"),
    startContentUI = document.querySelector(".startContent ul"),
    inputArea = document.querySelector(".inputArea input"),
    sendRequest = document.querySelector(".fa-paper-plane"),
    chatHistory = document.querySelector(".chatHistory ul"),
    results = document.querySelector(".results"),
    startContent = document.querySelector(".startContent"),
    chatContent = document.querySelector(".chatContent"); // Ensure chatContent is selected

const promptQuestion = [
    { question: "Write a thank you note to my subscribers", icon: "fa-solid fa-wand-magic-sparkles" },
    { question: "Write a Sample Code to learn JavaScript", icon: "fa-solid fa-code" },
    { question: "How to become a Front-end Developer?", icon: "fa-solid fa-database" },
    { question: "How to become a Full Stack Developer?", icon: "fa-solid fa-laptop-code" },
];

window.addEventListener("load", () => {
    promptQuestion.forEach((data) => {
        let item = document.createElement("li");
        item.addEventListener("click", () => {
            getGeminiResponse(data.question);
        });
        item.innerHTML = `
            <div class="promptSuggestion">
                <p>${data.question}</p>
                <div class="icon"><i class="${data.icon}"></i></div>
            </div>`;
        startContentUI.append(item);
    });
});

sideBarToggle.addEventListener("click", () => {
    sideNavigation.classList.toggle("expandClose");
});

inputArea.addEventListener("keyup", (e) => {
    sendRequest.style.display = e.target.value.length > 0 ? "inline" : "none";
});

sendRequest.addEventListener("click", () => {
    getGeminiResponse(inputArea.value);
});
const appendHistory = true;

function getGeminiResponse(question) {
    console.log("Fetching response for: ", question);
    
    // Add question to chat history
    if(appendHistory){
        let historyLi = document.createElement("li");
        historyLi.addEventListener("click", () => {
            getGeminiResponse(question, false);
        });
        historyLi.innerHTML = `<i class="fa-regular fa-message"></i> ${question}`;
        chatHistory.append(historyLi);
    }
    
    // Clear results and input field
    results.innerHTML = "";
    inputArea.value = "";

    // Hide the start content and show the chat content
    startContent.style.display = "none";
    chatContent.style.display = "block";

    let resultTitle = `
        <div class="resultTitle">
            <img src="https://th.bing.com/th/id/OIP.6Y4WJ8OcVQqJoFd3JKrQxQAAAA?rs=1&pid=ImgDetMain"/>
            <p>${question}</p>
        </div>
    `;

    let resultData = `
        <div class="resultData">
            <img src="https://th.bing.com/th/id/OIP.hDYdu41z9qSUmx0K3wuSuQAAAA?rs=1&pid=ImgDetMain"/>
            <div class="loader">
                <div class="animatedBG"></div>
                <div class="animatedBG"></div>
                <div class="animatedBG"></div>
            </div>
        </div>
    `;

    results.innerHTML += resultTitle;
    results.innerHTML += resultData;

    // Construct the AI response fetch
    const AIURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAxeI3h6206r_jsSEx8qmyiXoa_11OO7CM`;

    fetch(AIURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: question }]
                }
            ]
        })
    })
    .then((response) => response.json())
    .then((data) => {
        const aiResponse = jsonEscape(data.candidates[0].content.parts[0].text);

        // Split response by "**" and wrap the necessary parts in <strong>
        let responseArray = aiResponse.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i % 2 === 1) { // Odd indexes should be bold
                newResponse += `<strong>${responseArray[i]}</strong>`;
            } else {
                newResponse += responseArray[i];
            }
        }

        // Remove the loader and display the formatted response
        document.querySelector(".results .resultData").remove();
        results.innerHTML += `
            <div class="resultResponse">
                <img src="https://th.bing.com/th/id/OIP.hDYdu41z9qSUmx0K3wuSuQAAAA?rs=1&pid=ImgDetMain"/>
                <p id="typeEffect">${newResponse}</p>
            </div>
        `;
    })
    .catch((error) => {
        console.error("Error fetching AI response:", error);
        results.innerHTML = `<p>Sorry, an error occurred while fetching the response.</p>`;
    });
}

function newChat(){
    startContent.style.display = "block";
    chatContent.style.display = "none";
}

function jsonEscape(str) {
    return str.replace(new RegExp("\r?\n\n", "g"), "<br>").replace(new RegExp("\r?\n", "g"), "<br>");
}
