<script>
	import { nfts, wallet, tokenApproved, contracts, balance, museumBalance, pickNetwork, wrongNetwork } from '$lib/eth.js';
	import { fade } from 'svelte/transition';
	import { base } from '$app/paths';
	
	
	let wait = {};

	let adding = false;
	async function addCollateral(nftId) {
		try {
      adding = true;
			const tx = await contracts.museum.deposit(String(nftId));
			wait[nftId] = true;
			wait = {...wait};
			await tx.wait();
		} catch(err) {
		}
		wait[nftId] = false;
        adding = false;
		wait = {...wait};
	}

  let sellwait = {};
	let selling = false;
	async function sell(nftId) {
		try {
  		selling = true;
			const tx = await contracts.museum.release(String(nftId));
			sellwait[nftId] = true;
			sellwait = {...sellwait};
			await tx.wait();
		} catch(err) {
		}
		sellwait[nftId] = false;
		selling = false;
		sellwait = {...sellwait};
	}

	async function approve() {
		try {
			const tx = await contracts.perpetual.setApprovalForAll(contracts.museum.address, true);
			
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
	<title>User personal art</title>
</svelte:head>

<section>



    <div class="container px-6 py-1 mx-auto">
        <h1 class="text-3xl font-semibold text-center text-gray-800 capitalize lg:text-4xl">Manage Your<br> Personal <span class="text-blue-500">Art</span></h1>
				<h1 class="text-xl font-semibold text-gray-700 capitalize">
					{#if Number($balance) > 0 && Number($museumBalance) > 0}
						<em> You have {$balance} Perpetuals in your wallet and {$museumBalance} Perpetuals in the <a href="{base}/museum">Museum</a></em>  
					{:else if Number($balance) > 0}
						<em> You have {$balance} Perpetuals</em>  
					{:else if Number($museumBalance) > 0}
						<em> You have {$museumBalance} Perpetuals in the <a href="{base}/museum">Museum</a></em>  
					{/if}
				</h1>
				<!-- <h1 class="text-xl font-semibold text-gray-700 capitalize">Your own {$balance} NFTs</h1> -->
				

        
        <div class="grid grid-cols-3 gap-8 mt-8 xl:gap-16">

            <div class="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800">

                <h1 class="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Donate your Art Pieces</h1>

                <p class="text-gray-500 dark:text-gray-300">
                    You can enjoy the view here, or donate your NFT to the museum at any time for 90% mint value
                </p>
                {#if selling}
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="100px" height="60px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <path fill="none" stroke="#0096FF" stroke-width="8" stroke-dasharray="42.76482137044271 42.76482137044271" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" stroke-linecap="round" style="transform:scale(0.8);transform-origin:50px 50px">
                      <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.1363636363636365s" keyTimes="0;1" values="0;256.58892822265625"></animate>
                    </path>
                </svg>
                {/if}
            </div>

            <div class="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800">
                <h1 class="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Approve the main Gallery</h1>

                <p class="text-gray-500 dark:text-gray-300">
                    The main Gallery needs your approval to sell and deposit your Art
                </p>
            </div>

            <div class="flex flex-col items-center p-6 space-y-3 text-center bg-gray-100 rounded-xl dark:bg-gray-800">

                <h1 class="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Add Collateral</h1>

                <p class="text-gray-500 dark:text-gray-300">
                    Leave your Art as collateral in the museum to take out wMATIC loans.
                </p>
                {#if adding}
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="100px" height="60px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <path fill="none" stroke="#0096FF" stroke-width="8" stroke-dasharray="42.76482137044271 42.76482137044271" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" stroke-linecap="round" style="transform:scale(0.8);transform-origin:50px 50px">
                        <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.1363636363636365s" keyTimes="0;1" values="0;256.58892822265625"></animate>
                        </path>
                    </svg>
                {/if}
            </div>

        </div>
    </div>
	{#if $wrongNetwork}
	<button on:click={() => pickNetwork()} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
		Change Network To Polygon Mumbai
	</button>
	{:else if $wallet}
	<div class="flex w-full">
		<div class="flex w-full">
			{#each $nfts as nft}
				<div class="w-1/3 p-10 text-center" transition:fade|local>
            <h1 class="pb-4 italic text-2xl font-semibold text-gray-700 capitalize">Perpetual #{nft}</h1>
						<img src="{base}/tokens/{nft}.jpeg" class="rounded" alt="Perpetual #{nft}" />
					{#if !$tokenApproved}
						<button class="border rounded hover:bg-gray-200 border-gray-400 cursor-pointer py-2 px-4 mt-2"
						class:cursor-wait={wait.approve}
						on:click={()=> approve()}>Approve Museum</button>
					{:else}
						<div class="py-3 flex justify-center ..." >
								<button on:click={addCollateral(nft)} class="py-2 px-4 flex justify-center items-center  bg-gradient-to-r from-cyan-500 to-purple-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white rounded-lg "
										class:disabled={adding}
										class:cursor-wait={adding}>
										Add as Collateral
								</button>
						</div>
						<div class="flex justify-center ..." >
								<button on:click={sell(nft)} class="py-2 px-4 flex justify-center items-center  bg-gradient-to-r from-purple-500 to-green-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white rounded-lg "
										class:disabled={adding}
										class:cursor-wait={adding}>
										Realese to Museum
								</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	{:else}
		<h3 class="text-2xl sm:text-xl font-semiboldtext-gray-100 py-4">
			Please Connect Your Wallet To See Your NFTs
		</h3>
		<p>(Top Right Corner)</p>
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
