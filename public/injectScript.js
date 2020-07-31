let _godTriggerSmartContract = false;

// to contentScript
const setContract = async (...params) => {
  const _tronWeb = window.tronWeb;
  const BigNumber = _tronWeb.BigNumber;

  const val = params[2].callValue ? BigNumber(params[2].callValue).div(1e6).toString() : 0;
  const tid = params[2].tokenId ? params[2].tokenId : 0;
  let tname = tid;
  let tabbr = '';
  let tval = 0;

  try {
    const token = await _tronWeb.trx.getTokenByID(tid);
    const tPrecision = token.precision ? token.precision : 0;
    tname = token.name ? token.name : tid;
    tabbr = token.abbr ? token.abbr : tname;
    tval = params[2].tokenValue ? BigNumber(params[2].tokenValue).div(BigNumber(10).pow(tPrecision)).toString() : 0;
  } catch (error) {
    // token does not exist
  }

  window.postMessage({
    method: 'setContractValue',
    data: {
      addr: _tronWeb.address.fromHex(params[0]),
      func: params[1],
      args: JSON.stringify(params[3]),
      val,
      tid,
      tname,
      tabbr,
      tval
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
