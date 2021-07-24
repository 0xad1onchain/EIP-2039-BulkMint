// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const {exec} = require("child_process");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const arg1 = "Neo Petters"
  const arg2 = "NPTS"
  

  const  [deployer, addr1, addr2] = await hre.ethers.getSigners();

  const NCTContract = await hre.ethers.getContractFactory("NameChangeToken");
  const nct = await NCTContract.deploy("NameChangeToken", "NCT");

  const NFTContract = await hre.ethers.getContractFactory("ERC721");
  const nft = await NFTContract.deploy(arg1, arg2, nct.address);


  
  await nft.deployed();
  const cmdStr = "npx hardhat verify --network rinkeby "+nft.address+" \""+arg1+"\" \""+arg2+"\" " + "\"" + nct.address + "\"";
  console.log(cmdStr);
  

  console.log("NFT deployed to:", nft.address);

/*

  let tx;
  let receipt;
  tx = await nft.mintBulk(400);
  receipt = await tx.wait();
  console.log("After mintBulk ");
  console.log((await nft.totalSupply()).toString());
  tx = await nft.mint(deployer.address, 400);
  receipt = await tx.wait();
  console.log("After SingleMint ");
  tx = await nft.connect(deployer).transferFrom(deployer.address, addr1.address, 5);
  receipt = await tx.wait();
  console.log("After transfering token 5");
  tx = await nft.connect(deployer).transferFrom(deployer.address, addr1.address, 6);
  receipt = await tx.wait();
  console.log("After transferring token 6 ");
*/

  // tx = await nft.connect(deployer).setTokenURI(0, utils.arrayify("0x516d5248725047765339346b723251435976766946435641674b6f5133784d4267784e3533644d397a5869473939"));
  // receipt = await tx.wait();

  // tx = await nft.connect(deployer).tokenURI(0);
  // console.log("\n\n\n");
  // console.log(tx);
  //receipt = await tx.wait();

  exec(cmdStr, (err, stdout, stderr) => {
    if (err){
      console.log(`error: ${err.message}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log("Logging Path");
    console.log(`stdout: ${stdout}`);
  })



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
   