import { test, suite } from "node:test";
import { equal, throws } from "node:assert/strict";
import { loadPackage } from "../package.js";
import { pkg, getConfig } from "./config.js";

suite("pkg/config", async () => {
	test("should throw error when accessing config before loading", () => {
		throws(() => getConfig(), /Configuration not loaded/);
	});

	test("should load configuration successfully", async () => {
		await loadPackage(pkg);
		const config = getConfig();

		equal(typeof config.game.name, "string");
		equal(typeof config.server.port, "number");
	});
});
