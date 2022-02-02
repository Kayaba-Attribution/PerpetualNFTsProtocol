### Basic connection example

### eth.js

```js
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

import { writable } from "svelte/store";

export const wallet = writable()
export const wrongNetwork = writable(true)

let provider;
const CHAIN_ID = 31337;

export function loginMetamask() {
  window.ethereum.enable()
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });

  init();
}


export async function init() {
  if (!provider) {

    provider = new Web3Provider(window.ethereum, "any");

    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        setTimeout(() => {
          console.log("NETWORK CHANGE")
          init();
        }, 0);
      }
    });

    window.ethereum.on("accountsChanged", () => {
      setTimeout(() => {
        init();
      }, 5);
    });
  }

  const _signer = await provider.getSigner();
  const _wallet = await _signer.getAddress();
  wallet.set(_wallet);

  const _networkDetails = await provider.getNetwork();
  
  if (_networkDetails.chainId !== CHAIN_ID) {
    wrongNetwork.set(true);
    return;
  } else {
    wrongNetwork.set(false);
  }

}

export async function pickNetwork(chainHexa) {
  await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chainHexa }] });
}

```

### index.svelte

```js
<script context="module">
	export const prerender = true;
</script>

<script>
	import { wallet, loginMetamask, init, wrongNetwork, pickNetwork } from '$lib/eth.js';
	import { onMount } from 'svelte';
	
	onMount(() => {
		try {
			init();
		} catch(err) {
			/* empty */
		}
	});

</script>

<svelte:head>
	<title>Basic Web3 Svelte</title>
</svelte:head>

<section>
	<p>Wallet: {$wallet}</p>

    {#if $wallet}
        <h1>HOLA {$wallet}	</h1>

        {#if $wrongNetwork}
            estas en al red equivocada
            <button on:click={() => pickNetwork('0x7A69')}>CHANGE TO HARDHAT</button>
        {/if}

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
</style>

```