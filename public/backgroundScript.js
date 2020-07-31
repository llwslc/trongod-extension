console.log('Tron God Mode Background Script');

const godModeKey = 'godMode';
const contractKey = 'contract';

const getValue = (key, cb) => {
  chrome.storage.local.get([key], res => {
    cb(res[key]);
  });
};

const setValue = (key, value, cb) => {
  chrome.storage.local.set({ [key]: value }, () => {
    cb();
  });
};

const addListener = () => {
  // from contentScript
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req) {
      switch (req.method) {
        case 'getGodModeValue':
          getValue(godModeKey, d => {
            sendResponse(d);
          });
          break;
        case 'setContractValue':
          const data = req.data ? req.data : {};
          setValue(contractKey, JSON.stringify(data), () => {});

          chrome.windows.getLastFocused({ populate: false }, currentWindow => {
            chrome.windows.create(
              {
                url: './build/index.html#popup',
                type: 'popup',
                width: 360,
                height: 600,
                left: currentWindow.width - 25 - 360,
                top: 25
              },
              () => {}
            );
          });

          sendResponse(true);
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
};

// to contentScript
const sendToTabs = message => {
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message, () => {});
    });
  });
};

const getWidth = message => {
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message, () => {});
    });
  });
};

// from popup
function getGodModeValue(cb) {
  getValue(godModeKey, cb);
}

function setGodModeValue(value, cb) {
  setValue(godModeKey, value, cb);
  sendToTabs({ method: 'setGodModeValue', data: { value } });
}

function getContractValue(cb) {
  getValue(contractKey, data => {
    cb(data ? JSON.parse(data) : {});
  });
}

addListener();
