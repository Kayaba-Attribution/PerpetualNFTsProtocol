<script context="module">
	export const prerender = true;
</script>

<script>
	import { nfts, wallet, loginMetamask, init, wrongNetwork, pickNetwork, contracts, balance } from '$lib/eth.js';
	import { onMount } from 'svelte';
	import { parseEther } from '@ethersproject/units';
	
	onMount(() => {
		try {
			init();
		} catch(err) {
			/* empty */
		}
	});

	let minteando = false;
	async function mint() {
		try {
			const tx = await contracts.myToken.mint({value: parseEther('1')});
			minteando = true;
			await tx.wait(1);
		} catch (err) {}
		minteando = false;
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
		<button on:click={() => pickNetwork('0x7A69')}>CHANGE TO HARDHAT</button>
	{/if}
	<h2>
		tienes {$balance} NFTs
	</h2>
	{#if !minteando}
		<button on:click={() => mint()}>comprar nft</button>
	{:else}
		minteando, aguanta la mecha
	{/if}

	<ul> 
		{#each $nfts as nft}
			<li>
				#{nft}
				<button>depositar #{nft} en museo como colateral</button>
			</li>
		{/each}
	</ul>
{:else}
	<button on:click={loginMetamask}>boton de conectar</button>
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
