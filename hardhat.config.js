require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("dotenv").config();

GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ''
PRIVATE_KEY = process.env.PRIVATE_KEY || ''
ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.0" }, { version: "0.8.17" }]
  },
  defaultNetwork: 'hardhat',
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      chainId: 5,
      accounts: [PRIVATE_KEY],
      blockConfirmations: 6
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
  mocha: {
    timeout: 500000,
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    noColors: true,
    token: 'ETH',
    coinmarketcap: COINMARKETCAP_API_KEY,
    outputFile: 'gas-report.txt'
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
};
