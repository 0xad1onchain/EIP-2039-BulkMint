pragma solidity ^0.8.1;

import "./interfaces/IERC721.sol";
import "./interfaces/IERC721Receiver.sol";
import "./interfaces/IERC721Metadata.sol";
import "./interfaces/IERC721Enumerable.sol";
import "./interfaces/IERC2309.sol";
import "./interfaces/IERC20.sol";
import "./libs/ERC165.sol";
import "./libs/SafeMath.sol";
import "./libs/Address.sol";
import "./libs/Ownable.sol";
import "./libs/EnumerableSet.sol";
import "hardhat/console.sol";

/**
 * @title ERC721 Non-Fungible Token Standard basic implementation
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721 is
    ERC165,
    IERC721,
    IERC721Enumerable,
    IERC721Receiver,
    Ownable,
    IERC2309
{
    using SafeMath for uint256;
    using Address for address;
    using EnumerableSet for EnumerableSet.UintSet;

    // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    // Mapping from token ID to owner
    mapping(uint256 => address) private _tokenOwner;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Mapping for tokens owned by each address
    mapping(address => EnumerableSet.UintSet) private _holderTokens;

    // Mapping from token ID to name
    mapping(uint256 => string) private _tokenName;

    // Mapping if certain name string has already been reserved
    mapping(string => bool) private _nameReserved;

    // Mapping from tokenIds to tokenURIs
    //xasdsadasdasdas
    mapping(uint256 => bytes) private _tokenURIs;

    address private _nctAddress;

    uint256 public constant NAME_CHANGE_PRICE = 1830 * (10**18);

    string public name;

    string public symbol;

    uint256 public override totalSupply;

    address private BURN_ADDRESS = 0xc0a227a440aA6432aFeC59423Fd68BD00cAbB529;

    bytes4 private constant _InterfaceId_ERC721 = 0x80ac58cd;

    string private BASEURI = "https://ipfs.infura.io/ipfs/";

    /*
     * 0x80ac58cd ===
     *   bytes4(keccak256('balanceOf(address)')) ^
     *   bytes4(keccak256('ownerOf(uint256)')) ^
     *   bytes4(keccak256('approve(address,uint256)')) ^
     *   bytes4(keccak256('getApproved(uint256)')) ^
     *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
     *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
     *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
     *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
     *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
     */

    constructor(
        string memory _name,
        string memory _symbol,
        address _NCTAddress
    ) {
        _registerInterface(_InterfaceId_ERC721);
        name = _name;
        symbol = _symbol;
        _nctAddress = _NCTAddress;
    }

    // Events
    event NameChange(uint256 indexed maskIndex, string newName);

    /**
     * @dev Gets the balance of the specified address
     * @param owner address to query the balance of
     * @return uint256 representing the amount owned by the passed address
     */
    function balanceOf(address owner) public view override returns (uint256) {
        require(
            owner != address(0) && owner != BURN_ADDRESS,
            "ERC721 :: balanceOf : ownerCheck"
        );
        return _holderTokens[owner].length();
    }

    /**
     * @dev Gets the owner of the specified token ID
     * @param tokenId uint256 ID of the token to query the owner of
     * @return owner address currently marked as the owner of the given token ID
     */
    function ownerOf(uint256 tokenId) public view override returns (address) {
        require(tokenId < totalSupply, "ERC721 :: ownerOf : aboveTotalSupply");
        address _owner = _tokenOwner[tokenId];
        return _owner;
    }

    /**
     * @dev Approves another address to transfer the given token ID
     * The zero address indicates there is no approved address.
     * There can only be one approved address per token at a given time.
     * Can only be called by the token owner or an approved operator.
     * @param to address to be approved for the given token ID
     * @param tokenId uint256 ID of the token to be approved
     */
    function approve(address to, uint256 tokenId) public override {
        require(_exists(tokenId), "ERC721 :: approve : token does not exist");
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721 :: approve : cant approve yourself");
        require(msg.sender == owner || isApprovedForAll(owner, msg.sender));

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /**
     * @dev Gets the approved address for a token ID, or zero if no address set
     * Reverts if the token ID does not exist.
     * @param tokenId uint256 ID of the token to query the approval of
     * @return address currently approved for the given token ID
     */
    function getApproved(uint256 tokenId)
        public
        view
        override
        returns (address)
    {
        require(
            _exists(tokenId),
            "ERC721 :: getApproved : token does not exist"
        );
        return _tokenApprovals[tokenId];
    }

    /**
     * @dev Sets or unsets the approval of a given operator
     * An operator is allowed to transfer all tokens of the sender on their behalf
     * @param to operator address to set the approval
     * @param approved representing the status of the approval to be set
     */
    function setApprovalForAll(address to, bool approved) public override {
        require(
            to != msg.sender,
            "ERC721 :: setApprovalForAll : cant approve yourself"
        );
        _operatorApprovals[msg.sender][to] = approved;
        emit ApprovalForAll(msg.sender, to, approved);
    }

    /**
     * @dev Tells whether an operator is approved by a given owner
     * @param owner owner address which you want to query the approval of
     * @param operator operator address which you want to query the approval of
     * @return bool whether the given operator is approved by the given owner
     */
    function isApprovedForAll(address owner, address operator)
        public
        view
        override
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev Transfers the ownership of a given token ID to another address
     * Usage of this method is discouraged, use `safeTransferFrom` whenever possible
     * Requires the msg sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            _exists(tokenId),
            "ERC721 :: transferFrom : token does not exist"
        );
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "ERC721 :: transferFrom : isnt approved or you dont own it"
        );
        _clearApproval(from, tokenId);
        _removeTokenFrom(from, tokenId);
        _addTokenTo(to, tokenId);
        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     *
     * Requires the msg sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external override {
        // solium-disable-next-line arg-overflow
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another address
     * If the target address is a contract, it must implement `onERC721Received`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            _exists(tokenId),
            "ERC721 :: safeTransferFrom : token does not exist"
        );
        transferFrom(from, to, tokenId);
        // solium-disable-next-line arg-overflow
        require(
            _checkOnERC721Received(from, to, tokenId, _data),
            "ERC721 :: safeTransferFrom : onReceivedTokens Failed"
        );
    }

    // function tokenURI(uint256 _tokenId)
    //     public
    //     view
    //     override
    //     returns (string memory _uri)
    // {
    //     string memory baseuri = BASEURI;

    //     // return string(abi.encodePacked(baseuri, temp));
    //     return string(abi.encodePacked(baseuri, _tokenURIs[_tokenId]));
    // }

    /// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
    /// @dev Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC
    ///  3986. The URI may point to a JSON file that conforms to the "ERC721
    ///  Metadata JSON Schema".

    //Neo Pets
    //Pokemon
    /*
    function tok(uint256 _tokenId)
        public
        view
        
        returns (bytes memory _uri)
    {
        require(_exists(_tokenId), "ERC721 :: tokenURI : token does not exist");
        string memory temp = new string(50);
        string memory baseuri = BASEURI;
        string memory hardcodehash = "QmRjANc5rCFECnc479uccVQUk3jFHzm3DsT5T1oThkaKsn";
        bytes memory bytesTemp; 
       // stringToBytes(96, bytes(hardcodehash), bytesTemp);
       // stringToBytes(_offst, _input, _output);
        bytes memory t;
       // bytes memory bytesTemp = _tokenURIs[_tokenId];
        bytesToString(96, bytesTemp, bytes(temp));
        console.log(temp);
        t = abi.encodePacked(bytes(baseuri), string(bytes(hardcodehash)));
        console.log(string(t));
        bytes[1] memory te = [t];
        return te;
      
    }
    */

    // function setTokenURI(uint256 _tokenId, bytes memory _uri)
    //     public
    //     onlyOwner()
    // {
    //     require(
    //         _exists(_tokenId),
    //         "ERC721 :: setTokenURI : token does not exist"
    //     );
    //     _tokenURIs[_tokenId] = _uri;
    // }

    /*
    function setBulkTokenURI(uint256 _tokenIdStart, uint256 _tokenIdStop, bytes memory _uri) public onlyOwner()
    {

    }
    */

    /*
        function setBulkTokenUris(
        uint256 startToken,
        uint256 quantity,
        bytes[] calldata tokenUriArr
    ) public onlyOwner() {

        require(startToken + quantity <= totalSupply, "setBultTokenUris: Token Not Minted");
        //47 is the hash and you wan to store the hash
        for(uint256 i=startToken; i < startToken + quantity; i++) {

            _tokenURIs[i] = tokenUriArr;
        }
    }
*/

    /// @notice Enumerate NFTs assigned to an owner
    /// @dev Throws if `_index` >= `balanceOf(_owner)` or if
    ///  `_owner` is the zero address, representing invalid NFTs.
    /// @param _owner An address where we are interested in NFTs owned by them
    /// @param _index A counter less than `balanceOf(_owner)`
    /// @return The token identifier for the `_index`th NFT assigned to `_owner`,
    ///   (sort order not specified)

    function tokenOfOwnerByIndex(address _owner, uint256 _index)
        external
        view
        override
        returns (uint256)
    {
        require(
            _index < balanceOf(_owner),
            "ERC721 :: tokenOfOwnerByIndex : owner does not have these many tokens"
        );
        return _holderTokens[_owner].at(_index);
    }

    /// @notice Enumerate valid NFTs
    /// @dev Throws if `_index` >= `totalSupply()`.
    /// @param _index A counter less than `totalSupply()`
    /// @return The token identifier for the `_index`th NFT,
    ///  (sort order not specified)
    function tokenByIndex(uint256 _index)
        external
        view
        override
        returns (uint256)
    {
        require(
            _index < totalSupply,
            "ERC721 :: tokenByIndex : token does not exist"
        );
        return _index;
    }

    /**
     * @dev Returns whether the specified token exists
     * @param tokenId uint256 ID of the token to query the existence of
     * @return whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return (tokenId < totalSupply);
    }

    /**
     * @dev Returns whether the given spender can transfer a given token ID
     * @param spender address of the spender to query
     * @param tokenId uint256 ID of the token to be transferred
     * @return bool whether the msg.sender is approved for the given token ID,
     *  is an operator of the owner, or is the owner of the token
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        address owner = ownerOf(tokenId);
        // Disable solium check because of
        // https://github.com/duaraghav8/Solium/issues/175
        // solium-disable-next-line operator-whitespace
        return (spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
    }

    /**
     * @dev Internal function to mint a new token
     * Reverts if the given token ID already exists
     * @param to The address that will own the minted token
     */
    function mint(address to) public onlyOwner {
        require(
            to != address(0),
            "ERC721 :: _mint : cannot mint to zero address"
        );
        uint256 tokenId = totalSupply;

        // require(tokenId == totalSupply , "ERC721 :: _mint: Token ID should be equal to the Total Supply");

        _addTokenTo(to, tokenId);
        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Internal function to mint bulk tokens starting from current total supply
     * @param quantity Number of tokens needed to be minted
     */
    function mintBulk(uint256 quantity, address to) public onlyOwner {
        uint256 fromTokenId = totalSupply;
        uint256 endTokenId = quantity + totalSupply;
        require(to != address(0));

        for (uint256 i = fromTokenId; i < endTokenId; i++) {
            _holderTokens[to].add(i);
            _tokenOwner[i] = to;
        }

        totalSupply = totalSupply.add(quantity);
        emit ConsecutiveTransfer(fromTokenId, totalSupply - 1, address(0), to);
    }

    // /**
    //  * @dev Internal function to burn a specific token
    //  * Reverts if the token does not exist
    //  * @param tokenId uint256 ID of the token being burned by the msg.sender
    //  */
    // function _burn(address owner, uint256 tokenId) internal {
    //     _clearApproval(owner, tokenId);
    //     _removeTokenFrom(owner, tokenId);
    //     emit Transfer(owner, address(0), tokenId);
    // }

    /**
     * @dev Internal function to add a token ID to the list of a given address
     * Note that this function is left internal to make ERC721Enumerable possible, but is not
     * intended to be called by custom derived contracts: in particular, it emits no Transfer event.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenTo(address to, uint256 tokenId) internal {
        totalSupply = totalSupply.add(1);
        require(
            ownerOf(tokenId) == BURN_ADDRESS || ownerOf(tokenId) == address(0),
            "ERC721 :: _addTokenTo : token already exists"
        );
        _tokenOwner[tokenId] = to;
        _holderTokens[to].add(tokenId);
    }

    /**
     * @dev Withdraw ether from this contract (Callable by owner)
     */
    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    /**
     * @dev Internal function to remove a token ID from the list of a given address
     * Note that this function is left internal to make ERC721Enumerable possible, but is not
     * intended to be called by custom derived contracts: in particular, it emits no Transfer event,
     * and doesn't clear approvals.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFrom(address from, uint256 tokenId) internal {
        require(
            ownerOf(tokenId) == from,
            "ERC721 :: _removeTokenFrom : token not owned by from address"
        );
        _holderTokens[from].remove(tokenId);
        _tokenOwner[tokenId] = BURN_ADDRESS;
        totalSupply = totalSupply.sub(1);
    }

    /**
     * @dev Internal function to invoke `onERC721Received` on a target address
     * The call is not executed if the target address is not a contract
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return whether the call correctly returned the expected magic value
     */

    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal returns (bool) {
        if (!to.isContract()) {
            return true;
        }
        bytes4 retval = IERC721Receiver(to).onERC721Received(
            msg.sender,
            from,
            tokenId,
            _data
        );
        return (retval == _ERC721_RECEIVED);
    }

    /**
     * @dev Private function to clear current approval of a given token ID
     * Reverts if the given address is not indeed the owner of the token
     * @param owner owner of the token
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _clearApproval(address owner, uint256 tokenId) private {
        require(
            ownerOf(tokenId) == owner,
            "ERC721 :: _clearApproval : token not owned by from address"
        );
        if (_tokenApprovals[tokenId] != address(0)) {
            _tokenApprovals[tokenId] = address(0);
        }
    }

    /**
     * @dev Returns name of the NFT at index.
     */
    function tokenNameByIndex(uint256 index)
        public
        view
        returns (string memory)
    {
        return _tokenName[index];
    }

    /**
     * @dev Returns if the name has been reserved.
     */
    function isNameReserved(string memory nameString)
        public
        view
        returns (bool)
    {
        return _nameReserved[toLower(nameString)];
    }

    /**
     * @dev Check if the name string is valid (Alphanumeric and spaces without leading or trailing space)
     */
    function validateName(string memory str) public pure returns (bool) {
        bytes memory b = bytes(str);
        if (b.length < 1) return false;
        if (b.length > 25) return false; // Cannot be longer than 25 characters
        if (b[0] == 0x20) return false; // Leading space
        if (b[b.length - 1] == 0x20) return false; // Trailing space

        bytes1 lastChar = b[0];

        for (uint256 i; i < b.length; i++) {
            bytes1 char = b[i];

            if (char == 0x20 && lastChar == 0x20) return false; // Cannot contain continous spaces

            if (
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x20) //space
            ) return false;

            lastChar = char;
        }

        return true;
    }

    /**
     * @dev Converts the string to lowercase
     */
    function toLower(string memory str) public pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint256 i = 0; i < bStr.length; i++) {
            // Uppercase character
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    /**
     * @dev Changes the name for Hashmask tokenId
     */
    function changeName(uint256 tokenId, string memory newName) public {
        address owner = ownerOf(tokenId);

        require(_msgSender() == owner, "ERC721: caller is not the owner");
        require(validateName(newName) == true, "Not a valid new name");
        require(
            sha256(bytes(newName)) != sha256(bytes(_tokenName[tokenId])),
            "New name is same as the current one"
        );
        require(isNameReserved(newName) == false, "Name already reserved");

        IERC20(_nctAddress).transferFrom(
            msg.sender,
            address(this),
            NAME_CHANGE_PRICE
        );
        // If already named, dereserve old name
        if (bytes(_tokenName[tokenId]).length > 0) {
            toggleReserveName(_tokenName[tokenId], false);
        }
        toggleReserveName(newName, true);
        _tokenName[tokenId] = newName;
        IERC20(_nctAddress).burn(NAME_CHANGE_PRICE);
        emit NameChange(tokenId, newName);
    }

    function toggleReserveName(string memory str, bool isReserve) internal {
        _nameReserved[toLower(str)] = isReserve;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return _ERC721_RECEIVED;
    }
}
