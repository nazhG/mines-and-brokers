const { ethers } = require("hardhat");

async function main() {
    //npx hardhat run --network binance_testnet scripts/deployStaking.js
    const Staking = await ethers.getContractFactory("Staking");
    const Token = await ethers.getContractFactory("SMART");
    
		token = await Token.deploy(
      (await ethers.getSigners())[0].address,
      ethers.utils.parseUnits("1000", 18),
      "BHM", 
      "BHM",
      50,
      (await ethers.getSigners())[1].address,
      (await ethers.getSigners())[1].address,
    );
    
		staking = await Staking.deploy(
      ethers.utils.parseUnits("1000", 18),
      token.address,
      "LP TOKEN",
      "LP",
    );

    console.log("token deployed to:", token.address);
    console.log("staking deployed to:", staking.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// bridge deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
