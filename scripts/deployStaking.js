const { ethers } = require("hardhat");

async function main() {
    //npx hardhat run --network binance_testnet scripts/deployStaking.js
    const Staking = await ethers.getContractFactory("Staking");
    
		staking = await Staking.deploy(
      ethers.utils.parseUnits("1000", 18),
      "0xd312f18554Ff14e14f40F7705aa3751d7336FC38",
      "LP TOKEN",
      "LP",
    );

    console.log("staking deployed to:", staking.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// bridge deployed to: 0x2b1Bac591B47CD5f3FE194fDC41d5Ee4945e6C49
