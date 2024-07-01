export const keyword = "bell";
export const syntax = "bell";
export const description = "Ring a bell.";
export const rule = /^bell\s*$/;
export const script = (character, comment) => {
	character.send("\x07");
};
