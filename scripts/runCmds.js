// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
//const {ethers} = require("hardhat");


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
const  [deployer, addr1, addr2] = await hre.ethers.getSigners();
  const deployedAddress = "0x840128Aa339c1A5a48910B787b596247cDB63D92";
  const NFTContract = await hre.ethers.getContractAt("ERC721", deployedAddress);
  

  // await nft.deployed();

  // console.log("NFT deployed to:", nft.address);
  await NFTContract.mintBulk(100);
  await NFTContract.mint(100);
  await NFTContract.connect(deployer).transferFrom(deployer.address, addr1.address, 5);
  await NFTContract.connect(deployer).transferFrom(deployer.address, addr1.address, 6);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
   