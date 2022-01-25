const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const BridgeJson = require('../artifacts/contracts/Bridge.sol/Bridge.json');
const BHFJson = require('../artifacts/contracts/BHF.sol/BHF.json');
const BHMJson = require('../artifacts/contracts/BHM.sol/BHM.json');
const address = '0x5044531067a7605E68CE01b436837414e5623eEe';
const BridgeAddress = '0xB9DF37d2Aa3a706C1087Ec52a6c88a0501934e11';
const privateKey = '85e8b9d349d7234cb33dcd81a1d2f0b9cf0a9c24b66691a4d582095f2dc500f4';

const init3 = async () => {
  const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/13322d87cfd54c9a880aad0ff59a507c'); 
  const web3 = new Web3(provider);
  const Bridge = new web3.eth.Contract(
    BridgeJson.abi,
    BridgeAddress
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

  console.log('manager: ');
  console.log(await Bridge.methods.manager().call());
  console.log('balance ETH: ');
  console.log(await BHF.methods.balanceOf(address).call());
  console.log('minting');
  await BHF.methods.mint(address, web3.utils.toWei('1', 'ether')).send({ from: address });
  console.log('balance: ');
  console.log(await BHF.methods.balanceOf(address).call());
  console.log('dando aprobación');
  await BHF.methods.approve(BridgeAddress, web3.utils.toWei('1', 'ether')).send({ from: address });
  console.log('quemando el token en el bridge');
  await Bridge.methods.burn(address, web3.utils.toWei('1', 'ether')).send({ from: address });
  console.log('balance del puente');
  let balance = await Bridge.methods.balance(address).call();
  console.log(balance);


  console.log('balance BSC:');
  console.log(await BHM.methods.balanceOf(address).call());
  await BHM.methods.claim(address, balance).send({ from: address });
  
  console.log(await BHM.methods.balanceOf(address).call());
  
}

init3();