# Name Change NFTs <!-- omit in toc -->

  

A JavaScript project for NFTs that allow the NFT owner to change the name of the NFT via a Name Change Token. A fixed amount of NCTs are accumulated per day for a given NFT owned by an owner. These tokens can later be spent for changing the name of the NFT. These NFTs can be listed on platforms like OpenSea and can be traded via ETH or any ERC20 token supported by the platform.


Developed by [Aditya Gupta](https://github.com/adigupta13) and Aditya Angadi

  

-  [Synopsis](#synopsis)

-  [Installation](#installation)

-  [Project Configuration](#project-configuration)

- [Project Deployment](#project-deployment)

## Synopsis

  

This is a JavaScript project for deploying multiple Non Fungible Tokens and associated Name Change Tokens. These Name Change Tokens can later be redeemed to change the name of Non Fungible Token. The Non Fungible Tokens are **ERC721** compliant and the Name Change Token is **ERC20** compliant.

These tokens can be listed for sale on **OpenSea** Platform for native ether or any other ERC20 token

  

Happy NameChanging! ⛵️

  

## Installation

  

Node.js version to be used is **12.14.1** to make sure common crypto dependencies work. The dependency for OpenSea is only compatible with the mentioned version. Execute `nvm use`, if you have Node Version Manager. Node version **12.14.1** is not stable on **Apple M1 Macs** . Hence it is not recommended

  

Then, in your project, run:

```bash

npm i

```

The above installs all dependencies

  

## Project Configuration

  

***Important***: Configure the project with the explained parameters to correctly set it up and deploy

  

The described parameters are present in ***project.config.js*** file in the project directory

  

```JavaScript

//CONFIG OPTIONS FOR NFT TOKEN (ERC721 TOKEN)

1.  NFT_NAME: {

TYPE : STRING

DESCRIPTION: "Name for the ERC721 NFT TOKEN"

}

Example:

NFT_NAME: "Neo Pets NFT"

  

2.  NFT_SYMBOL : {

TYPE: STRING

DESCRIPTION: "Symbol for the ERC721 NFT TOKEN"

}

Example:

NFT_SYMBOL: "NFT"

```

  

```JavaScript

//CONFIG OPTIONS FOR NCT TOKEN (ERC20 TOKEN)

3.  NCT_NAME: {

TYPE : STRING

DESCRIPTION: "Name for the ERC20 Name Change TOKEN"

}

Example:

NCT_NAME: "Neo Pets Name Change Token"

  

4.  NCT_SYMBOL : {

TYPE: STRING

DESCRIPTION: "Symbol for the ERC20 Name Change TOKEN"

}

Example:

NCT_SYMBOL: "NCT"

```

  

```JavaScript

/*

The asset files may have a suffix and a prefix depending upon the file format and naming convention.

*/

  

/*

The expected asset file name pattern is

[PREFIX][TOKENID][SUFFIX]

  

Example NFT1.jpg

PREFIX - "NFT"

SUFFIX - ".jpg"

  

Example 1.png

PREFIX = ""

SUFFIX = ".png"

  

Token ID is mandatory

*/

  

5.  NFT_FILE_PREFIX: {

TYPE : STRING

DESCRIPTION: "Prefix of the asset file. Can be empty"

}

Example:

NFT_FILE_PREFIX: ""  //EMPTY PREFIX

  

6.  NFT_FILE_SUFFIX : {

TYPE: STRING

DESCRIPTION: "Suffix of the asset file. Can be empty"

}

Example:

NFT_FILE_SUFFIX: ".jpg"  // Usually to indicate the file format

```

```JavaScript

/*

OPTIONS FOR HOSTING THE NFTs.

The Standard Practice of hosting NFTs is via IPFS. These below options help to configure the IPFS Provider and the subsequent URI prefix

*/

  

7.  NFT_HOST: {

TYPE: STRING

DESCRIPTION: "The IPFS API ENDPOINT PROVIDER . Recommended provider is INFURA"

}

Example  NFT_HOST: "ipfs.infura.io"

  

8.  BASE_URI_PREFIX: {

TYPE:STRING

DESCRIPTION: The  subsequent  URL  for  the  ENPOINT  to  access  the  NFT  asset  via  IPFS.

}

Example :- If  INFURA  API  is  used  then  the  BASE_URI_PREFIX: "https://ipfs.infura.io/ipfs/"

  

9.  BASE_URI_SUFFIX: {

TYPE: STRING

DESCRIPTION: Suffix  for  the  asset  URL. Defaults  to  "/"  on  INFURA. May  change  if  some  other  provider  is  used

}

Example : BASE_URI_SUFFIX: "/"  //INFURA DEFAULT

  

```

```JavaScript

/*

The Config Options below specify the NODE URL to access particular ETHEREUM network. It is recommended to use INFURA as the API provider to access ETHEREUM Network. The URLs for the network can be obtained by signing up on INFURA to get the api key. "https://infura.io"

*/

10.  HOMESTEAD_URL: {

TYPE: STRING

DESCRIPTION: "URL FOR THE ETHEREUM MAINET"

}

Example:

HOMESTEAD_URL: "https://eth-mainnet.alchemyapi.io/v2/<API_SECRET>"

  

11.  RINKEBY_URL: {

TYPE: STRING

DESCRIPTION: "URL FOR THE RINKEBY TESTNET"

}

```

```JavaScript

/*

The CONFIG Option below specifies the seed phrase for the walled that will be used to deploy the contracts and mint the NFTs

*/

12.  ACCOUNT_NEMONIC: {

TYPE: STRING  OF  12  Space  Separated  Words

DESCRIPTION: SEED  PHRASE  OF  HD  WALLET

}

Example :

ACCOUNT_NEMONIC: "journey female bring inject beauty strategy egg erupt fire volcano lion pause", // JUST FOR DEMO

```

  

```JavaScript

/*

The CONFIG Option below specifies ETHERSCAN options required to verify the contracts. Verified contracts on public blockchain give more credibility about the project

*/

13.  ETHERSCAN_API_KEY: {

TYPE: STRING,

DESCRIPTION: ETHERSCAN  KEY  OBTAINED  BY  REGISTERING  ON  etherscan.io

}

14.  VERIFY_CONTRACT : {

TYPE: BOOLEAN,

DESCRIPTION: Boolean  to  turn  on / off  verification. Verification  can  be  turned  of  during  testing

}

VERIFY_CONTRACT: true

  

```

  

```JavaScript

/*

The CONFIG Option below specifies OPENSEA CONFIGURATION OPTIONS that help in listing and selling of NFTs on OpenSea

*/

15.  OPENSEA_API_URL: {

TYPE: STRING,

DESCRIPTION: OPENSEA  URL

}

Example

OPENSEA_API_URL: "https://rinkeby-api.opensea.io/api/v1/"

16.  OPENSEA_API_KEY : {

TYPE: STRING,

DESCRIPTION: OPENSEA  API  KEY  OBTAINED  ON  REQUESTING  ON  OPENSEA

}

17.  OPENSEA_NETWORK: {

TYPE: STRING,

DESCRIPTION: NETWORK  TO  USE  FOR  LISTING  NFTS. Either  MAINET  OR  RINKEBY(FOR  TESTING)

}

18.  OPENSEA_USE_ERC20: {

TYPE: Boolean,

Description: If  "true"  means  ERC20  will  be  used  for  selling  the  NFT, If  "false"  means  ETHER  will  be  used  for  selling  the  NFT.

}

Example  OPENSEA_USE_ERC20: true,

  

19.  OPENSEA_ERC20_SYMBOL: {

TYPE: STRING,

Description: Only  applies  if  "OPENSEA_USE_ERC20"  is  true, The  SYMBOL  of  the  token  that  will  be  used  to  sell  the  NFT  on  OpenSea.

}

Example  OPENSEA_ERC20_SYMBOL: "DAI"  //DAI Stable coin will be used to sell the NFT instead of Ether

```

```Javascript
	This additional step is required to create a priceList.json file that contains the price of asset NFTs to be used while they are being listed on OpenSea for Sale. The Structure of the File is very straightforward. 
	{TokenId: Price}

Example

priceList.json
{

"0": "12",

"1": "0.12",

"2": "0.42",

"3": "0.12",

"4": "0.12",

"5": "0.13",

"6": "0.14",

"7": "0.15",

"8": "0.16",

"9": "0.17",

"10": "0.18",

"11": "0.18",

"12": "0.18",

"13": "0.18",

"14": "0.15",

"15": "0.15",

"16": "0.15",

"17": "0.14",

"18": "0.14",

"19": "0.13",

"20": "0.13"

}
```

## Project Deployment

The project can be deployed on mainnet/testnets via performing the following sequence steps described briefly below

* Test the smart contracts on the local network

* Deploy and Verify the smart contracts on the network via `deploy.js` script

* Bulk Mint the required number of NFTs via `mintTokens.js` script

* List the NFTs for Sale on OpenSea platform via `listTokens.js` script 

#### Test the Smart Contracts

	Execute the below command to test the smart contracts on the local network. 
	

```bash
	npx hardhat test
```
#### Deploy and Verify the Smart Contracts

	Execute the below command to deploy and verify the smart contracts on the selected network.
	

```bash 
	#
	#Use --network rinkeby for testnet 
	#Use --network homestead for mainnet
	#Please Ensure CONFIG.HOMESTEAD_URL and CONFIG.RINKEBY_URL are correct
	#CONFIG.ACCOUNT_NEMONIC should correspond to the intended wallet
	#
	#   
	npx hardhat run scripts/deploy.js --network rinkeby
```	

#### Bulk Mint the required number of NFTs (Can be executed repeatedly)

	Execute the below command to BulkMint the NFTs the smart contracts on the selected network. You can execute the command again as and when there is need of minting NFTs
	Maximum NFTs that can be minted are 150 in one command. Run this command multiple times to mint several NFTs
	

```bash 
	#
	#Use --network rinkeby for testnet 
	#Use --network homestead for mainnet
	#Please Ensure CONFIG.HOMESTEAD_URL and CONFIG.RINKEBY_URL are correct
	#CONFIG.ACCOUNT_NEMONIC should correspond to the intended wallet
	#
	#Use recommended --quantity 100 at a time for optimal gas 
	#Use --nftdirectory with the absolue path of the folder containing the NFT
	#Assets on the local file system. Please refer to the asset naming convention
	#above while setting up the configuration data (project.config.js)
	#   
	npx hardhat mintNFT --network rinkeby --quantity 100 --nftdirectory /mnt/f/PW/nft_pics/
```	

#### List the minted NFTs for sale on OpenSea (Can be executed repeatedly)

	Execute the below command to list the NFTs for sale on OpenSea. You can execute the command again as and when you have minted NFTs that need to be listed for sale. 
	

```bash 
	#
	#Use --network rinkeby for testnet 
	#Use --network homestead for mainnet
	#Please Ensure CONFIG.HOMESTEAD_URL and CONFIG.RINKEBY_URL are correct
	#CONFIG.ACCOUNT_NEMONIC should correspond to the intended wallet
	#
	#Use --pricelist with the absolue path of the folder containing the 
	# priceList.json file. This file contains the rate at which the NFT will be 
	# listed for sale. You are supposted manually create the file
	# The structure of file is TokenId: Price
	#
	#   
	npx hardhat listNFT --network rinkeby --pricelist priceList.json
```	


	
	
	