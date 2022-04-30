const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const BridgeJsonIn = require('../artifacts/contracts/BridgeIn.sol/BridgeIn.json');
const BridgeJsonOut = require('../artifacts/contracts/BridgeOut.sol/BridgeOut.json');
const BHFJson = require('../artifacts/contracts/BHF.sol/BHF.json');
const BHMJson = require('../artifacts/contracts/SMART.sol/SMART.json');
const address = '0x5044531067a7605E68CE01b436837414e5623eEe';
const BridgeAddressIn = '0xA5ef453DED8909C19E0b3fd8BE69C534cf17E276';
const BridgeAddressOut = '0x1147d7213C74657D79599305e8633e7127731601';
const privateKey = '85e8b9d349d7234cb33dcd81a1d2f0b9cf0a9c24b66691a4d582095f2dc500f4';

/** $ npx hardhat run --network binance_testnet scripts/deployBSC.js && 
bridge deployed to: 0x1147d7213C74657D79599305e8633e7127731601
token deployed to: 0xC2e8c3fAf7a9663Bd843B51bec34B52973e9e5B1
npx hardhat run --network rinkeby scripts/deployBSC.js
bridge deployed to: 0xA5ef453DED8909C19E0b3fd8BE69C534cf17E276
token deployed to: 0xFA8302a2Df0053B0f1f4E6Adea5c911E5AC70Cdb */

const init3 = async () => {
  const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/13322d87cfd54c9a880aad0ff59a507c'); 
  const web3 = new Web3(provider);
  const BridgeIn = new web3.eth.Contract(
    BridgeJsonIn.abi,
    BridgeAddressIn
  );

  const providerBSC = new Provider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545/'); 
  const web3BSC = new Web3(providerBSC);
  const BHM = new web3BSC.eth.Contract(
    BHMJson.abi,
    '0xf846335417d41311935e3cbC8ebdBB563cCf0676'
  );
  
  const BridgeOut = new web3BSC.eth.Contract(
    BridgeJsonOut.abi,
    BridgeAddressOut
  );
  
  let i = Number(await BridgeOut.methods.getAccountsCount().call());
  if (i>0)
    for (let index = i-1; index <= 0; index--) {
      let add = await BridgeOut.methods.accounts(index).call();
      
      console.log('balance ETH: ');
      let balanceIN = await BridgeIn.methods.balance(address).call();
      console.log(balanceIN);
      
      console.log('balance BSC: ');
      let balanceOUT = await BridgeOut.methods.balance(address).call();
      console.log(balanceOUT);

      if (balanceIN > balanceOUT) {
        await BridgeOut.methods.claim(
          add, 
          balanceOUT - balanceIN).send({ from: address }
        );
      }
    }
  
  process.exit()
}

init3();