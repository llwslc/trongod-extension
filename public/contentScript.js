let _godTriggerSmartContract = () => {};

const init = () => {
  // to backgroundScript
  chrome.runtime.sendMessage(
    {
      method: 'getGodModeValue',
      data: ''
    },
    d => {
      setGodMode(d);
    }
  );

  // from backgroundScript
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req) {
      switch (req.method) {
        case 'setGodModeValue':
          const godMode = req.data.value;
          sendResponse(true);
          setGodMode(godMode);
          break;
        default:
          sendResponse(true);
          break;
      }
    } else {
      sendResponse(true);
    }

    return true;
  });

  // from injectScript
  window.addEventListener('message', event => {
    const data = event.data;
    if (data) {
      switch (data.method) {
        case 'setContractValue':
          setContract(data.data);
          break;
        default:
          break;
      }
    }
  });
};

// to injectScript
const setGodMode = godMode => {
  window.postMessage({ method: 'setGodModeValue', data: { value: godMode } });
};

// to backgroundScript
const setContract = data => {
  chrome.runtime.sendMessage(
    {
      method: 'setContractValue',
      data
    },
    () => {}
  );
};

const injectScript = jsPath => {
  const temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = () => {
    temp.parentNode.removeChild(temp);
    init();
  };
  document.head.appendChild(temp);
};

injectScript('build/injectScript.js');
