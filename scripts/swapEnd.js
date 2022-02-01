const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const BridgeJsonIn = require('../artifacts/contracts/BridgeIn.sol/BridgeIn.json');
const BridgeJsonOut = require('../artifacts/contracts/BridgeOut.sol/BridgeOut.json');
const BHFJson = require('../artifacts/contracts/BHF.sol/BHF.json');
const BHMJson = require('../artifacts/contracts/BHM.sol/BHM.json');
const address = '0x5044531067a7605E68CE01b436837414e5623eEe';
const BridgeAddressIn = '0xDdf8DA085Ed542eD1bc8A32411f1B26C0031623E';
const BridgeAddressOut = '0xe61C78556Eb753DF4723dd2e5c7538ad97cfcFeE';
const privateKey = '85e8b9d349d7234cb33dcd81a1d2f0b9cf0a9c24b66691a4d582095f2dc500f4';

const init3 = async () => {
  const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/13322d87cfd54c9a880aad0ff59a507c'); 
  const web3 = new Web3(provider);
  const BridgeIn = new web3.eth.Contract(
    BridgeJsonIn.abi,
    BridgeAddressIn
  );
  const BHF = new web3.eth.Contract(
    BHFJson.abi,
    '0x78Eb54810EB97e38A716c069021Df90be6aC68C5'
  );
  
  const providerBSC = new Provider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545/'); 
  const web3BSC = new Web3(providerBSC);
  const BHM = new web3BSC.eth.Contract(
    BHMJson.abi,
    '0xd312f18554Ff14e14f40F7705aa3751d7336FC38'
  );
  
  const BridgeOut = new web3BSC.eth.Contract(
    BridgeJsonOut.abi,
    BridgeAddressOut
  );

  console.log('balance del puente');
  let balance = await BridgeIn.methods.balance(address).call();
  console.log(balance);
  

  console.log('balance BSC:');
  console.log(await BHM.methods.balanceOf(address).call());
  await BHM.methods.approve(BridgeAddressOut, web3BSC.utils.toWei('1', 'ether')).send({ from: address });
  await BridgeOut.methods.claimRequest(address).send({ from: address, value: 1000000000 });
  await BridgeOut.methods.claim(address, balance).send({ from: address });
  
  console.log(await BHM.methods.balanceOf(address).call());
  console.log("end");
}

init3();