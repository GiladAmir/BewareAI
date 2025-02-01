document.addEventListener("DOMContentLoaded", () => {
    const originalTextBtn = document.getElementById("original-text-btn");
    const redactionTextBtn = document.getElementById("text-redaction-btn");
    const promptText = document.getElementById("prompt-text");
    const closeBtn = document.getElementById("close-btn");
    const forceSendBtn = document.getElementById("force-send-btn");

    let originalPrompt = "Sample prompt text goes here...";
    let redactedPrompt = "[REDACTED]";

    // Toggle active button state
    function toggleButtons(activeButton, inactiveButton, text) {
        activeButton.classList.add("active");
        inactiveButton.classList.remove("active");
        promptText.value = text;
    }

    originalTextBtn.addEventListener("click", () => {
        toggleButtons(originalTextBtn, redactionTextBtn, originalPrompt);
    });

    redactionTextBtn.addEventListener("click", () => {
        toggleButtons(redactionTextBtn, originalTextBtn, redactedPrompt);
    });

    // Close Popup
    closeBtn.addEventListener("click", () => {
        window.close();
    });

    // Force Send (Functionality will be handled later)
    forceSendBtn.addEventListener("click", () => {
        alert("Force Send Clicked - Implement logic here!");
    });
});
