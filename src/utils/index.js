export const getGodModeValue = cb => {
  if (window.chrome && window.chrome.extension) {
    window.chrome.extension.getBackgroundPage().getGodModeValue(cb);
  } else {
    cb(false);
  }
};

export const setGodModeValue = (value, cb) => {
  if (window.chrome && window.chrome.extension) {
    window.chrome.extension.getBackgroundPage().setGodModeValue(value, cb);
  } else {
    cb(false);
  }
};

export const getContractValue = cb => {
  if (window.chrome && window.chrome.extension) {
    window.chrome.extension.getBackgroundPage().getContractValue(cb);
  } else {
    cb({});
  }
};
