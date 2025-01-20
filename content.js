console.log("Content script has been injected into chat.openai.com.");

if (window.location.hostname === "chat.openai.com") {
  console.log("We are on the correct domain (chat.openai.com).");
}

let sendButton = null;
let popup = null;
let forceSendTriggered = false;

const createPopup = () => {
  if (popup) return;

  popup = document.createElement("div");
  popup.id = "custom-popup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  popup.style.color = "white";
  popup.style.padding = "20px";
  popup.style.borderRadius = "8px";
  popup.style.fontSize = "16px";
  popup.style.zIndex = "9999";
  popup.style.textAlign = "center";
  popup.style.maxWidth = "350px";
  popup.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.5)";
  popup.style.display = "flex";
  popup.style.alignItems = "flex-start";
  popup.style.gap = "15px";

  const logo = document.createElement("img");
  logo.src = chrome.runtime.getURL("images/BewereAi_logo_48.png");
  logo.style.width = "48px";
  logo.style.height = "48px";
  logo.style.flexShrink = "0";
  logo.style.marginTop = "0";
  logo.style.marginLeft = "0";
  popup.appendChild(logo);

  const content = document.createElement("div");
  content.style.flex = "1";
  content.style.marginLeft = "10px";

  const message = document.createElement("p");
  message.textContent = "This action is blocked for security reasons.";
  message.style.margin = "0 0 15px";
  content.appendChild(message);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.gap = "10px";

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.padding = "10px 15px";
  closeButton.style.border = "none";
  closeButton.style.backgroundColor = "red";
  closeButton.style.color = "white";
  closeButton.style.cursor = "pointer";
  closeButton.style.borderRadius = "4px";

  closeButton.addEventListener("click", () => {
    popup.remove();
    popup = null;
  });

  const forceButton = document.createElement("button");
  forceButton.textContent = "Force Send";
  forceButton.style.padding = "10px 15px";
  forceButton.style.border = "none";
  forceButton.style.backgroundColor = "yellow";
  forceButton.style.color = "black";
  forceButton.style.cursor = "pointer";
  forceButton.style.borderRadius = "4px";

  forceButton.addEventListener("click", () => {
    popup.remove();
    popup = null;

    forceSendTriggered = true;
    sendMessage();
  });

  buttonContainer.appendChild(closeButton);
  buttonContainer.appendChild(forceButton);
  content.appendChild(buttonContainer);
  popup.appendChild(content);

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
