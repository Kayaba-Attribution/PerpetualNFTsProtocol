### HardHat Commands

* `npx hardhat test` Run all the tests under the test folder
* `npx hardhat test test/x.test.js` Run unique test file
* `npx hardhat node` Run local node
* `npx hardhat node --fork rpcURL --fork-block-number x` Fork chain (Use moralis speddynodes)
* `npx hardhat run scripts/x.js  --network xnetwork` Deploy contracts on specified network
* `npx hardhat export-abi` Export ABIs to data folder

### Svelte + Web3

#### login, init, provider, signer plus wallet y wrongNetwork store

`npm i ethers`

Create svelte store -> objeto que notifica cuando el valor cambia
Crear file x.js 

importar porvider y contract de ethers y writable de svelte
```js
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
``` 

```js 
import { writable } from 'svelte/store';
``` 
writable es un store que deja leer y update el valor

crear writable stores for wallet y wrongNetwork para poder usarlas en otros componentes
```js
export const wallet = writable();
export const wrongNetwork = writable(true);
```
crear login function
```js
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
}
```
Crear init: basicamente toda nuestra web3 App
En cada evento ej: cambio de red, cambio de cuenta, se hace restart de la app

```js
const CHAIN_ID = 31337;
let provider;

export async function init() {
  if (!provider) {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    provider = new Web3Provider(window.ethereum, "any");
    // Check if there is a change in network
    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        setTimeout(() => {
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

  //Get signer, wallet and update the wallet store
  const _signer = await provider.getSigner();
  const _wallet = await _signer.getAddress();
  wallet.set(_wallet);

  // Check the current network chain id andn update the wrongNetwork store
  const _networkDetails = await provider.getNetwork();
  
  if (_networkDetails.chainId !== CHAIN_ID) {
    wrongNetwork.set(true);
    return;
  } else {
    wrongNetwork.set(false);
  }

}
```

### Svelte index page

Imports and run the app on user enter

```js
import { wallet, loginMetamask, init, wrongNetwork, pickNetwork } from '$lib/x.js';
import { onMount } from 'svelte';

onMount(() => {
    try {
        init();
    } catch(err) {
        /* empty */
    }
});
```

Display wallet address if connected otherwise ask for connection
We use '$' on stores to susbscibe to the value
```js
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
```

Full Code on basic conection md

### extend to contracts interaction

move the ABIs to the web lib forder
import the ABIs
create the interfaces with 
```js
contracts.museum = new Contract(ADDRESS.museum, abiMuseum, _signer);
contracts.myToken = new Contract(ADDRESS.myToken, abiNFT, _signer);
```

simply call the functions as needed:

get the balance of the current address
```js

```

### Links

Useful Matchers: https://ethereum-waffle.readthedocs.io/en/latest/matchers.htmlh

AAVE integration: https://betterprogramming.pub/how-to-supply-assets-to-the-aave-protocol-programmatically-acfb0875a2f0

LendingPool Docs: https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool



+ nfts images
+ logo how to
+ divide in 4 TF, aleatory 10,000

+ not enought
+ Guaranteed Value
+  interesting 
+ protocol

+ diferent, we deposit into AAVE kept money in the network
+ personal gallery
+ donate the museum , and keeps in the museum

+ take loans over NFTs
+ add it as collateral

+ using Covalint API
+ NFTs == 1 MATIC, 
+ while health factor <50%> take monay else unquie liquidtion system  
+ in fact >60% y la paersonlae que liquida se lleva una parte y  without paying ETH 0.1, y pasa a 

+ 2 0.5 eth


