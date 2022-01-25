const { ethers } = require("hardhat");

async function main() {
    //npx hardhat run --network rinkeby scripts/deployETH.js
    const Token = await ethers.getContractFactory("BHF");
    
		token = await Token.deploy(
      "BHF", 
      "BHF"
    );

    console.log("token deployed to:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
    
// token deployed to: 0x78Eb54810EB97e38A716c069021Df90be6aC68C5
// npx hardhat run --network rinkeby scripts/deployETH.js
