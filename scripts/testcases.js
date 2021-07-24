const { expect } = require("chai");
const hre = require("hardhat");

const div = (x, y) => {

    const z = x / y
    return z
  }
  
const divUp = (x, y) => {
    const z = x / y
    // 
    // 
    if (z * y === x) {
      return z
    }
    return z + 1n
}
  
const checkBigIntEquality = (result, expected) => {
    // 
    expect(String(result)).to.equal(String(expected))
}
  
const checkBigIntGte = (result, expected) => {
    res = (result >= expected ? true : false)
    expect(res).to.equal(true)
}

const checkBigIntLte = (result, expected) => {
    res = (result <= expected ? true : false)
    expect(res).to.equal(true)
}

describe('Testing Project', () => {

    let NFTContract, NCTContract;
    let nft, nct
    let owners, deployer, addr1, addr2, addr3, addr4;
    const nftarg1 = "Neo Petters";
    const nftarg2 = "NPTS";
    const nctarg1 = "NameChangeToken";
    const nctarg2 = "NCT";

    //Deploy the Contract
    before(async () => {
        [deployer, addr1, addr2, addr3, addr4] = await hre.ethers.getSigners();
        
        NCTContract = await hre.ethers.getContractFactory("NameChangeToken");
        nct = await NCTContract.deploy("NameChangeToken", "NCT");

        await nct.deployed();

        NFTContract = await hre.ethers.getContractFactory("ERC721Test");
        nft = await NFTContract.deploy(nftarg1, nftarg2, nct.address);
        
        await nft.deployed();

        //Set the masks address in NCT

        await nct.setMasksAddress(nft.address);

       // console.log("Logging NFT");
       
    });


    describe('Pre Validate ERC721 and NCT', () => {
        it('Check Total Supply of NFT', async () => {
            totalSupply = await nft.totalSupply();
            expect(totalSupply).to.equal(0);
           // console.log("First Test Case");
        });

        it('Check Total Supply of NCT', async() => {
             totalSupply = await nct.totalSupply();
             expect(totalSupply).to.equal(0);        
        });

        it('Check initial balance of NFT of owner', async() => {
            balance = await nft.balanceOf(deployer.address);
            expect(balance).to.equal(0);
        });

        it('NFT Contract Should have correct symbol', async() => {
              symbol = await nft.symbol();
              expect(symbol).to.equal(nftarg2);  
        });

        it('NCT Contract Should have correct symbol', async() => {
            symbol = await nct.symbol();
            expect(symbol).to.equal(nctarg2);
        });
    });

    describe("Test Minting of NFTs", () => {
        it("Mint first NFT", async () => {
            await nft.mint(addr1.address);

            totalSupply = await nft.totalSupply();

            expect(totalSupply).to.equal(1);

            balance = await nft.balanceOf(addr1.address);

            expect(balance).to.equal(1);

        });

        it("Mint Bulk NFTs", async () => {

            const bulkQuantity = 150;
            await nft.mintBulk(bulkQuantity, deployer.address);

            totalSupply = await nft.totalSupply();

            expect(totalSupply).to.equal(bulkQuantity);

            balance = await nft.balanceOf(deployer.address);

            expect(balance).to.equal(bulkQuantity);
            
        });

        it("Mint Single NFT", async () => {
               await nft.mint(deployer.address);
               
               totalSupply = await nft.totalSupply();

               expect(totalSupply).to.equal(1);

               await nft.mint(deployer.address);

               totalSupply = await nft.totalSupply();
               balance = await nft.balanceOf(deployer.address);
               expect(totalSupply).to.equal(2);
               expect(totalSupply).to.equal(2);
        });
        
        it.only("Transfer Tests", async () => {
            const bulkQuantity = 100;
            await nft.mintBulk(bulkQuantity, deployer.address);
            await nft.mintBulk(bulkQuantity, deployer.address);

            totalSupply = await nft.totalSupply();

            expect(totalSupply).to.equal(bulkQuantity*2);

            await nft.transferFrom(deployer.address, addr1.address, 1);

            balance = await nft.balanceOf(addr1.address);

            expect(balance).to.equal(1);

           await nft['safeTransferFrom(address,address,uint256)'](deployer.address, addr1.address, 2);

            balance = await nft.balanceOf(addr1.address);

            expect(balance).to.equal(2);

            //console.log(nft);

            const nftconnected = nft.connect(addr1);
            console.log(nftconnected);
            await nftconnected['safeTransferFrom(address,address,uint256)'](addr1.address, deployer.address, 2);

            owner = await nft.ownerOf(2);

            expect(owner).to.equal(deployer.address);
            
        });

    } )
});