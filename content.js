console.log("Content script has been injected into ", window.location.hostname);

if (window.location.hostname === "chatgpt.com") {
  console.log("We are on the correct domain (chat.openai.com).");
}

let sendButton = null;
let popup = null;
let forceSendTriggered = false;
let isOriginalTextActive = true; // Default state: "Original Text" is selected
let originalPromptText = ""; // Store original prompt text
let jsonResponse = null; // Store the response from the server

const createPopup = () => {
  if (popup) return;

  popup = document.createElement("div");
  popup.id = "custom-popup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "white";
  popup.style.color = "#333";
  popup.style.padding = "15px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.5)";
  popup.style.zIndex = "9999";
  popup.style.width = "320px";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";
  popup.style.alignItems = "center";

  const navbar = document.createElement("div");
  navbar.style.width = "100%";
  navbar.style.height = "50px";
  navbar.style.backgroundColor = "#2c3e50";
  navbar.style.display = "flex";
  navbar.style.alignItems = "center";
  navbar.style.justifyContent = "center";
  
  const logoContainer = document.createElement("div");
  logoContainer.style.display = "flex";
  logoContainer.style.alignItems = "center";
  
  // Logo image
  const logo = document.createElement("img");
  logo.src = chrome.runtime.getURL("images/BewereAi_logo_48.png"); // Updated path using chrome.runtime.getURL
  logo.alt = "BewereAI";
  logo.style.height = "30px";  
  
  // Logo text
  const logoText = document.createElement("span");
  logoText.textContent = "BewereAI";
  logoText.style.fontSize = "18px";
  logoText.style.color = "white";
  logoText.style.marginLeft = "10px"; // Space between the logo and text
  logoText.style.fontWeight = "bold";
  
  logoContainer.appendChild(logo);
  logoContainer.appendChild(logoText);
  navbar.appendChild(logoContainer);
  
  popup.appendChild(navbar);

  // Status Message
  const statusMessage = document.createElement("p");
  statusMessage.textContent = "This prompt validates our security policy.";
  statusMessage.style.textAlign = "center";
  statusMessage.style.margin = "10px";
  popup.appendChild(statusMessage);

  // Toggle Button Row
  const toggleContainer = document.createElement("div");
  toggleContainer.style.display = "flex";
  toggleContainer.style.justifyContent = "center";
  toggleContainer.style.gap = "10px";
  toggleContainer.style.width = "100%";
  toggleContainer.style.marginBottom = "10px";

  const originalButton = document.createElement("button");
  originalButton.textContent = "Original Text";
  originalButton.style.padding = "8px 12px";
  originalButton.style.border = "1px solid #3498db";
  originalButton.style.cursor = "pointer";
  originalButton.style.borderRadius = "4px";
  originalButton.style.backgroundColor = "#3498db";
  originalButton.style.color = "white";
  originalButton.style.fontWeight = "bold"; // Default active button

  const redactButton = document.createElement("button");
  redactButton.textContent = "Content Redaction";
  redactButton.style.padding = "8px 12px";
  redactButton.style.border = "1px solid #e67e22";
  redactButton.style.cursor = "pointer";
  redactButton.style.borderRadius = "4px";
  redactButton.style.backgroundColor = "white";
  redactButton.style.color = "#e67e22";
  redactButton.style.fontWeight = "normal";

  // Toggle Functionality
  const updateToggleState = (isOriginalActive) => {
    if (isOriginalActive) {
      originalButton.style.backgroundColor = "#3498db";
      originalButton.style.color = "white";
      originalButton.style.fontWeight = "bold";

      redactButton.style.backgroundColor = "white";
      redactButton.style.color = "#e67e22";
      redactButton.style.fontWeight = "normal";
    } else {
      originalButton.style.backgroundColor = "white";
      originalButton.style.color = "#3498db";
      originalButton.style.fontWeight = "normal";

      redactButton.style.backgroundColor = "#e67e22";
      redactButton.style.color = "white";
      redactButton.style.fontWeight = "bold";
    }
  };

  originalButton.addEventListener("click", () => {
    isOriginalTextActive = true;
    updateToggleState(true);
    restoreOriginalText();
  });

  redactButton.addEventListener("click", () => {
    isOriginalTextActive = false;
    updateToggleState(false);
    redactText();
  });

  toggleContainer.appendChild(originalButton);
  toggleContainer.appendChild(redactButton);
  popup.appendChild(toggleContainer);

  // Prompt Display Area
  const promptDisplay = document.createElement("div");
  promptDisplay.style.width = "90%";
  promptDisplay.style.height = "150px";
  promptDisplay.style.border = "1px solid #ccc";
  promptDisplay.style.margin = "10px";
  promptDisplay.style.padding = "10px";
  promptDisplay.style.overflowY = "auto";
  promptDisplay.style.background = "#f9f9f9";
  promptDisplay.setAttribute("contenteditable", "true");
  popup.appendChild(promptDisplay);

  // Bottom Button Container
  const bottomButtonContainer = document.createElement("div");
  bottomButtonContainer.style.display = "flex";
  bottomButtonContainer.style.justifyContent = "center";
  bottomButtonContainer.style.gap = "15px";
  bottomButtonContainer.style.marginTop = "10px";
  bottomButtonContainer.style.width = "100%";

  // Close Button (on the left)
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.padding = "8px 12px";
  closeButton.style.border = "none";
  closeButton.style.backgroundColor = "red";
  closeButton.style.color = "white";
  closeButton.style.cursor = "pointer";
  closeButton.style.borderRadius = "4px";

  closeButton.addEventListener("click", () => {
    popup.remove();
    popup = null;
  });

  // Force Send Button (on the right)
  const forceSendButton = document.createElement("button");
  forceSendButton.textContent = "Force Send";
  forceSendButton.style.padding = "8px 12px";
  forceSendButton.style.border = "none";
  forceSendButton.style.backgroundColor = "yellow";
  forceSendButton.style.color = "black";
  forceSendButton.style.cursor = "pointer";
  forceSendButton.style.borderRadius = "4px";

  forceSendButton.addEventListener("click", () => {
    forceSendTriggered = true;
    sendMessage();
    popup.remove();
    popup = null;
  });

  bottomButtonContainer.appendChild(closeButton);
  bottomButtonContainer.appendChild(forceSendButton);
  popup.appendChild(bottomButtonContainer);

  document.body.appendChild(popup);
};

// Redact the text based on the violating part from the response
const redactText = () => {
  if (jsonResponse && jsonResponse.violating_prompt_text) {
    const promptDisplay = document.querySelector("#custom-popup div[contenteditable=true]");
    if (promptDisplay) {
      const redactedText = promptDisplay.innerHTML.replace(
        jsonResponse.violating_prompt_text,
        "######"
      );
      promptDisplay.innerHTML = redactedText;
    }
  }
};

const sendMessage = () => {
  if (sendButton) {
    console.log("Force sending the message...");
    sendButton.click();
  }
};

// Restore the original prompt text
const restoreOriginalText = () => {
  const promptDisplay = document.querySelector("#custom-popup div[contenteditable=true]");
  if (promptDisplay && originalPromptText) {
    promptDisplay.innerHTML = originalPromptText;
  }
};


const sendPromptToServer = async (prompt) => {
  try {
    console.log("Sending prompt to server...");

    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Response from server:", data);

    jsonResponse = data; // Store response

    return data; // Return the response if needed elsewhere
  } catch (error) {
    console.error("❌ Error sending prompt to server:", error);
    return null; // Return null if there was an error
  }
};

const sendButtonClickHandler = async (event) => {
  console.log("Send button clicked.");

  if (!forceSendTriggered) {
    event.preventDefault();
    event.stopImmediatePropagation();

    // Capture the text from the prompt input
    const promptTextarea = document.querySelector("#prompt-textarea");
    if (promptTextarea) {
      const promptMessage = promptTextarea.innerText.trim(); // Extract plain text

      if (promptMessage) {
        console.log("Captured Prompt:", promptMessage);
        originalPromptText = promptMessage; // Save original prompt text
        const serverResponse = await sendPromptToServer(promptMessage); // Send prompt to the server and wait for the response

        // If server's answer is true, show the popup
        if (serverResponse && serverResponse.answer === true) {
          createPopup(); // Show the popup
        } else {
          console.log("Prompt is allowed. Sending to ChatGPT.");
          sendMessage(); // Allow request to be sent if answer is false
        }
      } else {
        console.log("No prompt text detected.");
      }
    } else {
      console.log("Prompt textarea not found.");
    }
  }
};

const attachValidation = () => {
  // Find the send button
  const sendButton = document.querySelector('[data-testid="send-button"][aria-label="Send prompt"].flex.bg-black');

  if (sendButton) {
    console.log("Send button found!");
    // Remove previous event listener to prevent duplicates
    sendButton.removeEventListener("click", sendButtonClickHandler);
    // Attach the event listener
    sendButton.addEventListener("click", sendButtonClickHandler);
  } else {
    console.log("Send button not found.");
  }
};

// Call attachValidation initially or whenever the page content changes
attachValidation();

// Optionally, observe changes to the page to re-attach the listener if needed
const observer = new MutationObserver(() => {
  attachValidation();
});
observer.observe(document.body, { childList: true, subtree: true });

