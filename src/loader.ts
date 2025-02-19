/**
 * Describes the loaders fed into the loading system.
 */
export type Loader = () => Promise<void>;

/**
 * Describe loaders that have to be loaded before other loaders.
 */
const prerequisites: Map<Loader, Loader[]> = new Map<Loader, Loader[]>();

/**
 * Set of all of the loaders.
 */
const loaders: Loader[] = [];

// data for handling deep loads
const loaded: Loader[] = []; // tracks loaders that have completed a deep load
const loading: Loader[] = []; // tracks loaders that are being deep loaded

/**
 * Executes a loader while ensuring required loaders are loaded first loaded loader loding.
 * @param loader The loader to loadify.
 */
async function deepLoad(loader: Loader) {
	if (loading.includes(loader))
		throw new Error(
			`loader recursive dependency [${Array.from(
				loading,
				(loader) => loader.name
			)}]+${loader.name}`
		);
	if (loaded.includes(loader)) return;
	loading.push(loader);
	const preloaders = prerequisites.get(loader);
	if (preloaders) for (let preloader of preloaders) deepLoad(preloader);
	await loader();
	loading.pop();
	loaded.push(loader);
}
