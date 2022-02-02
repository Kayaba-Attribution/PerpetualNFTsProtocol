import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

import abiMuseum from "./abi/contracts/Museum.sol/Museum.json";
import abiNFT from "./abi/contracts/NFT.sol/MyToken.json";

import { derived, writable, get } from "svelte/store";

// const CHAIN_ID = 31337;
const CHAIN_ID = 31337;

let provider;

export const contracts = {};

export const wallet = writable();
export const balance = writable(0);
export const wrongNetwork = writable(true);

export const nfts = writable([]);

const ADDRESS = {
  museum: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
  treasury: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  myToken: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'
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


  contracts.museum = new Contract(ADDRESS.museum, abiMuseum, _signer);
  contracts.myToken = new Contract(ADDRESS.myToken, abiNFT, _signer);

  const _networkDetails = await provider.getNetwork();
  // networkDetails.set(_networkDetails);
  
  if (_networkDetails.chainId !== CHAIN_ID) {
    wrongNetwork.set(true);
    return;
  } else {
    wrongNetwork.set(false);
  }

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

export async function pickNetwork(chainHexa) {
  await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chainHexa }] });
}

