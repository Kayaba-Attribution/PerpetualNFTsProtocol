<script>


import { onMount } from 'svelte';

import { contracts, metamaskReady, wallet } from '$lib/eth.js';
import InfoSquare from '$lib/loans/infoSquare.svelte';
import TakeLoan from '$lib/loans/takeLoan.svelte';
import RepayLoan from '$lib/loans/repayLoan.svelte';
import WithdrawCollateral from '$lib/loans/withdrawCollateral.svelte';

let loading = true;

let currentDebt;
let currentCollateral;
let healthFactor;
let maxBorrow;

let select = 'take';

async function reloadDebt(from, value) {
	if (from == $wallet) {
		await loadDebt();
	}
}

onMount(async () => {
	await $metamaskReady;

	await loadDebt();
	
	let response = await fetch('https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=matic&key=ckey_814a704909fe46aca8efc7cb84b');
	response = await response.json();
	maticSpotPrice = response.data.items[0].quote_rate;
	
	loading = false;

	contracts.museum.on('Borrow', reloadDebt);
	contracts.museum.on('Repay', reloadDebt);
	contracts.museum.on('Withdraw', reloadDebt);

	return () => {
		contracts.museum.off('Borrow', reloadDebt);
		contracts.museum.off('Repay', reloadDebt);
		contracts.museum.off('Withdraw', reloadDebt);
	};
});

async function loadDebt() {
	currentDebt = await contracts.museum.totalDebt($wallet);
	currentCollateral = await contracts.museum.collateralAmount($wallet);
	
	healthFactor = currentDebt.gt(0) ? Number(currentDebt.mul(10000).div(currentCollateral)) / 100 : 0;

	maxBorrow = currentCollateral.div(2).sub(currentDebt);
	maxBorrow = maxBorrow.lt(0) ? 0 : maxBorrow;
}

let maticSpotPrice;


</script>

<svelte:head>
	<title>Loans</title>
</svelte:head>

<div class="content">
	<div class="flex ">
		<h1 class="flex-grow text-left">Dashboard</h1>
		<span class="text-md pt-5">Current Health Factor: {healthFactor}%</span>
	</div>

	{#if !loading}
		{#if healthFactor > 50}
			<div class="bg-red-200 my-5 border-red-600 text-red-600 border-l-4 p-4" role="alert">
				<p class="font-bold">
					Liquidation Warning!
				</p>
				<p>
					Your Health Factor is {healthFactor}%!
				</p>
			</div>
		{/if}



		<div class="grid grid-cols-3 gap-4">
			<!--
				_____      _ _       _                 _  __      __   _            
				/ ____|    | | |     | |               | | \ \    / /  | |           
				| |     ___ | | | __ _| |_ ___ _ __ __ _| |  \ \  / /_ _| |_   _  ___ 
				| |    / _ \| | |/ _` | __/ _ \ '__/ _` | |   \ \/ / _` | | | | |/ _ \
				| |___| (_) | | | (_| | ||  __/ | | (_| | |    \  / (_| | | |_| |  __/
				\_____\___/|_|_|\__,_|\__\___|_|  \__,_|_|     \/ \__,_|_|\__,_|\___|
			-->                  
			<InfoSquare title="Collateral Value" value={currentCollateral} {maticSpotPrice} />
			<!-- 
									____                                       _ 
									|  _ \                                     | |
									| |_) | ___  _ __ _ __ _____      _____  __| |
									|  _ < / _ \| '__| '__/ _ \ \ /\ / / _ \/ _` |
									| |_) | (_) | |  | | | (_) \ V  V /  __/ (_| |
									|____/ \___/|_|  |_|  \___/ \_/\_/ \___|\__,_|

			-->
			<InfoSquare title="Borrowed" value={currentDebt} {maticSpotPrice} />
		
			<!-- 
										__  __              ____                               
									|  \/  |            |  _ \                              
									| \  / | __ ___  __ | |_) | ___  _ __ _ __ _____      __
									| |\/| |/ _` \ \/ / |  _ < / _ \| '__| '__/ _ \ \ /\ / /
									| |  | | (_| |>  <  | |_) | (_) | |  | | | (_) \ V  V / 
									|_|  |_|\__,_/_/\_\ |____/ \___/|_|  |_|  \___/ \_/\_/ 
			-->
			<InfoSquare title="Max Borrow" value={maxBorrow} {maticSpotPrice} />
			
		
	</div>
		{#if currentCollateral.gt(0)}
		<div class="flex flex-grow justify-center my-4">
			{#each [
				{val: 'take', text: 'Take a loan' },
				{val: 'repay', text: 'Repay loan' },
				{val: 'withdraw', text: 'Widthdraw collateral' }
			] as btn}
				<button type="button" class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:shadow-lg rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2"
				class:bg-gray-100={select == btn.val}
				class:shadow-lg={select == btn.val}
				class:border-blue-200={select == btn.val}
				on:click={() => select = btn.val}>
					{btn.text}
				</button>
			{/each}
		</div>
			{#if select == 'take'}
				<TakeLoan {healthFactor} {currentCollateral} {currentDebt} {maticSpotPrice} />
			{:else if select == 'repay'}
				<RepayLoan {healthFactor} {currentCollateral} {currentDebt} {maticSpotPrice} />
			{:else if select == 'withdraw'}
				<WithdrawCollateral {healthFactor} {currentCollateral} {currentDebt} />
			{/if}
		{:else}
			<h1 class="my-8">Please deposit a Perpetual as collateral to take loans.</h1>
		{/if}
	{:else}
	<h1 class="text-5xl text-gray-700 ">LOADING...</h1>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
		<path fill="none" stroke="#0a0a0a" stroke-width="8" stroke-dasharray="42.76482137044271 42.76482137044271" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" stroke-linecap="round" style="transform:scale(0.8);transform-origin:50px 50px">
		  <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.1363636363636365s" keyTimes="0;1" values="0;256.58892822265625"></animate>
		</path>
		</svg>
	{/if}
</div>


<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}

</style>
