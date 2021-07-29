const hre = require("hardhat");
const CONFIG = require("../project.config.js");
const fs = require('fs');


async function main() {

    const  [deployer, addr1, addr2] = await hre.ethers.getSigners();

    const NCTContract = await hre.ethers.getContractFactory("NameChangeToken");
    const nct = await NCTContract.deploy(CONFIG.NCT_NAME, CONFIG.NCT_SYMBOL);

    await nct.deployed();

    const NFTContract = await hre.ethers.getContractFactory("ERC721");
    const nft = await NFTContract.deploy(CONFIG.NFT_NAME, CONFIG.NFT_SYMBOL, nct.address);
    
    await nft.deployed();

    tx = await nct.setNFTAddress(nft.address);
    await tx.wait();

    const MetaDataContract = await hre.ethers.getContractFactory("MetadataStore");
    const metadata = await MetaDataContract.deploy(nft.address, CONFIG.BASE_URI_PREFIX, CONFIG.BASE_URI_SUFFIX);
  
    await metadata.deployed();

    deploymentDetais = {
        "NFTContract" : nft.address,
        "NCTContract" : nct.address,
        "MetaDataContract": metadata.address,
    };


   if (CONFIG.VERIFY_CONTRACT) {
        await hre.run("verify:verify", {
            address: nft.address,
            constructorArguments: [CONFIG.NFT_NAME, CONFIG.NFT_SYMBOL, nct.address],
        });

        await hre.run("verify:verify", {
            address: nct.address,
            constructorArguments: [CONFIG.NCT_NAME, CONFIG.NCT_SYMBOL],
        });

        await hre.run("verify:verify", {
            address: metadata.address,
            constructorArguments: [nft.address, CONFIG.BASE_URI_PREFIX, CONFIG.BASE_URI_SUFFIX],
        });

    }

    fs.writeFileSync("./deployment.txt", JSON.stringify(deploymentDetais , null, 4), function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Addresses available at deployment.txt");
        }
    });

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
   