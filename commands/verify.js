const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require("discord-api-types/v10");
module.exports = {
    name: "verify",
    aliases: ["weryfikacja", "ver"],
    description: "Wysłanie wiadomości weryfikacyjnej",
    usage: "",
    data: function () {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    },
    execute: async (interaction, client) => {
        const messageButton = new Discord.MessageButton().setCustomId("verify").setLabel("Weryfikacja").setStyle("SUCCESS");
        const row = new Discord.MessageActionRow().addComponents(messageButton);
        const embed = new Discord.MessageEmbed()
            .setTitle("Weryfikacja")
            .setDescription("Aby dostać możliwość zobaczenia innych kanałów, a także udzielania się na nich kliknij poniższą reakcje. Po dostaniu odpowiedniego uprawnienia, każdy punkt regulaminu cię obowiązuje, a każda próba złamania go zostanie odpowiednio ukarana warnem lub banem. Witamy i życzymy miłego pobytu na serwerze ❤")
            .setColor("#8C6CFF")
        client.channels.cache.get(interaction.channelId).send({ embeds: [embed], components: [row] });
        interaction.reply({ content: "Pomyślnie udało się stworzyć system weryfikacji", ephemeral: true });
        return;
    }
}