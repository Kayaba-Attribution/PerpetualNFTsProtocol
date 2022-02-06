<script>
	import { parseEther } from '@ethersproject/units';
  import { nftsInMuseum, contracts } from '$lib/eth';

	export let healthFactor;
	export let currentDebt;
	export let currentCollateral;

	let newHealthFactor = 0;

	$: newCollateral = currentCollateral.sub(parseEther("1"));
	$: if(newCollateral.lt(currentDebt)) {
		newHealthFactor = 100;
	} else {
		newHealthFactor = currentDebt.gt(0) ? Number(currentDebt.mul(10000).div(newCollateral)) / 100 : 0;
	}


	async function withdrawCollateral(tokenId) {
		withdrawing = true;
		try {
			const tx = await contracts.museum.withdraw(tokenId);
			await tx.wait();
		} catch(err) {}
		withdrawing = false;
	}

  let withdrawing;
</script>

<div class="flex w-full">
  	<div class="flex w-full">
			{#each $nftsInMuseum as nft}
				<div class="w-1/3 p-10 text-center ">
          <h1 class="pb-4 italic text-2xl font-semibold text-gray-700 capitalize">Perpetual #{nft}</h1>
					<img src="/tokens/{nft}.jpeg" class="rounded" />
						<div class="py-3 flex justify-center" >
							{#if healthFactor <= 50 && newHealthFactor <= 50}
								<button on:click={() => { withdrawCollateral(nft) }} class="py-2 px-4 flex justify-center items-center  bg-gradient-to-r from-cyan-500 to-purple-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white rounded-lg "
										class:disabled={withdrawing}
										class:cursor-wait={withdrawing}>
										Remove Collateral
								</button>
							{:else}
								Cant Widthdraw... please repay loan.
							{/if}
						</div>
						<!-- <div class="flex justify-center ..." >
								<button on:click={sell(nft)} class="py-2 px-4 flex justify-center items-center  bg-gradient-to-r from-purple-500 to-green-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white rounded-lg "
										class:disabled={adding}
										class:cursor-wait={adding}>
										Realese to Museum
								</button>
						</div> -->
					
				</div>
			{/each}
		</div>
	</div>
