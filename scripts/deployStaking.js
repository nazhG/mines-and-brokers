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
    
// bridge deployed to: 0xe82e2c3Ffc166FC80257c98B20BB87392Eb6116D
