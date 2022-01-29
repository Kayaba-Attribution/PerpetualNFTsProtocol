//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address public treasury;

    constructor(address _treasury) ERC721("MyToken", "MTK") {
        treasury = _treasury;
    }

    function nftValue() public pure returns(uint256) {
        return 1 ether;
    }

    function mint() public payable {
        require(msg.value == nftValue(), "Must send at least 1 ether");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        // transfer ether to the treasury
        (bool success, ) = payable(treasury).call{value: nftValue()}("");
        require(success, "mint fail");
    }
}