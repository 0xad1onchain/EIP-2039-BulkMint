const { OpenSeaPort, Network } =  require('opensea-js');
const { WyvernSchemaName } = require('opensea-js/lib/types')
const fs = require('fs');
const CONFIG = require("../project.config.js");

const MnemonicWalletSubprovider = require("@0x/subproviders").MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");


async function listNFTs(taskArgs, hre, web3) {
    const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
    const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
        mnemonic: CONFIG.ACCOUNT_NEMONIC,
        baseDerivationPath: BASE_DERIVATION_PATH,
    });

    const infuraRpcSubprovider = new RPCSubprovider({
        rpcUrl: 'https://rinkeby.infura.io/v3/eefe88ec80f74d33a52967249a8d4db1'
    });

    const providerEngine = new Web3ProviderEngine();
    providerEngine.addProvider(mnemonicWalletSubprovider);
    providerEngine.addProvider(infuraRpcSubprovider);
    providerEngine.start();

    const  [deployer] = await hre.ethers.getSigners();
   
    console.log(taskArgs);
    console.log(providerEngine.selectedAddress)
    const provider = providerEngine;

    const seaport = new OpenSeaPort(provider, {
        networkName: CONFIG.OPENSEA_NETWORK,
        // apiKey: CONFIG.OPENSEA_API_KEY,
    });

    deployments = JSON.parse(fs.readFileSync("deployment.txt", 'utf8'));

    nftContract = deployments.NFTContract;
    nftContract = nftContract.toString();

    NFTContract = await hre.ethers.getContractAt("ERC721" , nftContract);

    totalSupply = await NFTContract.connect(deployer).totalSupply();

    
    const deployerAddr = deployer.address;
    console.log(deployerAddr);

    prices = JSON.parse(fs.readFileSync(taskArgs.pricelist, 'utf8'));
    // console.log(prices);

    const expirationTimeCalc = Math.round(Date.now() / 1000 + 60 * 60 * 24 * 365 * 10);

    // const asset = await seaport.api.getAsset({
    //     tokenAddress: nftContract, // string
    //     tokenId: 0, // string | number | null
    // });

    // console.log(asset);

    for (var token in prices) {

        console.log(token, prices[token]);  

        // tokenId = token.toString();
        // tokenAddress = nftContract;
        // accountAddress = deployerAddr;
        // startAmount = 1;
        // endAmount = 1;
        // expirationTime = expirationTimeCalc;
        // schemaName = WyvernSchemaName.ERC721;
        // let list = await seaport.createSellOrder({ tokenId, tokenAddress, schemaName, accountAddress, startAmount, endAmount, expirationTime })
        
        
        var input = {
            asset: {
                tokenId: token.toString(),
                tokenAddress: nftContract,
                schemaName: WyvernSchemaName.ERC721,
            },
            accountAddress: deployerAddr,
            startAmount: parseFloat(prices[token]),
            endAmount: parseFloat(prices[token]),
            expirationTime: expirationTimeCalc
        };

        console.log(input);
        
        try {
            let listing = await seaport.createSellOrder(input);
        } catch(err) {
            console.log('wtf');
            console.log(err);
        }

       
        
        
        console.log(list);
        console.log('list done');
    }
    console.log(expirationTime);

    // const listing = await seaport.createSellOrder({
    //     asset: {
    //         tokenId,
    //         tokenAddress,
    //     },
    //     accountAddress,
    //     startAmount: 3,
    //     endAmount: 0.1,
    //     expirationTime
    // });

    
}

async function list(taskArgs, hre, web3) {

    await listNFTs(taskArgs, hre, web3);
}
module.exports =  {
    list,
}
