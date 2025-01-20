console.log("Content script has been injected into chat.openai.com.");

if (window.location.hostname === "chat.openai.com") {
  console.log("We are on the correct domain (chat.openai.com).");
}

const createPopup = () => {
  const popup = document.createElement('div');
  popup.id = 'custom-popup';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.color = 'white';
  popup.style.padding = '20px';
  popup.style.borderRadius = '8px';
  popup.style.fontSize = '16px';
  popup.style.zIndex = '9999';
  popup.style.textAlign = 'center';
  popup.style.maxWidth = '300px';
  popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.3)';

  const message = document.createElement('p');
  message.textContent = "This action is blocked for security reasons.";
  popup.appendChild(message);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '10px';
  closeButton.style.padding = '10px';
  closeButton.style.border = 'none';
  closeButton.style.backgroundColor = 'red';
  closeButton.style.color = 'white';
  closeButton.style.cursor = 'pointer';

  closeButton.addEventListener('click', () => {
    popup.remove();
  });

  popup.appendChild(closeButton);

  document.body.appendChild(popup);
};

const observer = new MutationObserver(() => {
  console.log("MutationObserver triggered.");
  const sendButton = document.querySelector('[data-testid="send-button"][aria-label="Send prompt"].flex.bg-black');
  
  if (sendButton) {
    console.log("Send button found!");
    sendButton.addEventListener("click", (event) => {
      console.log("Send button clicked.");
      createPopup();
      event.stopImmediatePropagation();
      event.preventDefault();
    });
  } else {
    console.log("Send button not found.");
  }
});

observer.observe(document.body, { childList: true, subtree: true });
