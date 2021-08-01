const CONFIG = require("../project.config.js");
const path = require('path');
const fs = require('fs');
const uploadNFt = require("./upload.js");


async function uploadFiles(taskArgs, hre) {
   
    qty = parseInt(taskArgs.quantity);

    directorypath = (taskArgs.nftdirectory).toString();
    
    const  [deployer] = await hre.ethers.getSigners();

    deployments = JSON.parse(fs.readFileSync("deployment.txt", 'utf8'));
    nftcontract = deployments.NFTContract;
    metadatacontract = deployments.MetaDataContract;
    nftcontract = nftcontract.toString();
    metadatacontract = metadatacontract.toString();
    
    console.log("Found NFT Contract at", nftcontract);
    console.log("Found Meta Data Contract at", metadatacontract);

    if(directorypath.slice(-1) != "/")
        directorypath = directorypath + "/";

    NFTContract = await hre.ethers.getContractAt("ERC721" , nftcontract);

    MetaDataContract = await hre.ethers.getContractAt("MetadataStore", metadatacontract);

    totalSupply = await NFTContract.connect(deployer).totalSupply();
    totalSupply = parseInt(totalSupply);

    console.log("Current Total Supply is ", totalSupply.toString());

    begin = totalSupply;
    end = totalSupply + qty;
    console.log("Validating ASSET from id", begin , "to", end -1);

    for (i = begin; i < end; i++) {

        filepath = directorypath + CONFIG.NFT_FILE_PREFIX + i.toString() + CONFIG.NFT_FILE_SUFFIX;
        if (!fs.existsSync(filepath)) {
            console.log("ERROR NFT FILE DOES NOT EXIST FOR INDEX", i);
            console.log("\nABORTING\n");
            return;
        }
    }

    hashArray = [];

    for (i = begin; i < end; i++) {

        filepath = directorypath + CONFIG.NFT_FILE_PREFIX + i.toString() + CONFIG.NFT_FILE_SUFFIX;
        hash = await uploadNFt.createNFTFromAssetFile(filepath); 

        hashArray.push(hash);
    }

    console.log("Bulk Minting NFTs ");

    tx = await NFTContract.connect(deployer).mintBulk(qty, deployer.address);
    await tx.wait();

    console.log("Bulk Mint Transaction is");
    console.log(tx);

    bytes32Array = [];

    for(i=0; i<qty; i++) {
        temp = hashArray[i];
        let bytes1 = hre.ethers.utils.base58.decode(temp);
        bytes1 = bytes1.subarray(2, bytes1.length);
        bytes32Array.push(bytes1);
    }

    console.log("Storing MetaData for newly minted NFTs");

    tx = await MetaDataContract.connect(deployer).storeMetadata(bytes32Array);
    await tx.wait();

    console.log("Meta Data Stored, Transaction Summary is");
    console.log(tx);

}

async function minter(taskArgs, hre) {

    await uploadFiles(taskArgs, hre);
}
module.exports =  {
    minter,
}
