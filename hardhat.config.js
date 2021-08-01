require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");


const { task } = require("hardhat/config");
const CONFIG = require("./project.config.js");
const mintNFTs = require("./scripts/mintTokens.js");
const listNFTs = require("./scripts/listTokens.js");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("mintNFT", "Mints the number of NFTs passed in path")
  .addParam("quantity", "The quantity to mint")
  .addParam("nftdirectory", "Absolute Path to folder containing NFTs, File name should be indexed by 0")
  .setAction(async (taskArgs, hre) => {

    await mintNFTs.minter(taskArgs, hre);
    console.log("NFT Minting Complete");

});

task("listNFT", "Lists NFTs for sale")
  .addParam("pricelist", "Absolute file path containing the pricelist in JSON for tokenIDs to  list")
  .setAction(async (taskArgs, hre) => {

    await listNFTs.list(taskArgs, hre, web3);
    console.log("NFT Listing Complete");

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
    homestead: {
      url: CONFIG.HOMESTEAD_URL,
      accounts: {
        mnemonic: CONFIG.ACCOUNT_NEMONIC,
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
