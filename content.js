console.log("Content script has been injected into chat.openai.com.");

if (window.location.hostname === "chat.openai.com") {
  console.log("We are on the correct domain (chat.openai.com).");
}

let sendButton = null;
let popup = null;
let forceSendTriggered = false;
let isOriginalTextActive = true; // Default state: "Original Text" is selected

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

  // Navbar with Logo
  const navbar = document.createElement("div");
  navbar.style.width = "100%";
  navbar.style.height = "50px";
  navbar.style.backgroundColor = "#2c3e50";
  navbar.style.display = "flex";
  navbar.style.alignItems = "center";
  navbar.style.justifyContent = "center";

  const logo = document.createElement("img");
  logo.src = "./images/BewereAi_logo_48.png"; // Replace with actual logo URL
  logo.alt = "Company Logo";
  logo.style.height = "30px";

  navbar.appendChild(logo);
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
  });

  redactButton.addEventListener("click", () => {
    isOriginalTextActive = false;
    updateToggleState(false);
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
  forceSendButton.style.backgroundColor = "#2ecc71";
  forceSendButton.style.color = "white";
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

const attachValidation = () => {
  sendButton = document.querySelector('[data-testid="send-button"][aria-label="Send prompt"].flex.bg-black');

  if (sendButton) {
    console.log("Send button found!");
    sendButton.removeEventListener("click", sendButtonClickHandler);
    sendButton.addEventListener("click", sendButtonClickHandler);
  } else {
    console.log("Send button not found.");
  }
};

const sendButtonClickHandler = (event) => {
  console.log("Send button clicked.");
  
  if (!forceSendTriggered) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!popup) {
      createPopup();
    }
  } else {
    forceSendTriggered = false;
  }
};

const sendMessage = () => {
  if (sendButton) {
    console.log("Force sending the message...");
    sendButton.click();
  }
};

const observer = new MutationObserver(() => {
  console.log("MutationObserver triggered.");
  attachValidation();
});

observer.observe(document.body, { childList: true, subtree: true });
