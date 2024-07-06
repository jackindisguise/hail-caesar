import { _ } from "../../build/i18n.js";
export const keyword = "ooc";
export const syntax = "ooc <comment>";
export const description = "Speak in the out-of-character channel.";
export const rule = /^(?:ooc|oo|o)\s+(.+)$/;
export const script = (character, comment) => {
	character.sendLine(_("You OOC: {{comment}}", { comment: comment }));
};
