import { clock } from "./database.js";
import { t } from "./i18n.js";
import { logger } from "./winston.js";
import { autocomplete } from "./string.js";
import { Character } from "./character.js";
import { Classification } from "./classification.js";
import { MUDClient } from "./io.js";
import { Mob } from "./dungeon.js";

const WORLD_NAME = "Hail Caesar";

export function login(client: MUDClient) {
	let name: string,
		password: string,
		email: string,
		race: Classification,
		_class: Classification;

	client.sendLine(t("Welcome to {{world}}!", { world: WORLD_NAME }));

	function getName() {
		client.ask(t("What's your name?"), confirmName);
	}

	function confirmName(pName: string) {
		client.yesno(
			t("Is your name {{name}}?", { name: pName }),
			(agreed: boolean) => {
				if (agreed) {
					name = pName;
					getPassword();
				} else getName();
			}
		);
	}

	function getPassword() {
		client.ask(t("Please choose a password:"), confirmPassword);
	}

	function confirmPassword(iPassword: string) {
		client.ask(t("Please confirm your password:"), (cPassword: string) => {
			if (iPassword !== cPassword) {
				client.sendLine("Those passwords don't match!");
				getPassword();
			} else {
				password = iPassword;
				motd();
			}
		});
	}

	function motd() {
		client.sendLine(t("This is the MOTD!"));
		client.ask(t("Hit enter to continue: "), finish);
	}

	function finish() {
		logger.debug(
			t("{{client}} is playing as {{name}}.", {
				client: client,
				name: name,
			})
		);
		const character = new Character();
		character.password = password;
		character.mob = new Mob();
		character.mob.name = name;
		client.character = character;
		client.sendLine(
			t("Welcome to {{world}}, {{name}}!", { world: WORLD_NAME, name: name })
		);
	}

	getName();
}
