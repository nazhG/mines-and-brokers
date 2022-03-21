/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-truffle5");
require('@openzeppelin/hardhat-upgrades');
require("hardhat-gas-reporter");

module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      hardhat: {
        forking: {
          url: "https://bsc-dataseed.binance.org/",
          blockNumber: 13487764,
        },
      }
    },
    binance_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: {mnemonic: process.env.MNEMONIC}
    },
    binance_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: {mnemonic: process.env.MNEMONIC}
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/13322d87cfd54c9a880aad0ff59a507c",
      chainID: 4,
      accounts: {mnemonic: process.env.MNEMONIC}
    }
  },
  gasReporter: {
    enabled: true,
    gasPriceApi: "https://api.bscscan.com/api?module=proxy&action=eth_gasPrice&apikey=54Q4N4P6RR9B3FC2ABXB6U455HI1HSGRH8",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 240000,
  },
};
