const { messageFail } = require("../../functions_old/GLBLFUNC_messageFail.js");
const { messageSuccess } = require("../../functions_old/GLBLFUNC_messageSuccess.js");
// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");

// adds a user to the Maintainer table
async function addUser(Maintainer, userID) {
	const added = await Maintainer.findOrCreate(
		{
			where: { userID },
		},
	).catch((err) => console.error(err));
	const created = await added[1];
	return created;
}

// adds user entry
/**
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 * @param {*} Maintainer 
 */
module.exports.run = async (client, interaction, Maintainer) => {
	const userID = await interaction.options.getUser("user").id;
	if (userID === interaction.user.id) return messageFail(client, interaction, "You cant edit yourself.");
	// add server
	const userAdded = await addUser(Maintainer, userID);
	// post outcome
	if (userAdded) {
		messageSuccess(interaction,
			`<@${userID}> with the ID \`${userID}\` got added to the maintainers list.`);
	} else {
		messageFail(client, interaction,
			`The entry for the user <@${userID}> with the ID \`${userID}\` already exists!`);
	}
};

module.exports.data = { subcommand: true };
