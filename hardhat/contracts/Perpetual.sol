//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Treasury.sol";

contract Perpetual is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Treasury public treasury;

    Counters.Counter private _tokenIdCounter;

    // address public treasury;

    constructor(address payable _treasury) ERC721("Perpetual", "PERP") {
        //treasury = _treasury;
        treasury = Treasury(_treasury);
    }

    function nftValue(uint256 _id) public pure returns(uint256) {
        // default value
        return 1 ether;
    }

    function mint() public payable {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < 99, "No more than 100 Perpetuals can be minted");
        require(msg.value == nftValue(tokenId), "Must send at least 1 ether");
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        treasury.depositAAVE{value: msg.value}();
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