const { ethers } = require("hardhat");

async function main() {
    
    const Token = await ethers.getContractFactory("BHM");
    
		token = await Token.deploy(
      "BHM", 
      "BHM",
      '0x5044531067a7605E68CE01b436837414e5623eEe'
    );

    console.log("token deployed to:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// token deployed to: 0xd312f18554Ff14e14f40F7705aa3751d7336FC38
// npx hardhat run --network binance_testnet scripts/deployBSC.js