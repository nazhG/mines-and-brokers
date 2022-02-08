const { ethers } = require("hardhat");

async function main() {
    
    const Token = await ethers.getContractFactory("BHM");
    
		token = await Token.deploy(
      '0x5044531067a7605E68CE01b436837414e5623eEe',
      ethers.utils.parseUnits("1000", 18),
      "BHM", 
      "BHM",
    );

    console.log("token deployed to:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// token deployed to: 0xA80a996007C89802A381A62c7a454166400975B4
// npx hardhat run --network binance_testnet scripts/deployBSC.js