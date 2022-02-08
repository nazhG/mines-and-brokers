const { ethers } = require("hardhat");

async function main() {
    //npx hardhat run --network binance_testnet scripts/deployBridgeOut.js
    const Bridge = await ethers.getContractFactory("BridgeOut");
    
		bridge = await Bridge.deploy(
      "0x5044531067a7605E68CE01b436837414e5623eEe", 
      "0xd312f18554Ff14e14f40F7705aa3751d7336FC38",
      1000000000
    );

    console.log("bridge deployed to:", bridge.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// bridge deployed to: 0x44fDBC0AA0538F740eDF8244cc429503BEee58d1
