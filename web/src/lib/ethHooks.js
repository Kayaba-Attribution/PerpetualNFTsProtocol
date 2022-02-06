import { contracts, wallet, ADDRESS, nfts, tokenApproved, balance, balanceETH, signer, nftsInMuseum, museumBalance, totalSupply } from "./eth";
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
    const _balance = await get(balance);
    balance.set(Number(_balance) + 1);
  } else if (from === _wallet) {
    const _nfts = await get(nfts);
    nfts.set([..._nfts.filter(tokenId => Number(tokenId) !== Number(value))]);
    const _balance = await get(balance);
    balance.set(Number(_balance) - 1);
  }

  if (from == _wallet && to == ADDRESS.museum) {
    const _nfts = await get(nftsInMuseum);
    console.log('agregando nft', Number(value));
    _nfts.push(Number(value));
    nftsInMuseum.set([..._nfts]);
    const _museumBalance = await get(museumBalance);
    museumBalance.set(Number(_museumBalance) + 1);
  }
  if (from == ADDRESS.museum && to == _wallet) {
    const _nfts = await get(nftsInMuseum);
    nftsInMuseum.set([..._nfts.filter(id => id !== Number(value))]);
    const _museumBalance = await get(museumBalance);
    museumBalance.set(Number(_museumBalance) - 1);
  }

  if (from == '0x0000000000000000000000000000000000000000') {
    const _totalSupply = await get(totalSupply);
    totalSupply.set(Number(_totalSupply) + 1);
  } else if (to == '0x0000000000000000000000000000000000000000') {
    const _totalSupply = await get(totalSupply);
    totalSupply.set(Number(_totalSupply) - 1);
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