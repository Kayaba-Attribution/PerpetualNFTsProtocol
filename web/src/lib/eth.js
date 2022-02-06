import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

// import abiMuseum from "./abi/contracts/Museum.sol/Museum.json";

import abiMuseum from "./abi/Museum.json";
import abiNFT from "./abi/contracts/NFT.sol/MyToken.json";

import { writable } from "svelte/store";
import loadHooks from "./ethHooks";

// test net
const CHAIN_ID = 80001;

// HardHat
//const CHAIN_ID = 31337;
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

export const ADDRESS = {
  museum: '0x8104AECa7bE988437d033aF58a171A53119648Ce',
  treasury: '0x11f7E9E4053BDDF9062fE4A227d91521551490bD',
  myToken: '0x5f67b1eCC8C855bFbF6Ea051853D67e266f5e278'
}

// testnet
// {
//   museum: '0x8104AECa7bE988437d033aF58a171A53119648Ce',
//   treasury: '0x11f7E9E4053BDDF9062fE4A227d91521551490bD',
//   myToken: '0x5f67b1eCC8C855bFbF6Ea051853D67e266f5e278'
// }

    
function reset() {
  wallet.set('');
  balance.set(0);
  wrongNetwork.set(true);
  tokenApproved.set(false);
  signer.set();
  balanceETH.set(0);

  nfts.set([]);
  nftsInMuseum.set([]);

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
          reset();
          init();
        }, 0);
      }
    });

    window.ethereum.on("accountsChanged", () => {
      setTimeout(() => {
        reset();
        init();
      }, 0);
    });
  }

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

  loadHooks();
}


export async function pickNetwork() {
  await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX }] });
}

