console.log('Tron God Mode Background Script');

const godModeKey = 'godMode';
const addrKey = 'addr';
const funcKey = 'func';
const argsKey = 'args';

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
          setValue(addrKey, data.addr ? data.addr : '', () => {});
          setValue(funcKey, data.func ? data.func : '', () => {});
          setValue(argsKey, data.args ? data.args : '', () => {});

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
  getValue(addrKey, addr => {
    getValue(funcKey, func => {
      getValue(argsKey, args => {
        cb({
          addr,
          func,
          args
        });
      });
    });
  });
}

addListener();
