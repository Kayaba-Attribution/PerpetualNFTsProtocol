<script>

import { onMount } from 'svelte';

import { contracts, init, wallet } from '$lib/eth.js';

let nftsGetLoading = true;

let museumNfts = [];

onMount(async () => {
	await init();
	const _balance = await contracts.myToken.balanceOf(contracts.museum.address);
  
  const _promises = [];
  
  for (let i = 0; i < _balance; i++) {
    _promises.push(contracts.myToken.tokenOfOwnerByIndex(contracts.museum.address, String(i)));
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

<div class="content">

	<h1>Art showing in museum</h1>
	
	<p>
		lorem ipsum factum, lorem ipsum factum lorem ipsum factum, lorem ipsum factum
	</p>

	{#if nftsGetLoading}
		Loading art... plase wait
	{:else}
		<div class="flex w-full">
			<div class="flex w-full">
				{#each museumNfts as nft}
					<div class="w-1/3 p-10 text-center">
						<img src="/tokens/{nft.tokenId}.jpeg" class="rounded" />
						<h2 class="text-xl py-2 px-4 mt-2">#{nft.tokenId} lend by {nft.owner.slice(0,4)}...{nft.owner.slice(-4)}</h2>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
