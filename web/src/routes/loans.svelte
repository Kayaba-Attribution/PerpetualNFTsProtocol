<script>


import { onMount } from 'svelte';

import { formatEther } from '@ethersproject/units';
import { contracts, init, wallet } from '$lib/eth.js';

let loading = true;

let currentDebt;
let currentCollateral;
let healthFactor;
let maxBorrow;
let pct = 0;

let borrowAmount;
$: if(pct) {
	borrowAmount = maxBorrow.div(100).mul(Math.round(pct));
} else {
	borrowAmount = 0;
}


onMount(async () => {
	await init();
	
	await loadDebt();

	await fetch('https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=matic&key=ckey_814a704909fe46aca8efc7cb84b')
		.then((response) => response.json())
		.then((call) => {
			maticSpotPrice = call.data.items[0].quote_rate;
		})

	loading = false;
});

async function loadDebt() {
	currentDebt = await contracts.museum.totalDebt($wallet);
	currentCollateral = await contracts.museum.collateralAmount($wallet);

	healthFactor = currentDebt.gt(0) ? Number(currentDebt.mul(10000).div(currentCollateral)) / 100 : 0;

	maxBorrow = currentCollateral.div(2).sub(currentDebt);
	maxBorrow = maxBorrow.lt(0) ? 0 : maxBorrow;
}


let borrowing = false;
async function borrow() {
	try {
		const tx = await contracts.museum.borrow(borrowAmount);
		borrowing = true;
		await tx.wait(1);
		pct = 0;
		await loadDebt();
	} catch (err) {
		console.log(err);
	}
	borrowing = false;
}

let maticSpotPrice;

function BigNumMaticToUsd(value) {
	return (maticSpotPrice * Number(formatEther(value))).toFixed(3)
}

function  BigNumFixed(value, n) {
	return Number(formatEther(value)).toFixed(n)
	
}

</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="content">
	<h1>Dashboard</h1>

	{#if !loading}
		{#if healthFactor > 50}
			<div class="bg-red-200 my-5 border-red-600 text-red-600 border-l-4 p-4" role="alert">
				<p class="font-bold">
					Liquidation Warning!
				</p>
				<p>
					Your Health Factor is Over 50%
				</p>
			</div>
		{/if}


		<!-- <p>{maticSpotPrice}</p>
		<table>
			<tbody>
				<tr>
					<td class="w-full">Collateral value: </td>
					<td>{formatEther(currentCollateral)}</td>
				</tr>
				<tr>
					<td class="w-full">Borrowed: </td>
					<td>{formatEther(currentDebt)}</td>
				</tr>
				<tr>
					<td class="w-full">Health factor: </td>
					<td>{healthFactor.toFixed(2)}%</td>
				</tr>
				<tr>	
					<td class="w-full">Max borrow: </td>
					<td>{formatEther(maxBorrow)}</td>
				</tr>
			</tbody>
		</table>

		<b>{borrowAmount ? formatEther(borrowAmount) : '---'}</b><hr />
		<input type="range" bind:value={pct} min="0" max="100" step="any" />
		<br />
		<button on:click={borrow} 
		class="border rounded hover:bg-gray-200 border-gray-400 cursor-pointer py-2 px-4 mt-2"
		class:disabled={borrowing}
		class:cursor-wait={borrowing}>
		Take loan</button>	
<br /> -->
<!--
				  _____      _ _       _                 _  __      __   _            
			     / ____|    | | |     | |               | | \ \    / /  | |           
				| |     ___ | | | __ _| |_ ___ _ __ __ _| |  \ \  / /_ _| |_   _  ___ 
				| |    / _ \| | |/ _` | __/ _ \ '__/ _` | |   \ \/ / _` | | | | |/ _ \
				| |___| (_) | | | (_| | ||  __/ | | (_| | |    \  / (_| | | |_| |  __/
				 \_____\___/|_|_|\__,_|\__\___|_|  \__,_|_|     \/ \__,_|_|\__,_|\___|
-->                  
	<div class="grid grid-cols-3 gap-4">
		<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800" hover:bg-sky-700>
			<div class="flex items-center">
				<span class="rounded-xl relative p-4 bg-purple-200">
					<svg width="40" fill="currentColor" height="40" class="text-purple-500 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
						<path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
						</path>
					</svg>
				</span>
				<p class="text-md text-black dark:text-white ml-2">
					Collateral Value
				</p>
			</div>
			<div class="flex flex-col justify-start">
				<p class="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
					{BigNumMaticToUsd(currentCollateral)}
					<span class="text-sm">
						USD
					</span>
				</p>
			</div>
			<div class="flex items-center text-gray-700 dark:text-gray-100 text-sm">
				<span>
					{formatEther(currentCollateral)} MATIC
				</span>
			</div>
		</div>

<!-- 
						 ____                                       _ 
						|  _ \                                     | |
						| |_) | ___  _ __ _ __ _____      _____  __| |
						|  _ < / _ \| '__| '__/ _ \ \ /\ / / _ \/ _` |
						| |_) | (_) | |  | | | (_) \ V  V /  __/ (_| |
						|____/ \___/|_|  |_|  \___/ \_/\_/ \___|\__,_|

 -->
		<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800">
			<div class="flex items-center">
				<span class="rounded-xl relative p-4 bg-purple-200">
					<svg width="40" fill="currentColor" height="40" class="text-purple-500 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
						<path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
						</path>
					</svg>
				</span>
				<p class="text-md text-black dark:text-white ml-2">
					Borrowed
				</p>
			</div>
			<div class="flex flex-col justify-start">
				<p class="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
					{BigNumMaticToUsd(currentDebt)}
					<span class="text-sm">
						USD
					</span>
				</p>
			</div>
			<div class="flex items-center text-gray-700 dark:text-gray-100 text-sm">
				<span>
					{BigNumFixed(currentDebt,3)} MATIC
				</span>
			</div>
		</div>
<!-- 
					     __  __              ____                               
						|  \/  |            |  _ \                              
						| \  / | __ ___  __ | |_) | ___  _ __ _ __ _____      __
						| |\/| |/ _` \ \/ / |  _ < / _ \| '__| '__/ _ \ \ /\ / /
						| |  | | (_| |>  <  | |_) | (_) | |  | | | (_) \ V  V / 
						|_|  |_|\__,_/_/\_\ |____/ \___/|_|  |_|  \___/ \_/\_/ 
 -->
		<div class="shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-800">
			<div class="flex items-center">
				<span class="rounded-xl relative p-4 bg-purple-200">
					<svg width="40" fill="currentColor" height="40" class="text-purple-500 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
						<path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
						</path>
					</svg>
				</span>
				<p class="text-md text-black dark:text-white ml-2">
					Max Borrow
				</p>
			</div>
			<div class="flex flex-col justify-start">
				<p class="text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
					{BigNumMaticToUsd(maxBorrow)}
					<span class="text-sm">
						USD
					</span>
				</p>
			</div>
			<div class="flex items-center text-gray-700 dark:text-gray-100 text-sm">
				<span>
					{BigNumFixed(maxBorrow,3)} MATIC
				</span>
			</div>
		</div>
	</div>

	<!-- 
									 _                       
									| |                      
									| |     ___   __ _ _ __  
									| |    / _ \ / _` | '_ \ 
									| |___| (_) | (_| | | | |
									|______\___/ \__,_|_| |_|

	 -->
	<div class="shadow-lg rounded-2xl p-4 mt-4 bg-white dark:bg-gray-800 text-center">
		<h1 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-green-600">
			Take a loan! You can borrow up to 50% of your collateral!
		</h1>

		<div class="flex justify-center">
			<p class="px-5 text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
				{borrowAmount ? BigNumFixed(borrowAmount,2) : '---'}
				<span class="text-sm">
					MATIC
				</span>
			</p>
			<p class="px-5 dark:text-gray-100 text-4xl text-left font-bold my-4">
				{borrowAmount ? BigNumMaticToUsd(borrowAmount) : '---'}
				<span class="text-sm">
					USD
				</span>
			</p>
		</div>
		<div class="flex text-gray-700 dark:text-gray-100 text-sm">
			<div class="flex-1 ...">
				Safer
			</div>
			<div class="flex-1 ...">
				Riskier
			</div>
			</div>
			
		<input type="range" min="0" max="100" bind:value={pct} class="w-full" id="myinput">
		<div class="py-3 flex justify-center ..." >

			<button on:click={borrow} class="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white rounded-lg "
			class:disabled={borrowing}
			class:cursor-wait={borrowing}>
			{#if borrowing}
			<!-- animation -->
			<svg width="20" height="20" fill="currentColor" class="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
				<path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
				</path>
			</svg>
			{/if}
			Take Loan
		</button>
		</div>
		<p class="text-gray-700 dark:text-gray-100 text-sm">Health Factor: {healthFactor.toFixed(2)}%</p>

	</div>
	{:else}
	<h1 class="text-5xl text-gray-700 ">LOADING...</h1>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
		<path fill="none" stroke="#0a0a0a" stroke-width="8" stroke-dasharray="42.76482137044271 42.76482137044271" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" stroke-linecap="round" style="transform:scale(0.8);transform-origin:50px 50px">
		  <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.1363636363636365s" keyTimes="0;1" values="0;256.58892822265625"></animate>
		</path>
		</svg>
	{/if}
</div>

<footer class="px-3 py-8 mt-5 bg-white dark:bg-gray-800 text-2 text-gray-500 dark:text-gray-200 transition-colors duration-200">
	<div class="flex flex-col">
		<div class="md:hidden mt-7 mx-auto w-11 h-px rounded-full">
		</div>
		<div class="mt-4 md:mt-0 flex flex-col md:flex-row">
			<nav class="flex-1 flex flex-col items-center justify-center md:items-end md:border-r border-gray-100 md:pr-5">
				<a aria-current="page" href="#" class="hover:text-gray-700 dark:hover:text-white">
					Components
				</a>
				<a aria-current="page" href="#" class="hover:text-gray-700 dark:hover:text-white">
					Contacts
				</a>
				<a aria-current="page" href="#" class="hover:text-gray-700 dark:hover:text-white">
					Customization
				</a>
			</nav>
			<div class="md:hidden mt-4 mx-auto w-11 h-px rounded-full">
			</div>
			<div class="mt-4 md:mt-0 flex-1 flex items-center justify-center md:border-r border-gray-100">
				<a class="hover:text-primary-gray-20" href="https://github.com/Charlie85270/tail-kit">
					<span class="sr-only">
						View on GitHub
					</span>
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 1792 1792">
						<path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
						</path>
					</svg>
				</a>
				<a class="ml-4 hover:text-primary-gray-20" href="#">
					<span class="sr-only">
						Settings
					</span>
					<svg width="30" height="30" fill="currentColor" class="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
						<path d="M960 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm768 512q0-52-38-90t-90-38-90 38-38 90q0 53 37.5 90.5t90.5 37.5 90.5-37.5 37.5-90.5zm0-1024q0-52-38-90t-90-38-90 38-38 90q0 53 37.5 90.5t90.5 37.5 90.5-37.5 37.5-90.5zm-384 421v185q0 10-7 19.5t-16 10.5l-155 24q-11 35-32 76 34 48 90 115 7 11 7 20 0 12-7 19-23 30-82.5 89.5t-78.5 59.5q-11 0-21-7l-115-90q-37 19-77 31-11 108-23 155-7 24-30 24h-186q-11 0-20-7.5t-10-17.5l-23-153q-34-10-75-31l-118 89q-7 7-20 7-11 0-21-8-144-133-144-160 0-9 7-19 10-14 41-53t47-61q-23-44-35-82l-152-24q-10-1-17-9.5t-7-19.5v-185q0-10 7-19.5t16-10.5l155-24q11-35 32-76-34-48-90-115-7-11-7-20 0-12 7-20 22-30 82-89t79-59q11 0 21 7l115 90q34-18 77-32 11-108 23-154 7-24 30-24h186q11 0 20 7.5t10 17.5l23 153q34 10 75 31l118-89q8-7 20-7 11 0 21 8 144 133 144 160 0 8-7 19-12 16-42 54t-45 60q23 48 34 82l152 23q10 2 17 10.5t7 19.5zm640 533v140q0 16-149 31-12 27-30 52 51 113 51 138 0 4-4 7-122 71-124 71-8 0-46-47t-52-68q-20 2-30 2t-30-2q-14 21-52 68t-46 47q-2 0-124-71-4-3-4-7 0-25 51-138-18-25-30-52-149-15-149-31v-140q0-16 149-31 13-29 30-52-51-113-51-138 0-4 4-7 4-2 35-20t59-34 30-16q8 0 46 46.5t52 67.5q20-2 30-2t30 2q51-71 92-112l6-2q4 0 124 70 4 3 4 7 0 25-51 138 17 23 30 52 149 15 149 31zm0-1024v140q0 16-149 31-12 27-30 52 51 113 51 138 0 4-4 7-122 71-124 71-8 0-46-47t-52-68q-20 2-30 2t-30-2q-14 21-52 68t-46 47q-2 0-124-71-4-3-4-7 0-25 51-138-18-25-30-52-149-15-149-31v-140q0-16 149-31 13-29 30-52-51-113-51-138 0-4 4-7 4-2 35-20t59-34 30-16q8 0 46 46.5t52 67.5q20-2 30-2t30 2q51-71 92-112l6-2q4 0 124 70 4 3 4 7 0 25-51 138 17 23 30 52 149 15 149 31z">
						</path>
					</svg>
				</a>
			</div>
			<div class="md:hidden mt-4 mx-auto w-11 h-px rounded-full ">
			</div>
			<div class="mt-7 md:mt-0 flex-1 flex flex-col items-center justify-center md:items-start md:pl-5">
				<span class="">
					© 2021
				</span>
				<span class="mt-7 md:mt-1">
					Created by
					<a class="underline hover:text-primary-gray-20" href="https://www.linkedin.com/in/crabiller/">
						0x4non & Kayaba Attribution
					</a>
				</span>
			</div>
		</div>
	</div>
  </footer>


<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}

	#myinput {
		background: linear-gradient(to right, #00ff55 0%, rgb(245, 241, 7) 80%, rgb(247, 0, 0) 100%);
		border: solid 1px #00c1f1;
		border-radius: 8px;
		height: 12px;
		width: 356px;
		outline: none;
		transition: background 450ms ease-in;
		-webkit-appearance: none;
	}

	input[type='range']::-webkit-slider-thumb {
		width: 8px;
		-webkit-appearance: none;
		height: 22px;
		background: rgb(26, 39, 82);
		border-radius: 2px;
	}
</style>
