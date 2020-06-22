let _godTriggerSmartContract = false;

// to contentScript
const setContract = (...params) => {
  window.postMessage({
    method: 'setContractValue',
    data: {
      addr: window.tronWeb.address.fromHex(params[0]),
      func: params[1],
      args: JSON.stringify(params[3])
    }
  });
};

const setGodMode = godMode => {
  const timer = setInterval(() => {
    if (window.tronWeb && window.tronWeb.ready) {
      clearInterval(timer);

      const _tronWeb = window.tronWeb;
      if (godMode) {
        _godTriggerSmartContract = _tronWeb.transactionBuilder.triggerSmartContract;
        _tronWeb.transactionBuilder.triggerSmartContract = (...params) => {
          if (typeof params[2] !== 'object') {
            params[2] = {
              feeLimit: params[2],
              callValue: params[3]
            };
            params.splice(3, 1);
          }

          const cb = params[params.length - 1];
          if (_tronWeb.utils.isFunction(cb)) {
            params[params.length - 1] = (err, res) => {
              if (!res.constant_result) {
                setContract(...params);
              }
              cb(err, res);
            };

            return _tronWeb.transactionBuilder._triggerSmartContract(...params);
          } else {
            return new Promise(async (resolve, reject) => {
              try {
                const res = await _tronWeb.transactionBuilder._triggerSmartContract(...params);
                if (!res.constant_result) {
                  setContract(...params);
                }
                resolve(res);
              } catch (error) {
                reject(error);
              }
            });
          }
        };
      } else {
        if (_godTriggerSmartContract) {
          window.tronWeb.transactionBuilder.triggerSmartContract = _godTriggerSmartContract;
        }
      }
    }
  }, 3000);
};

const init = () => {
  console.log('TRON GOD MODE INJECT');

  // from contentScript
  window.addEventListener('message', event => {
    const data = event.data;
    if (data) {
      switch (data.method) {
        case 'setGodModeValue':
          const godMode = data.data.value;
          console.log(`TRON GOD MODE SET: ${godMode}`);
          setGodMode(godMode);
          break;
        default:
          break;
      }
    }
  });
};

init();

/*
// constant
await this.tronWeb.transactionBuilder.triggerSmartContract(
  'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  'name()',
  {},
  []
);

this.tronWeb.transactionBuilder.triggerSmartContract(
  'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  'name()',
  {},
  [],
  (err, res)=>{console.log(err, res)}
);

// non-constant
await this.tronWeb.transactionBuilder.triggerSmartContract(
  'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  'pause()',
  {},
  []
);

this.tronWeb.transactionBuilder.triggerSmartContract(
  'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  'pause()',
  {},
  [],
  (err, res)=>{console.log(err, res)}
);
*/
