const { ethers } = require("hardhat");

async function main() {
    //npx hardhat run --network rinkeby scripts/deployBridgeIn.js
    const Bridge = await ethers.getContractFactory("BridgeIn");
    
		bridge = await Bridge.deploy(
      "0x78Eb54810EB97e38A716c069021Df90be6aC68C5"
    );

    console.log("bridge deployed to:", bridge.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// bridge deployed to: 0xDdf8DA085Ed542eD1bc8A32411f1B26C0031623E
