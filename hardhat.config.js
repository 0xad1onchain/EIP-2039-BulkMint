require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const { task } = require("hardhat/config");
const CONFIG = require("./project.config.js");
const mintNFTs = require("./scripts/minttokens.js");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("mintNFT", "Mints the number of NFTs passed in path")
  .addParam("quantity", "The quantity to mint")
  .addParam("nftdirectory", "Path to folder containing NFTs, File name should be indexed by 0")
  .setAction(async (taskArgs, hre) => {

    await mintNFTs.mintNFTs(taskArgs, hre);
    console.log("NFT Minting Complete");

  });


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.6",

  etherscan: {
    apiKey: CONFIG.ETHERSCAN_API_KEY,
  },

  networks : {
    hardhat: {
      forking: {
        url: CONFIG.HOMESTEAD_URL,
        blockNumber: 12735450,
        blockGasLimit: 2600000,
      }
    },
  
    rinkeby: {
      url: CONFIG.RINKEBY_URL,
      accounts: {
        mnemonic: CONFIG.ACCOUNT_NEMONIC,
      }

    }
  },

};
