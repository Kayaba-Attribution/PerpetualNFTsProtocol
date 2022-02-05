<script>
  import { nftsInMuseum } from '$lib/eth';

  let adding;
</script>

<div class="flex w-full">
  	<div class="flex w-full">
			{#each $nftsInMuseum as nft}
				<div class="w-1/3 p-10 text-center ">
                    <h1 class="pb-4 italic text-2xl font-semibold text-gray-700 capitalize">Perpetual #{nft}</h1>
					<img src="/tokens/{nft}.jpeg" class="rounded" />
						<div class="py-3 flex justify-center ..." >
								<button on:click={addCollateral(nft)} class="py-2 px-4 flex justify-center items-center  bg-gradient-to-r from-cyan-500 to-purple-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white rounded-lg "
										class:disabled={adding}
										class:cursor-wait={adding}>
										Add as Collateral
								</button>
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
