<script context="module">
	export const prerender = true;
</script>

<script>
	import { nfts, wallet, tokenApproved, wrongNetwork, pickNetwork, contracts, balance } from '$lib/eth.js';
	import { parseEther } from '@ethersproject/units';
	
	let minteando = false;
	async function mint() {
		try {
			const tx = await contracts.myToken.mint({value: parseEther('1')});
			minteando = true;
			await tx.wait(1);
		} catch (err) {}
		minteando = false;
	}

	let wait = {};

	async function addCollateral(nftId) {
		try {
			const tx = await contracts.museum.deposit(String(nftId));
			wait[nftId] = true;
			wait = {...wait};
			await tx.wait();
		} catch(err) {
		}
		wait[nftId] = false;
		wait = {...wait};
	}

	async function approve() {
		try {
			const tx = await contracts.myToken.setApprovalForAll(contracts.museum.address, true);
			
			wait.approve = true;
			wait = {...wait};
			await tx.wait();
		} catch(err) {
			console.log(err)
		}
		wait.approve = false;
		wait = {...wait};
	}

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<!-- create a screen -->
	<p>{$wallet}</p>
{#if $wallet}
	<h1>HOLA {$wallet}	</h1>

	{#if $wrongNetwork}
		estas en al red equivocada
		<button on:click={() => pickNetwork()}>CHANGE TO HARDHAT</button>
	{/if}
	<h2>
		tienes {$balance} NFTs
	</h2>
	{#if !minteando}
		<button on:click={() => mint()}>comprar nft</button>
	{:else}
		minteando, aguanta la mecha
	{/if}
	<div class="flex w-full">
		<div class="flex w-full">
			{#each $nfts as nft}
				<div class="w-1/3 p-10 text-center">
					<img src="/tokens/{nft}.jpeg" class="rounded" />
					{#if !$tokenApproved}
						<button class="border rounded hover:bg-gray-200 border-gray-400 cursor-pointer py-2 px-4 mt-2"
						class:cursor-wait={wait.approve}
						on:click={()=> approve()}>Approve Museum</button>
					{:else}
						<button class="border rounded hover:bg-gray-200 border-gray-400 cursor-pointer py-2 px-4 mt-2"
						class:cursor-wait={wait[nft]}
						on:click={()=> addCollateral(nft)}>add as colateral</button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{:else}
	<!-- <button on:click={loginMetamask}>boton de conectar</button> -->
{/if}



		

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
