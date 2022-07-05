const { ethers } = require("hardhat");

async function main() {
    
    const Token = await ethers.getContractFactory("SMART");
    const Bridge = await ethers.getContractFactory("BridgeOut");
    
		token = await Token.deploy(
      (await ethers.getSigners())[0].address,
      ethers.utils.parseUnits("1000", 18),
      "BHM", 
      "BHM",
      50,
      (await ethers.getSigners())[1].address,
      (await ethers.getSigners())[1].address,
    );

    bridge = await Bridge.deploy(
      "0x5044531067a7605E68CE01b436837414e5623eEe", 
      "0xd312f18554Ff14e14f40F7705aa3751d7336FC38",
      1000000000
    );

    console.log("bridge deployed to:", bridge.address);

    console.log("token deployed to:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// bridge deployed to: 0x089f868E362419d09FB42e66C20c0327ea7e63bE
// token deployed to: 0x24112b91DC7d3AE9D456870b298F6FC240F3acD5
// npx hardhat run --network binance_testnet scripts/deployBSC.js