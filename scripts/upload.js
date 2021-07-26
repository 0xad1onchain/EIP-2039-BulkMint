const fs = require('fs/promises')
const path = require('path')

// const CID = require('cids')
const { create } = require('ipfs-http-client')
// const all = require('it-all')
// const uint8ArrayConcat = require('uint8arrays/concat')
// const uint8ArrayToString = require('uint8arrays/to-string')

// const {BigNumber} = require('ethers')
// const { string } = require('hardhat/internal/core/params/argumentTypes')

//Add parameters for deterministic CIDs
const ipfsAddOptions = {
    cidVersion: 0,
    hashAlg: 'sha2-256'
}

const IPFS = require("ipfs-api");
const ipfsclient = IPFS({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

//const ipfsclient = create(new URL('http://localhost:5001'));

function ensureIpfsUriPrefix(cidOrURI) {
    let uri = cidOrURI.toString()
    if (!uri.startsWith('ipfs://')) {
        uri = 'ipfs://' + cidOrURI
    }
    // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
    if (uri.startsWith('ipfs://ipfs/')) {
      uri = uri.replace('ipfs://ipfs/', 'ipfs://')
    }
    return uri
}
/*
const metadata = {
    title: "Vaccine Shot",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: `Proof of Vaccination for ${this.state.name}`,
      },
      description: {
        type: "string",
        description: `My #${this.state.dose} shot of COVID-19 Vaccine`,
      },
      image: {
        type: "string",
        description: `https://ipfs.infura.io/ipfs/${imageHash[0].hash}`,
      },
    },
  };
*/

async function createNFT(filename, name, description, owner) {

  const basename = path.basename(filename);
  // const ipfsPath = '/nft/' + basename;
  const content = await fs.readFile(filename);
  console.log(content)
  const fileBuffer = Buffer.from(content, "utf8");
  await ipfsclient.add(fileBuffer, async(err, result) => {
    console.log(err)
    console.log(result);
    // console.log(await ipfsclient.cat(result[0].hash));
  });
}

async function createNFTFromAssetFile(filename, name, description, owner) {
    const basename = path.basename(filename);
    const ipfsPath = '/nft/' + basename;
    const content = await fs.readFile(filename);
    const result = await ipfsclient.add({path: ipfsPath, content}, ipfsAddOptions);
    console.log("assetCid is ", result[0].hash);
    console.log(ipfsPath);
    const assetURI = "https://ipfs.infura.io/ipfs/" + result[0].hash;

    console.log(assetURI);

    const nftMetaData = {
        title: "CherryPick",
        type: "object",
        properties: {
            name: {
                type:"string",
                description:"NEO PET NFTS",

            },
            description: {
                type:"string",
                description:"FIRST NEO PET NFT",
            },
            image: {
                type:"string",
                description: assetURI,

            }
        }
    }

    const metDataStr = JSON.stringify(nftMetaData);
    const metaDataBuffer = Buffer.from(metDataStr, "utf8");

    // const jsondataresult = await ipfsclient.add(nftMetaData);
    const jsondataresult = await ipfsclient.add( metaDataBuffer);
  
    console.log(jsondataresult)

    console.log('String to use', "https://ipfs.infura.io/ipfs/" + jsondataresult[0].hash);

  //   console.log(nftMetaData);
  //   console.log(assetURI);
  //  // console.log(content);
  //   // console.log(assetCid);
  //   console.log("Hello");

  //   //Add the MetaData to IPFS
  //   const { cid: metadataCid } = await ipfsclient.add({ path: '/nft/metadata.json', content: JSON.stringify(nftMetaData)}, ipfsAddOptions)
  //   const metadataURI = ensureIpfsUriPrefix(metadataCid) + '/metadata.json'
  //   //console.log(metadataURI);

  //   return metadataURI;

}

console.log("Inside ipfs meta js");

createNFTFromAssetFile("files/NFT1.jpg", "NFT1", "THis is test first nft", "owner");

// createNFT("files/NFT1.PNG", "NFT1", "THis is test first nft", "owner");

// module.exports =  {
//     createNFTFromAssetFile,
// }

console.log("Donw with it");