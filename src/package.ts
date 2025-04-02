/**
 * Describes the loaders fed into the loading system.
 */
export type Loader = () => Promise<void>;

export type Package = {
	name: string;
	dependencies?: Package[];
	loader: Loader;
};

// data for handling deep loads
const loaded: Package[] = []; // tracks loaders that have completed a deep load
const loading: Package[] = []; // tracks loaders that are being deep loaded

/**
 * Executes a loader while ensuring required loaders are loaded first loaded loader loding.
 * @param Package The package to loadify.
 */
export async function loadPackage(pkg: Package) {
	if (loading.includes(pkg))
		throw new Error(
			`loader recursive dependency [${Array.from(
				loading,
				(pkg) => pkg.name
			)}]+${pkg.name}`
		);
	if (loaded.includes(pkg)) return;
	loading.push(pkg);
	if (pkg.dependencies)
		for (let dep of pkg.dependencies) await loadPackage(dep);
	await pkg.loader();
	loading.pop();
	loaded.push(pkg);
}
