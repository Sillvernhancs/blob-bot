const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('member_check')
		.setDescription('Sends out a message to check for active members'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};