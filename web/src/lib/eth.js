import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

import abiMuseum from "./abi/contracts/Museum.sol/Museum.json";
import abiNFT from "./abi/contracts/NFT.sol/MyToken.json";

import { derived, writable, get } from "svelte/store";

const CHAIN_ID = 31337;
const CHAIN_HEX = '0x'+CHAIN_ID.toString(16);

let provider;

export const contracts = {};

export const wallet = writable();
export const balance = writable(0);
export const wrongNetwork = writable(true);
export const tokenApproved = writable(false);

export const nfts = writable([]);

const ADDRESS = {
  museum: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  treasury: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  myToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
}



export function loginMetamask() {
  window.ethereum.enable();
  init();
}

export async function init() {
  if (!provider) {
    provider = new Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        setTimeout(() => {
          init();
        }, 0);
      }
    });

    window.ethereum.on("accountsChanged", () => {
      setTimeout(() => {
        init();
      }, 0);
    });
  }

  const _signer = await provider.getSigner();
  const _wallet = await _signer.getAddress();
  wallet.set(_wallet);
  // signer.set(_signer);

  const _networkDetails = await provider.getNetwork();
  // networkDetails.set(_networkDetails);
  if (_networkDetails.chainId !== CHAIN_ID) {
    wrongNetwork.set(true);
    return;
  } else {
    wrongNetwork.set(false);
  }

  contracts.museum = new Contract(ADDRESS.museum, abiMuseum, _signer);
  contracts.myToken = new Contract(ADDRESS.myToken, abiNFT, _signer);

  const _tokenApproved = await contracts.myToken.isApprovedForAll(_wallet, ADDRESS.museum);
  tokenApproved.set(_tokenApproved);

  contracts.myToken.on("ApprovalForAll", (owner, operator, approved) => {
    if(owner === _wallet && operator === ADDRESS.museum) {
      tokenApproved.set(approved);
    }
  });

  const _balance = await contracts.myToken.balanceOf(_wallet);
  balance.set(_balance);

  const _promises = [];
  
  for (let i = 0; i < _balance; i++) {
    _promises.push(contracts.myToken.tokenOfOwnerByIndex(_wallet, String(i)));
  }

  let _nfts = await Promise.all(_promises);
  _nfts = _nfts.map(nft => nft.toNumber());
  nfts.set(_nfts);

  contracts.myToken.on("Transfer", async (from, to, value) => {
    if (to === _wallet) {
      const _nfts = await get(nfts);
      _nfts.push(value);
      nfts.set(_nfts);     
      balance.set(await contracts.myToken.balanceOf(_wallet));
    } else if (from === _wallet) {
      const _nfts = await get(nfts);
      nfts.set(_nfts.filter(tokenId => tokenId !== value));
      balance.set(await contracts.myToken.balanceOf(_wallet));
    }
  });


}

export async function pickNetwork() {
  await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX }] });
}

