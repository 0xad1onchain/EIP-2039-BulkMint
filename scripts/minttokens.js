const CONFIG = require("../project.config.js");
const path = require('path');
const fs = require('fs');
const uploadNFt = require("./upload.js");


async function uploadFiles(taskArgs, hre) {
    console.log(taskArgs);
    qty = parseInt(taskArgs.quantity);
    console.log(qty);
    directorypath = (taskArgs.nftdirectory).toString();
    console.log("after path");
    console.log(directorypath);
    console.log("Above \n");
    console.log(directorypath);
    const  [deployer, addr1, addr2] = await hre.ethers.getSigners();

    deployments = JSON.parse(fs.readFileSync("deployment.txt", 'utf8'));
    nftcontract = deployments.NFTContract;
    metadatacontract = deployments.MetaDataContract;
    nftcontract = nftcontract.toString();
    metadatacontract = metadatacontract.toString();
    console.log(nftcontract);

    if(directorypath.slice(-1) != "/")
        directorypath = directorypath + "/";

    NFTContract = await hre.ethers.getContractAt("ERC721" , nftcontract);
    console.log(metadatacontract);
    MetaDataContract = await hre.ethers.getContractAt("MetadataStore", metadatacontract);

    console.log("Total Supply");
    totalSupply = await NFTContract.connect(deployer).totalSupply();
    totalSupply = parseInt(totalSupply);
    console.log(totalSupply.toString());

    console.log("Dir path is");
    console.log(directorypath);
    begin = totalSupply;
    end = totalSupply + qty;
    for (i = begin; i < end; i++) {

        filepath = directorypath + CONFIG.NFT_FILE_PREFIX + i.toString() + CONFIG.NFT_FILE_SUFFIX;
        if (!fs.existsSync(filepath)) {
            console.log("ERROR NFT FILE DOES NOT EXIST FOR INDEX", i);
            return;
        }
    }

    hashArray = [];

    for (i = begin; i < end; i++) {

        filepath = directorypath + CONFIG.NFT_FILE_PREFIX + i.toString() + CONFIG.NFT_FILE_SUFFIX;
        hash = await uploadNFt.createNFTFromAssetFile(filepath); 

        hashArray.push(hash);
    }

    await NFTContract.connect(deployer).mintBulk(qty, deployer.address);

    base58Array = [];

    for(i=0; i<qty; i++) {
        temp = hashArray[i];
        let bytes1 = hre.ethers.utils.base58.decode(temp);
        bytes1 = bytes1.subarray(2, bytes1.length);
        base58Array.push(bytes1);
    }

    await MetaDataContract.connect(deployer).storeMetadata(base58Array);

    console.log( "COmplete");

}

async function mintNFTs(taskArgs, hre) {
    console.log("Here");
    await uploadFiles(taskArgs, hre);
}
module.exports =  {
    mintNFTs,
}
