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
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  popup.style.color = "white";
  popup.style.padding = "20px";
  popup.style.borderRadius = "8px";
  popup.style.fontSize = "16px";
  popup.style.zIndex = "9999";
  popup.style.textAlign = "center";
  popup.style.maxWidth = "300px";
  popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";

  const message = document.createElement("p");
  message.textContent = "This action is blocked for security reasons.";
  popup.appendChild(message);

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.marginTop = "10px";
  closeButton.style.padding = "10px";
  closeButton.style.border = "none";
  closeButton.style.backgroundColor = "red";
  closeButton.style.color = "white";
  closeButton.style.cursor = "pointer";

  closeButton.addEventListener("click", () => {
    popup.remove();
    popup = null;
  });

  popup.appendChild(closeButton);

  const forceButton = document.createElement("button");
  forceButton.textContent = "Force Send";
  forceButton.style.marginTop = "10px";
  forceButton.style.marginLeft = "10px";
  forceButton.style.padding = "10px";
  forceButton.style.border = "none";
  forceButton.style.backgroundColor = "green";
  forceButton.style.color = "white";
  forceButton.style.cursor = "pointer";

  forceButton.addEventListener("click", () => {
    popup.remove();
    popup = null;

    forceSendTriggered = true;
    sendMessage();
  });

  popup.appendChild(forceButton);

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
