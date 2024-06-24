import { clock } from "./database.js";
import { _ } from "./i18n.js";
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

	client.sendLine(_("Welcome to {{world}}!", { world: WORLD_NAME }));

	function getName() {
		client.ask(_("What's your name?"), confirmName);
	}

	function confirmName(pName: string) {
		client.yesno(
			_("Is your name {{name}}?", { name: pName }),
			(agreed: boolean) => {
				if (agreed) {
					name = pName;
					motd();
				} else getName();
			}
		);
	}

	function motd() {
		client.sendLine(_("This is the MOTD!"));
		client.ask(_("Hit enter to continue: "), finish);
	}

	function finish() {
		logger.debug(
			_("{{client}} is playing as {{name}}.", {
				client: client,
				name: name,
			})
		);
		const character = new Character();
		character.mob = new Mob();
		character.mob.name = name;
		client.character = character;
		client.sendLine(
			_("Welcome to {{world}}, {{name}}!", { world: WORLD_NAME, name: name })
		);
	}

	getName();
}
