const { ethers } = require("hardhat");

async function main() {
    
    const Token = await ethers.getContractFactory("BHF");
    
		token = await Token.deploy(
      "BHM", 
      "BHM",
      (await ethers.getSigners())[0].address,
      ethers.utils.parseUnits("1000", 18),
    );

    const Bridge = await ethers.getContractFactory("BridgeIn");
    
		bridge = await Bridge.deploy(
      token.address
    );

    console.log("token deployed to:", token.address);
    console.log("bridge deployed to:", bridge.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// token deployed to: 0xA80a996007C89802A381A62c7a454166400975B4
// npx hardhat run --network rinkeby scripts/deployBSC.js