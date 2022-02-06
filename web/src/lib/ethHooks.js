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
  const _signer = await get(signer);
  // upgrade balance
  balanceETH.set(await _signer.provider.getBalance(_wallet));
}


export default function loadHooks() {
  contracts.myToken.off("ApprovalForAll");
  contracts.myToken.on("ApprovalForAll", approvalHook);

  contracts.myToken.off("Transfer");
  contracts.myToken.on("Transfer", transferHook);
}