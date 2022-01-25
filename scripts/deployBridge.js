const { ethers } = require("hardhat");

async function main() {
    //npx hardhat run --network rinkeby scripts/deployBridge.js
    const Bridge = await ethers.getContractFactory("Bridge");
    
		bridge = await Bridge.deploy(
      "0x5044531067a7605E68CE01b436837414e5623eEe", 
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
    
// bridge deployed to: 0xB9DF37d2Aa3a706C1087Ec52a6c88a0501934e11
