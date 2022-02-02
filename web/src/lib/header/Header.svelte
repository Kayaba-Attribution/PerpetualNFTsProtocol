<script>
	import { page } from '$app/stores';

	import { wallet, wrongNetwork, loginMetamask, pickNetwork } from '$lib/eth.js';

</script>

<header>
	<div class="corner">
		&nbsp;
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.url.pathname === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.url.pathname === '/museum'}>
				<a sveltekit:prefetch href="/museum">Museum</a>
			</li>
			<li class:active={$page.url.pathname === '/loans'}>
				<a sveltekit:prefetch href="/loans">Loans</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		
	</div>
</header>
<div class="relative">
	<div class="grid px-4 lg:px-0 grid-cols-4 lg:grid-cols-12 gap-x-3 lg:gap-x-5">
		<div class="flex col-span-full col-end-12 col-start-8 justify-end space-x-8">
			{#if $wrongNetwork}
				<button on:click={pickNetwork} class="flex items-center px-4 h-12 text-white font-bold bg-link bg-orange-600 rounded shadow-button space-x-3">Wrong Network</button>
			{:else if $wallet}
				<div class="w-[153px] relative">
					<div class="absolute z-50 flex flex-col items-center shadow-button"><button class="flex items-center px-4 h-12 bg-white rounded"><div class="rounded-full w-[6px] h-[6px] bg-green-500 bg-green-500 mr-3"></div><div>{$wallet.slice(0, 6)}...{$wallet.slice(-6)}</div><span class="ml-1 text-gray-700 text-sm">▼</span></button></div>
				</div>
			{:else}
				<button on:click={loginMetamask} class="flex items-center px-4 h-12 bg-white rounded shadow-button space-x-3"><div class="rounded-full w-[6px] h-[6px] bg-green-500 bg-red-500"></div><div>Connect Wallet</div></button>
			{/if}
			<!-- <a href="/exhibitions" class="flex items-center justify-center pl-2 pr-2 h-12 hover:text-white whitespace-nowrap text-sm hover:bg-link bg-white border-2 border-button-border hover:border-link rounded shadow-button transition-all duration-300 md:text-base lg:pl-5 lg:pr-5">Exhibitions</a> -->
			</div>
	</div>

</div>
<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
