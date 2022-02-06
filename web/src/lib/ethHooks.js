import { contracts, wallet, ADDRESS, nfts, tokenApproved, balance, balanceETH, signer, nftsInMuseum } from "./eth";
import { get } from "svelte/store";

async function approvalHook (owner, operator, approved) {
  const _wallet = await get(wallet);
  if(owner === _wallet && operator === ADDRESS.museum) {
    tokenApproved.set(approved);
  }
}

async function transferHook(from, to, value) {
  const _wallet = await get(wallet);
  if (to === _wallet) {
    const _nfts = await get(nfts);
    _nfts.push(value);
    nfts.set([..._nfts]);
    balance.set(await contracts.perpetual.balanceOf(_wallet));
  } else if (from === _wallet) {
    const _nfts = await get(nfts);
    nfts.set([..._nfts.filter(tokenId => Number(tokenId) !== Number(value))]);
    balance.set(await contracts.perpetual.balanceOf(_wallet));
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
  const _signer = await get(signer);
  // upgrade balance
  balanceETH.set(await _signer.provider.getBalance(_wallet));
}

let hooksLoaded = false;

export default function loadHooks() {
  if(hooksLoaded) return;
  hooksLoaded = true;
  contracts.perpetual.off("ApprovalForAll");
  contracts.perpetual.on("ApprovalForAll", approvalHook);

  contracts.perpetual.off("Transfer");
  contracts.perpetual.on("Transfer", transferHook);
}