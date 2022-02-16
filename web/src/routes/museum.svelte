<script>
import { fade } from 'svelte/transition';
import { onMount } from 'svelte';
import { base } from '$app/paths';

import { contracts, metamaskReady, wallet, wrongNetwork, pickNetwork } from '$lib/eth.js';

let nftsGetLoading = true;

let museumNfts = [];

onMount(async () => {
	await $metamaskReady;
	const _balance = await contracts.perpetual.balanceOf(contracts.museum.address);
  
  const _promises = [];
  
  for (let i = 0; i < _balance; i++) {
    _promises.push(contracts.perpetual.tokenOfOwnerByIndex(contracts.museum.address, String(i)));
  }

  museumNfts = await Promise.all(_promises);
  museumNfts = museumNfts.map(nft => nft.toNumber());
  
	museumNfts = await Promise.all(museumNfts.map(async (tokenId) => {
		const owner = await contracts.museum.collateralNFTOwner(tokenId);
		return {
			tokenId,
			owner,
		};
	}));

	nftsGetLoading = false;
})

</script>

<svelte:head>
	<title>Museum</title>
</svelte:head>

<div class="container px-6 py-16 mx-auto text-center">

	<h1>Perpetual Art Gallery</h1>
	
	<p>
		Here you can see al the currently NFTs used as collateral as well as the NFTs that have been liquidated and passed to be "Perpetual"
	</p>
	{#if $wrongNetwork}
	<button on:click={() => pickNetwork()} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
		Change Network To Polygon Mumbai
	</button>
	{:else if $wallet}
		{#if nftsGetLoading}
			<h1 class="text-5xl text-gray-700 ">Loading art... plase wait</h1>
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
			<path fill="none" stroke="#0a0a0a" stroke-width="8" stroke-dasharray="42.76482137044271 42.76482137044271" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" stroke-linecap="round" style="transform:scale(0.8);transform-origin:50px 50px">
			  <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.1363636363636365s" keyTimes="0;1" values="0;256.58892822265625"></animate>
			</path>
			</svg>
		{:else}
			<div class="flex w-full">
				<div class="flex w-full">
					{#each museumNfts as nft}
						<div class="w-1/3 p-10 text-center" transition:fade|local>
							<h1 class="pb-4 italic text-2xl font-semibold text-gray-700 capitalize">Perpetual #{nft.tokenId}</h1>
							<img src="{base}/tokens/{nft.tokenId}.jpeg" class="rounded" alt="Perpetual #{nft.tokenId}" />
							<h2 class="text-xl py-2 px-4 mt-2">#{nft.tokenId}
								lend by 
								{#if nft.owner == $wallet}
									YOU
								{:else}
									{nft.owner.slice(0,4)}...{nft.owner.slice(-4)}
								{/if}
							</h2>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<h3 class="text-2xl sm:text-xl font-semiboldtext-gray-100 py-4">
			Please Connect Your Wallet To See The Museum
		</h3>
		<p>(Top Right Corner)</p>
	{/if}
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
