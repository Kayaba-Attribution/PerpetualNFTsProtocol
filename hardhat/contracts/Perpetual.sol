//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./Treasury.sol";

contract Perpetual is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Treasury public treasury;

    Counters.Counter private _tokenIdCounter;

     mapping (uint256 => uint256) private _nftValue;

    // address public treasury;

    constructor(address payable _treasury) ERC721("Perpetual", "PERP") {
        //treasury = _treasury;
        treasury = Treasury(_treasury);
    }

    function nftValue(uint256 tokenId) public view returns(uint256) {
        // default value
        // return 1 ether;
        return _nftValue[tokenId];
    }

    function mint() public payable {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < 99, "No more than 100 Perpetuals can be minted");
        require(msg.value >= 1 ether, "Must send at least 1 ether");
        treasury.depositAAVE{value: 1 ether}();
        _tokenIdCounter.increment();
        _nftValue[tokenId] = 1 ether;
        _safeMint(msg.sender, tokenId);
        if (msg.value < 1 ether) {
            uint256 _changeBack = msg.value - 1 ether;
            Address.sendValue(payable(msg.sender), _changeBack);
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}