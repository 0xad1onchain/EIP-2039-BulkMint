const fs = require('fs/promises');
const path = require('path');
const CONFIG = require("../project.config.js");

const { create } = require('ipfs-http-client')

const ipfsAddOptions = {
    cidVersion: 0,
    hashAlg: 'sha2-256'
}

const IPFS = require("ipfs-api");
const ipfsclient = IPFS({
  host: CONFIG.NFT_HOST,
  port: 5001,
  protocol: "https",
});

async function createNFTFromAssetFile(filename) {

    const content = await fs.readFile(filename);
    const result = await ipfsclient.add({content}, ipfsAddOptions);
    const assetHash = result[0].hash;

    return assetHash;
}

module.exports =  {
     createNFTFromAssetFile,
 }
