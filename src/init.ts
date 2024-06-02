export function add(a: number, b?: number) {
	let result = a;
	if (b) result += b;
	return result;
}
