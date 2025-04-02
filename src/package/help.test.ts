import { test, suite } from "node:test";
import { equal, throws, deepEqual, ok, rejects } from "node:assert/strict";
import { loadPackage } from "../package.js";
import { pkg, getHelpfile, getAllHelpfiles, HelpEntry } from "./help.js";

suite("pkg/help", async () => {
	test("should throw error when accessing helpfiles before loading", () => {
		throws(() => getHelpfile("help"), /Helpfiles not loaded/);
		throws(() => getAllHelpfiles(), /Helpfiles not loaded/);
	});

	test("should load helpfiles successfully", async () => {
		await loadPackage(pkg);
		const helpfile = getHelpfile("help");

		equal(helpfile?.keywords, "help");
		equal(typeof helpfile?.summary, "string");
		deepEqual(helpfile?.see_also, ["template"]);
		equal(typeof helpfile?.body, "string");
	});

	test("should find helpfile by exact keyword match", async () => {
		const helpfile = getHelpfile("template");

		equal(helpfile?.keywords, "template cake");
	});

	test("should find helpfile by partial keyword match", async () => {
		const helpfile = getHelpfile("temp");
		equal(helpfile?.keywords, "template cake");
	});

	test("should find helpfile by any keyword in the list", async () => {
		const helpfile = getHelpfile("ca");
		equal(helpfile?.keywords, "template cake");
	});

	test("should return undefined for non-existent helpfile", async () => {
		const helpfile = getHelpfile("nonexistent");
		equal(helpfile, undefined);
	});

	test("should get all helpfiles", async () => {
		const all = getAllHelpfiles();
		ok(Array.isArray(all.helpfile));
		ok(all.helpfile.length >= 2); // At least template and help entries

		// Verify structure of first helpfile
		const first = all.helpfile[0];
		equal(typeof first.keywords, "string");
		equal(typeof first.summary, "string");
		ok(Array.isArray(first.see_also));
		equal(typeof first.body, "string");
	});

	test("should match keywords case-insensitively", async () => {
		const helpfile = getHelpfile("TEMPLATE");
		equal(helpfile?.keywords, "template cake");
	});

	test("should handle multi-word search terms", async () => {
		const helpfile = getHelpfile("cake template");
		equal(helpfile?.keywords, "template cake");
	});
});
