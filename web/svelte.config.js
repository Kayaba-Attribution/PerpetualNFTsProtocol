// svelte.config.js
import adapterStatic from '@sveltejs/adapter-static';
import preprocess from "svelte-preprocess";
import adapterAuto from "@sveltejs/adapter-auto";

const dev = process.env.NODE_ENV === 'development';

const GHPAGES = process.env.GHPAGES;

const defaultConfig = {
  kit: {
    adapter: adapterAuto(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",

    // Override http methods in the Todo forms
    methodOverride: {
      allowed: ["PATCH", "DELETE"],
    },
  },

  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
};

const ghpagesConfig = {
	kit: {
		serviceWorker: {
			register: false,
		},
		adapter: adapterStatic({
			// default options are shown
			pages: 'docs',
			assets: 'docs',
			fallback: null,
		}),
    paths: {
      base: dev ? '' : '/Jugando-con-Eth',
    },
    // If you are not using a .nojekyll file, change your appDir to something not starting with an underscore.
    // For example, instead of '_app', use 'app_', 'internal', etc.
    // appDir: 'internal',
    //target: "#svelte",
	},
}
console.log({GHPAGES})
export default GHPAGES ? ghpagesConfig : defaultConfig;
