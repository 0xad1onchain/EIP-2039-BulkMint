const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const hre = require("hardhat");
const bs58 = require('bs58');
var MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

var to_b58 = function(
    B,            //Uint8Array raw byte input
    A             //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
    var d = [],   //the array for storing the stream of base58 digits
        s = "",   //the result string variable that will be returned
        i,        //the iterator variable for the byte input
        j,        //the iterator variable for the base58 digit array (d)
        c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
        n;        //a temporary placeholder variable for the current base58 digit
    for(i in B) { //loop through each byte in the input stream
        j = 0,                           //reset the base58 digit iterator
        c = B[i];                        //set the initial carry amount equal to the current byte amount
        s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
        while(j in d || c) {             //start looping through the digits until there are no more digits and no carry amount
            n = d[j];                    //set the placeholder for the current base58 digit
            n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
            c = n / 58 | 0;              //find the new carry amount (floored integer of current digit divided by 58)
            d[j] = n % 58;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
            j++                          //iterate to the next base58 digit
        }
    }
    while(j--)        //since the base58 digits are backwards, loop through them in reverse order
        s += A[d[j]]; //lookup the character associated with each base58 digit
    return s          //return the final base58 string
}


var from_b58 = function(
    S,            //Base58 encoded string input
    A             //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
    var d = [],   //the array for storing the stream of decoded bytes
        b = [],   //the result byte array that will be returned
        i,        //the iterator variable for the base58 string
        j,        //the iterator variable for the byte array (d)
        c,        //the carry amount variable that is used to overflow from the current byte to the next byte
        n;        //a temporary placeholder variable for the current byte
    for(i in S) { //loop through each base58 character in the input string
        j = 0,                             //reset the byte iterator
        c = A.indexOf( S[i] );             //set the initial carry amount equal to the current base58 digit
        if(c < 0)                          //see if the base58 digit lookup is invalid (-1)
            return undefined;              //if invalid base58 digit, bail out and return undefined
        c || b.length ^ i ? i : b.push(0); //prepend the result array with a zero if the base58 digit is zero and non-zero characters haven't been seen yet (to ensure correct decode length)
        while(j in d || c) {               //start looping through the bytes until there are no more bytes and no carry amount
            n = d[j];                      //set the placeholder for the current byte
            n = n ? n * 58 + c : c;        //shift the current byte 58 units and add the carry amount (or just add the carry amount if this is a new byte)
            c = n >> 8;                    //find the new carry amount (1-byte shift of current byte value)
            d[j] = n % 256;                //reset the current byte to the remainder (the carry amount will pass on the overflow)
            j++                            //iterate to the next byte
        }
    }
    while(j--)               //since the byte array is backwards, loop through it in reverse order
        b.push( d[j] );      //append each byte to the result
    return new Uint8Array(b) //return the final byte array in Uint8Array format
}
function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => i)
}

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

async function getLatestTimeStamp () {
    const result =  await hre.network.provider.send("eth_getBlockByNumber", ["latest", false]);
    return BigNumber.from(result.timestamp);

}

describe('Testing Project', () => {

    let NFTContract, NCTContract;
    let nft, nct
    let owners, deployer, addr1, addr2, addr3, addr4;
    const nftarg1 = "Neo Petters";
    const nftarg2 = "NPTS";
    const nctarg1 = "NameChangeToken";
    const nctarg2 = "NCT";
    let nctDeployTimeStamp;
    let nftDeployTimeStamp;


    //Deploy the Contract
    beforeEach(async () => {
        [deployer, addr1, addr2, addr3, addr4] = await hre.ethers.getSigners();
        
        NCTContract = await hre.ethers.getContractFactory("NameChangeToken");
        nct = await NCTContract.deploy("NameChangeToken", "NCT");

        nctDeployTimeStamp = await getLatestTimeStamp();

        await nct.deployed();

        NFTContract = await hre.ethers.getContractFactory("ERC721");
        nft = await NFTContract.deploy(nftarg1, nftarg2, nct.address);
        
        await nft.deployed();

        await nct.setNFTAddress(nft.address);

        MetaDataContract = await hre.ethers.getContractFactory("MetadataStore");
        metadata = await MetaDataContract.deploy(nft.address);

        await metadata.deployed();
       
    });


    describe('Pre Validate ERC721 and NCT', () => {
        it('Check Total Supply of NFT', async () => {
            totalSupply = await nft.totalSupply();
            expect(totalSupply).to.equal(0);
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
        
        it("Transfer Tests", async () => {
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

            const nftconnected = nft.connect(addr1);
            await nftconnected['safeTransferFrom(address,address,uint256)'](addr1.address, deployer.address, 2);

            owner = await nft.ownerOf(2);

            expect(owner).to.equal(deployer.address);

            await nft['safeTransferFrom(address,address,uint256)'](deployer.address, nft.address, 3);

            owner = await nft.ownerOf(3);       
            
            expect(owner).to.equal(nft.address);
        });

        it("Tests with NCT for Single Token", async () => {
            emissionPerDay = await nct.emissionPerDay();

            initalAllotment = await nct.INITIAL_ALLOTMENT();
            secondsPerDay = await  nct.SECONDS_IN_A_DAY();
            await nft.mint(deployer.address);

            await hre.network.provider.send("evm_increaseTime", [86400]);

            await nct.claim([0]);
            const TimeStamp = await getLatestTimeStamp();
            balance = await nct.balanceOf(deployer.address);
            
            v1 = TimeStamp.sub(nctDeployTimeStamp);
            v2 = v1.mul(emissionPerDay);
            v3 = v2.div(secondsPerDay);
            v4 = v3.add(initalAllotment);
            checkBigIntEquality(v4, balance);

            // await nft.mint(deployer.address);

            // await hre.network.provider.send("evm_increaseTime", [86400]);

            // await nct.claim([0,1]);

            // const TimeStamp2 = await getLatestTimeStamp();

        });

        it("Tests with NCT for Multiple Token", async () => {
            emissionPerDay = await nct.emissionPerDay();

            initalAllotment = await nct.INITIAL_ALLOTMENT();
            secondsPerDay = await  nct.SECONDS_IN_A_DAY();
            bulkQty = 100;
            await nft.mintBulk(bulkQty, deployer.address);

            await hre.network.provider.send("evm_increaseTime", [86400]);

            var arr = range(0,99);
            await nct.claim(arr);
            const TimeStamp = await getLatestTimeStamp();
            balance = await nct.balanceOf(deployer.address);
            
            v1 = TimeStamp.sub(nctDeployTimeStamp);
            v2 = v1.mul(emissionPerDay);
            v3 = v2.div(secondsPerDay);
            v4 = v3.add(initalAllotment);
            v5 = v4.mul(bulkQty);
            checkBigIntEquality(v5, balance);

            // await nft.mint(deployer.address);

            // await hre.network.provider.send("evm_increaseTime", [86400]);

            // await nct.claim([0,1]);

            // const TimeStamp2 = await getLatestTimeStamp();

        });

        it.only("MetaData Tests", async() => {

            await nft.mint(deployer.address);
            await nft.mint(deployer.address);
            await nft.mint(deployer.address);
            
            arrtemp = ["QmRHrPGvS94kr2QCYvviFCVAgKoQ3xMBgxN53dM9zXiG99"];
            arr2 = ["ABCD"];
            //IPFS it 
            tempstring = "QmRHrPGvS94kr2QCYvviFCVAgKoQ3xMBgxN53dM9zXiG99";
            arr2 = [tempstring, tempstring, tempstring];
            //Base58

           // val = hre.ethers.utils.arrayify('QmRHrPGvS94kr2QCYvviFCVAgKoQ3xMBgxN53dM9zXiG99');
            console.log("My val");
            let bytes = hre.ethers.utils.base58.decode(arr2[0]);
         // const bytes2 = bs58.decode(arr2[0]);
            console.log(bytes);
            bytes = bytes.subarray(2, bytes.length);
            console.log(bytes);
            console.log(bytes.toString());
            console.log(typeof(bytes));
            console.log(hre.ethers.utils.base58.encode(bytes));
           // console.log(bytes2);
           // console.log(bytes.length);

            // hexval  = bytes.toString('hex');

            // console.log(hexval);
            // console.log(hexval.slice(4));

            // temp2= hexval.slice(4);

            // tempbuffer = [Buffer.from(temp2)];
            
    
            // console.log(tempbuffer);
            // console.log(tempbuffer[0].length);
            // finalarr = [temp2, temp2];
            // console.log(temp2.length);

            console.log("Second Log");
           // const bytes2 = Buffer.from(hexval, 'hex');
           // reconvert = bs58.encode(bytes2);
           // console.log(reconvert);

            //console.log(val);
            // decoded1 = from_b58(tempstring, MAP);
            // console.log(decoded1);
            // decoded = toHexString(from_b58(tempstring, MAP)).toUpperCase();
            // console.log(decoded);
            // console.log(decoded.length);
           
            await metadata.storeMetadata([bytes, bytes], 0, 1);

            console.log('stored it all');

            uri = await metadata.getTokenURI(0);
            
            console.log(uri);

        });

    } )
});