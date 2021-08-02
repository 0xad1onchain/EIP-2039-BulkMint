const { OpenSeaPort, Network } =  require('opensea-js');
const { WyvernSchemaName } = require('opensea-js/lib/types')
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require('fs');
const CONFIG = require("../project.config.js");


async function listNFTs(taskArgs, hre) {

    const providerUrl = hre.network.config.url;

    const provider = new HDWalletProvider({
        mnemonic: {
          phrase: CONFIG.ACCOUNT_NEMONIC
        },
        providerOrUrl: providerUrl
    });

    const  [deployer] = await hre.ethers.getSigners();


    const seaport = new OpenSeaPort(provider, {
        networkName: CONFIG.OPENSEA_NETWORK,
        // apiKey: CONFIG.OPENSEA_API_KEY, // To be used in production environment
    });

    deployments = JSON.parse(fs.readFileSync("deployment.txt", 'utf8'));

    nftContract = deployments.NFTContract;
    nftContract = nftContract.toString();

    NFTContract = await hre.ethers.getContractAt("ERC721" , nftContract);

    totalSupply = await NFTContract.connect(deployer).totalSupply();

    const deployerAddr = deployer.address;

    prices = JSON.parse(fs.readFileSync(taskArgs.pricelist, 'utf8'));

    if (CONFIG.OPENSEA_USE_ERC20) {
        const token = (await seaport.api.getPaymentTokens({ symbol: CONFIG.OPENSEA_ERC20_SYMBOL})).tokens[0];
    }
   
    for (var token in prices) {
       
        if (parseInt(token) < totalSupply) {
            var input = {
                asset: {
                    tokenId: token.toString(),
                    tokenAddress: nftContract,
                    schemaName: WyvernSchemaName.ERC721,
                },
                accountAddress: deployerAddr,
                startAmount: parseFloat(prices[token]),
                endAmount: parseFloat(prices[token]),
                expirationTime: 0
            };

            if(CONFIG.OPENSEA_USE_ERC20) {
                const token = (await seaport.api.getPaymentTokens({symbol: CONFIG.OPENSEA_ERC20_SYMBOL})).tokens[0];
                input["payment_token_address"] = token.address;
            }
            
            try {
                let listing = await seaport.createSellOrder(input);
            } catch(err) {
                console.log(err);
            }
        }
    }

}

async function list(taskArgs, hre, web3) {

    await listNFTs(taskArgs, hre, web3);
}
module.exports =  {
    list,
}
