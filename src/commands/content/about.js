import { CATEGORIES } from "../index.js";

const aboutCommand = {
	metadata: {
		name: "about",
		description: "Display information about me",
		usage: "about",
		category: CATEGORIES.CONTENT,
		aliases: ["bio", "profile"],
	},

	/**
	 * Execute the command.
	 * @returns {string} The output of the command.
	 */
	execute() {
		return `Hey there! I'm a software engineer, researcher, musician, and theater-maker. I also help run a small farm.`;
	},
};

export default aboutCommand;
