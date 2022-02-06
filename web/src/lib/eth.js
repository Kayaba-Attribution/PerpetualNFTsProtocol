import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

// import abiMuseum from "./abi/contracts/Museum.sol/Museum.json";

import abiMuseum from "./abi/Museum.json";
import abiNFT from "./abi/Perpetual.json";

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
export const museumBalance = writable(0);
export const wrongNetwork = writable(true);
export const tokenApproved = writable(false);
export const signer = writable();
export const balanceETH = writable(0);
export const totalSupply = writable(0);

export const nfts = writable([]);
export const nftsInMuseum = writable([]);

const NET_ADDRESS = {
  80001: {
    museum: '0x8104AECa7bE988437d033aF58a171A53119648Ce',
    treasury: '0x11f7E9E4053BDDF9062fE4A227d91521551490bD',
    perpetual: '0x5f67b1eCC8C855bFbF6Ea051853D67e266f5e278'
  },
  31337: {  
    museum: '0xf219d840AA063d406Ecbcb5A6f0173CD8Dc9553f',
    treasury: '0x88876ccD4DC83c990aC59B3106E313562c8bc747',
    perpetual: '0x6f53118cdAC5726b1B4671c3F4fae024163eD042'
  }
};

export const ADDRESS = NET_ADDRESS[CHAIN_ID];

let _metamaskReady = () => {};

export const metamaskReady = writable(new Promise((resolve) => {
  _metamaskReady = resolve;
}));

// testnet
// {
//   museum: '0x8104AECa7bE988437d033aF58a171A53119648Ce',
//   treasury: '0x11f7E9E4053BDDF9062fE4A227d91521551490bD',
//   perpetual: '0x5f67b1eCC8C855bFbF6Ea051853D67e266f5e278'
// }

    
function reset() {
  wallet.set('');
  balance.set(0);
  museumBalance.set(0);
  wrongNetwork.set(true);
  tokenApproved.set(false);
  signer.set();
  balanceETH.set(0);
  totalSupply.set(0);

  nfts.set([]);
  nftsInMuseum.set([]);

  metamaskReady.set(new Promise((resolve) => { _metamaskReady = resolve; }));

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
  contracts.perpetual = new Contract(ADDRESS.perpetual, abiNFT, _signer);

  
  const _tokenApproved = await contracts.perpetual.isApprovedForAll(_wallet, ADDRESS.museum);
  tokenApproved.set(_tokenApproved);

  balanceETH.set(await _signer.provider.getBalance(_wallet));

  const _balance = await contracts.perpetual.balanceOf(_wallet);
  balance.set(_balance);

  totalSupply.set(await contracts.perpetual.totalSupply());

  museumBalance.set(await contracts.museum.totalNFTS(_wallet));
  
  const _promises = [];
  
  for (let i = 0; i < _balance; i++) {
    _promises.push(contracts.perpetual.tokenOfOwnerByIndex(_wallet, String(i)));
  }

  contracts.museum.depositedNFTs(_wallet).then(nfts => {
    nftsInMuseum.set(nfts.map(nft => nft.toNumber()));
  });
  
  let _nfts = await Promise.all(_promises);
  _nfts = _nfts.map(nft => nft.toNumber());
  nfts.set(_nfts);

  loadHooks();
  _metamaskReady();
}


export async function pickNetwork() {
  await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX }] });
}

