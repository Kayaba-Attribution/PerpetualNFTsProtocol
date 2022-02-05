<script>
import { formatEther } from '@ethersproject/units';
import { contracts, balanceETH, signer, init, wallet } from '$lib/eth.js';

import { onMount } from 'svelte';

export let healthFactor;
export let currentDebt;
export let currentCollateral;
export let maticSpotPrice;

let pct = 0;


let repayAmount;
$: if(pct) {
	repayAmount = currentDebt.div(100).mul(Math.round(pct));
} else {
	repayAmount = 0;
}


let repaying = false;
async function repay() {
	try {
		repaying = true;
		const tx = await contracts.museum.repay({value: repayAmount});
		await tx.wait(1);
		pct = 0;
	} catch (err) {
		console.log(err);
	}
	repaying = false;
}

</script>
<div class="shadow-lg rounded-2xl p-4 mt-4 bg-white dark:bg-gray-800 text-center">
  <h1 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-green-600">
    Repay Loan
  </h1>

  <div class="flex justify-center">
    <p class="px-5 text-gray-700 dark:text-gray-100 text-4xl text-left font-bold my-4">
      {repayAmount ? Number(formatEther(repayAmount)).toFixed(2) : '0'}
      <span class="text-sm">
        MATIC
      </span>
    </p>
    <p class="px-5 dark:text-gray-100 text-4xl text-left font-bold my-4">
      {repayAmount ? (maticSpotPrice * Number(formatEther(repayAmount))).toFixed(3) : '0'}
      <span class="text-sm">
        USD
      </span>
    </p>
  </div>
  <div class="flex text-gray-700 dark:text-gray-100 text-sm">
    <div class="flex-1 ...">
      0
    </div>
    <div class="flex-1 ...">
      {Number(formatEther(currentDebt)).toFixed(3)} MATIC
    </div>
    </div>
    
  <input type="range" min="0" max="100" bind:value={pct} class="w-full" id="myinput">
  <div class="py-3 flex justify-center ..." >

    <button on:click={repay} class="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white rounded-lg "
      class:disabled={repaying}
      class:cursor-wait={repaying}>
      {#if repaying}
      <!-- animation -->
      <svg width="20" height="20" fill="currentColor" class="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
        </path>
      </svg>
      Repaying Loan...
      {:else}
      Repay loan
      {/if}
    </button>
  </div>
  <!-- Calculate health factor on the fly yo se que es asqueroso jaja -->
  <p class="text-gray-700 dark:text-gray-100 text-sm">Health Factor: {(Number(healthFactor.toFixed(2)) - (repayAmount ? Number(repayAmount.mul(10000).div(currentCollateral)) / 100 : 0)).toFixed(3)}%</p>
</div>

<style>
  	#myinput {
		background: linear-gradient(to left, #00ff55 0%, rgb(245, 241, 7) 80%, rgb(247, 0, 0) 100%);
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