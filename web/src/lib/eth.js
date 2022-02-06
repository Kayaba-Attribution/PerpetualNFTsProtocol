import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

// import abiMuseum from "./abi/contracts/Museum.sol/Museum.json";

import abiMuseum from "./abi/Museum.json";
import abiNFT from "./abi/contracts/NFT.sol/MyToken.json";

import { derived, writable, get } from "svelte/store";

const CHAIN_ID = 31337;
const CHAIN_HEX = '0x'+CHAIN_ID.toString(16);

let provider;

export const contracts = {};

export const wallet = writable('');
export const balance = writable(0);
export const wrongNetwork = writable(true);
export const tokenApproved = writable(false);
export const signer = writable();
export const balanceETH = writable(0);


export const nfts = writable([]);
export const nftsInMuseum = writable([]);

const ADDRESS = {
  museum: '0x8816a73899B87cFb6f57AB564d7eb44B5B137E98',
  treasury: '0x541529BC6480002727707c42051f536229cD7f65',
  myToken: '0xd61fDdE15b245dDB947C400643149C49CDd5f3A2'
}

    

export function loginMetamask() {
  window.ethereum.enable();
  init();
}

let INIT = false;

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

  if (INIT) {
    return;
  }

  INIT = true;

  const _networkDetails = await provider.getNetwork();
  // networkDetails.set(_networkDetails);
  if (_networkDetails.chainId !== CHAIN_ID) {
    wrongNetwork.set(true);
    return;
  } else {
    wrongNetwork.set(false);
  }

  let _signer, _wallet;
  try {
    _signer = await provider.getSigner();
    _wallet = await _signer.getAddress();
    wallet.set(_wallet);
  } catch(err) {
    console.error(err);
    // probably not log in with metamask
    return;
  }
  signer.set(_signer);

  contracts.museum = new Contract(ADDRESS.museum, abiMuseum, _signer);
  contracts.myToken = new Contract(ADDRESS.myToken, abiNFT, _signer);

  const _tokenApproved = await contracts.myToken.isApprovedForAll(_wallet, ADDRESS.museum);
  tokenApproved.set(_tokenApproved);

  contracts.myToken.on("ApprovalForAll", (owner, operator, approved) => {
    if(owner === _wallet && operator === ADDRESS.museum) {
      tokenApproved.set(approved);
    }
  });

  balanceETH.set(await _signer.provider.getBalance(_wallet));


  const _balance = await contracts.myToken.balanceOf(_wallet);
  balance.set(_balance);

  const _promises = [];
  
  for (let i = 0; i < _balance; i++) {
    _promises.push(contracts.myToken.tokenOfOwnerByIndex(_wallet, String(i)));
  }

  contracts.museum.depositedNFTs(_wallet).then(nfts => {
    nftsInMuseum.set(nfts.map(nft => nft.toNumber()));
  });
  
  let _nfts = await Promise.all(_promises);
  _nfts = _nfts.map(nft => nft.toNumber());
  nfts.set(_nfts);

  contracts.myToken.on("Transfer", async (from, to, value) => {
    if (to === _wallet) {
      const _nfts = await get(nfts);
      _nfts.push(value);
      nfts.set([..._nfts]);
      balance.set(await contracts.myToken.balanceOf(_wallet));
    } else if (from === _wallet) {
      const _nfts = await get(nfts);
      nfts.set([..._nfts.filter(tokenId => Number(tokenId) !== Number(value))]);
      balance.set(await contracts.myToken.balanceOf(_wallet));
    }

    if (from == _wallet && to == ADDRESS.museum) {
      const _nfts = await get(nftsInMuseum);
      console.log('agregando nft', Number(value));
      _nfts.push(Number(value));
      nftsInMuseum.set([..._nfts]);
    }

    if (from == ADDRESS.museum && to == _wallet) {
      const _nfts = await get(nftsInMuseum);
      nftsInMuseum.set([..._nfts.filter(id => id !== Number(value))]);
    }
    // upgrade balance
    balanceETH.set(await _signer.provider.getBalance(_wallet));
  });

}

export async function pickNetwork() {
  await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX }] });
}

