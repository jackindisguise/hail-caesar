import { expect } from "chai";
import { MUDClient, MUDServer } from "../io.js";
import { createConnection, Socket } from "net";
import { Colorizer, colorize } from "../color.js";

describe("io.ts", () => {
	let server: MUDServer;
	let client: Socket;
	let mClient: MUDClient;
	before(() => {
		server = new MUDServer();
		server.start(23);
	});
	it("connect", (done) => {
		server.once("connection", (mc: MUDClient) => {
			mClient = mc;
			done();
		});
		client = createConnection(23);
		client.setEncoding("ascii");
	});
	it("command", (done) => {
		mClient.once("command", (command: string) => {
			expect(command).is.equal("cake");
			done();
		});
		client.write("cake\r\n");
	});
	it("Telnet protocol ignored", (done) => {
		mClient.once("command", (command: string) => {
			done("failure");
		});
		client.write(Buffer.from([255, 255, 255]));
		setTimeout(() => done(), 500);
	});
	it("receiving messages", (done) => {
		const str = "Sup {{{Ydude{x}?";
		const colorized = colorize(str);
		client.once("data", (data: string) => {
			expect(data).is.equal(`${colorized}\r\n`);
			done();
		});
		mClient.sendLine(str);
	});
	it("asking questions", (done) => {
		client.once("data", (data: string) => {
			expect(data).is.equal("What's your name? ");
			client.write("Judas\r\n");
		});
		mClient.ask("What's your name?", (name: string) => {
			expect(name).is.equal("Judas");
			done();
		});
	});
	it("y/n: yes", (done) => {
		client.once("data", (data: string) => {
			expect(data).is.equal("Are you cool? [y/n] ");
			client.write("y\r\n");
		});
		mClient.yesno("Are you cool?", (agree) => {
			if (agree) done();
			else done("wtf?");
		});
	});
	it("y/n: no", (done) => {
		client.once("data", (data: string) => {
			expect(data).is.equal("Are you cool? [y/n] ");
			client.write("n\r\n");
		});
		mClient.yesno("Are you cool?", (agree) => {
			if (agree) done("wtf");
			else done();
		});
	});
	it("y/n: maybe", (done) => {
		client.once("data", (data: string) => {
			expect(data).is.equal("Are you cool? [y/n] ");
			client.write("m\r\n");
			// again
			client.once("data", (data: string) => {
				expect(data).is.equal("Are you cool? [y/n] ");
				done();
			});
		});
		mClient.yesno("Are you cool?", (agree) => {
			if (agree) done("wtf?");
			else done("wtf?");
		});
	});
	it("disconnect", (done) => {
		server.once("disconnection", (mc: MUDClient) => {
			done();
		});
		client.end();
	});
	after(() => {
		server.stop();
	});
});
