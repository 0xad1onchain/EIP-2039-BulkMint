# Name Change NFTs <!-- omit in toc -->

A JavaScript project for NFTs that allow the NFT owner to change the name of the NFT via a Name Change Token. A fixed amount of NCTs are accumulated per day for a given NFT owned by an owner. These tokens can later be spent for changing the name of the NFT.  These NFTs can be listed on platforms like OpenSea and can be traded via ETH or any ERC20 token supported by the platform.

Developed by [Aditya Gupta](https://github.com/ProjectOpenSea/opensea-js) and [Aditya Angadi](https://www.npmjs.com/package/opensea-js)

- [Synopsis](#synopsis)
- [Installation](#installation)
  - [Project Configuration](#project-configuration)
 
## Synopsis

This is a  JavaScript project for deploying multiple Non Fungible Tokens and associated Name Change Tokens. These Name Change Tokens can later be redeemed to change the name of Non Fungible Token. The Non Fungible Tokens are **ERC721** compliant and the Name Change Token is **ERC20** compliant. 
These tokens can be listed for sale on **OpenSea** Platform for native ether or any other ERC20 token

Happy NameChanging! ⛵️

## Installation

 Node.js version to be used is  **12.14.1** to make sure common crypto dependencies work. The dependency for OpenSea is only compatible with the mentioned version. Execute `nvm use`, if you have Node Version Manager.  Node version **12.14.1** is not stable on **Apple M1 Macs** . Hence it is not recommended

Then, in your project, run:
```bash
npm i
```
The above installs all dependencies

### Project Configuration

***Important***: Configure the project with the explained parameters to correctly set it up and deploy

The described parameters are present in ***project.config.js*** file in the project directory

```JavaScript
//CONFIG OPTIONS FOR NFT TOKEN (ERC721 TOKEN)
1. NFT_NAME: {	
	TYPE : STRING
	DESCRIPTION: "Name for the ERC721 NFT TOKEN"
	}
	Example:
	NFT_NAME: "Neo Pets NFT"

2. NFT_SYMBOL : {
	TYPE: STRING
	DESCRIPTION: "Symbol for the ERC721 NFT TOKEN"
	}
	Example:
	NFT_SYMBOL: "NFT"
```

```JavaScript
//CONFIG OPTIONS FOR NCT TOKEN (ERC20 TOKEN)
3. NCT_NAME: {	
	TYPE : STRING
	DESCRIPTION: "Name for the ERC20 Name Change TOKEN"
	}
	Example:
	NCT_NAME: "Neo Pets Name Change Token"

4. NCT_SYMBOL : {
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

5. NFT_FILE_PREFIX: {	
	TYPE : STRING
	DESCRIPTION: "Prefix of the asset file. Can be 	empty"
	}
	Example:
	NFT_FILE_PREFIX: "" //EMPTY PREFIX

6. NFT_FILE_SUFFIX : {
	TYPE: STRING
	DESCRIPTION: "Suffix of the asset file. Can be empty"
	}
	Example:
	NFT_FILE_SUFFIX: ".jpg" // Usually to indicate the file format
```
```JavaScript
/*
OPTIONS FOR HOSTING THE NFTs.
The Standard Practice of hosting NFTs is via IPFS. These below options help to configure the IPFS Provider and the subsequent URI prefix
*/

7. NFT_HOST: {
	TYPE: STRING
	DESCRIPTION: "The IPFS API ENDPOINT PROVIDER .		Recommended provider is INFURA" 
  }
  	Example NFT_HOST: "ipfs.infura.io"

8. BASE_URI_PREFIX: { 
	TYPE:STRING
	DESCRIPTION: The subsequent URL for the ENPOINT to access the NFT asset via  IPFS.
	}
	Example :- If INFURA API is used then the BASE_URI_PREFIX: "https://ipfs.infura.io/ipfs/"

9. BASE_URI_SUFFIX: {
	TYPE: STRING
	DESCRIPTION: Suffix for the asset URL. Defaults to "/" on INFURA. May change if some other provider is used 
	}
	Example : BASE_URI_SUFFIX: "/" //INFURA DEFAULT

```
```JavaScript
/*
The Config Options below specify the NODE URL to access particular ETHEREUM network. It is recommended to use INFURA as the API provider to access ETHEREUM Network. The URLs for the network can be obtained by signing up on INFURA to get the api key. "https://infura.io" 
*/
10. HOMESTEAD_URL: {
	TYPE: STRING
	DESCRIPTION: "URL FOR THE ETHEREUM MAINET"
	}
	 Example:
	 HOMESTEAD_URL: "https://eth-mainnet.alchemyapi.io/v2/<API_SECRET>" 

11. RINKEBY_URL: {
	TYPE: STRING
	DESCRIPTION: "URL FOR THE RINKEBY TESTNET"
   }
```
```JavaScript
/*
 The CONFIG Option below specifies the seed phrase for the walled that will be used to deploy the contracts and mint the NFTs
 */
 12. ACCOUNT_NEMONIC: {
	 TYPE: STRING OF 12 Space Separated Words
	 DESCRIPTION: SEED PHRASE OF HD WALLET
    }
    Example :
    ACCOUNT_NEMONIC: "journey female bring inject beauty strategy egg erupt fire volcano lion pause", // JUST FOR DEMO
```

```JavaScript
/*
 The CONFIG Option below specifies ETHERSCAN options required to verify the contracts. Verified contracts on public blockchain give more credibility about the project
 */
 13. ETHERSCAN_API_KEY: {
		 TYPE: STRING,
		 DESCRIPTION: ETHERSCAN KEY OBTAINED BY REGISTERING ON etherscan.io
	 }
14. VERIFY_CONTRACT : {
       TYPE: BOOLEAN,
       DESCRIPTION: Boolean to turn on / off verification. Verification can be turned of during testing	
	}
	VERIFY_CONTRACT: true

```

```JavaScript
/*
 The CONFIG Option below specifies OPENSEA CONFIGURATION OPTIONS that help in listing and selling of NFTs on OpenSea
 */
 15. OPENSEA_API_URL: {
		 TYPE: STRING,
		 DESCRIPTION: OPENSEA URL
	 }
	 Example
	 OPENSEA_API_URL: "https://rinkeby-api.opensea.io/api/v1/"
	 
16. OPENSEA_API_KEY : {
       TYPE: STRING,
       DESCRIPTION: OPENSEA API KEY OBTAINED ON REQUESTING ON OPENSEA
	}
	
17. OPENSEA_NETWORK: {
		TYPE: STRING,
		DESCRIPTION: NETWORK TO USE FOR LISTING NFTS. Either MAINET OR RINKEBY(FOR TESTING)
	}
	
18. OPENSEA_USE_ERC20: {
		TYPE: Boolean,
		Description: If "true" means ERC20 will be used for selling the NFT, If "false" means ETHER will be used for selling the NFT.
	}
	Example OPENSEA_USE_ERC20: true,

19. OPENSEA_ERC20_SYMBOL: {
		TYPE: STRING,
		Description: Only applies if "OPENSEA_USE_ERC20" is true, The SYMBOL of the token that will be used to sell the NFT on OpenSea.
  }
	  Example OPENSEA_ERC20_SYMBOL: "DAI" //DAI Stable coin will be used to sell the NFT instead of Ether

```
