chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: [1],
        addRules: [
          {
            id: 1,
            priority: 1,
            action: {
              type: "block"
            },
            condition: {
              urlFilter: "*://chat.openai.com/*",
              resourceTypes: ["xmlhttprequest", "sub_frame"]
            }
          }
        ]
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to update rules:", chrome.runtime.lastError);
        } else {
          console.log("Blocking rules successfully added.");
        }
      }
    );
  });
  