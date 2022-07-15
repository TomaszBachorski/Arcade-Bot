const { Client, Collection, Intents } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const settings = require("./settings.json");

const { config } = require("dotenv");
config({
    path: __dirname + "/.env"
});


const client = new Client({
    intents: [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_INTEGRATIONS

    ],
    partials: ['MESSAGE', 'CHANNEL', "USER", "GUILD_MEMBER"]
});

client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});
//slash commands
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const clientId = settings.clientId;
const guildId = settings.guildId;
const commands = [];
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.execute) commands.push(command.data().toJSON());
}
const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log('Ładowanie komend slash(/).');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log('Pomyślnie załadowano komendy slash(/).');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania komendy', ephemeral: true });
    }
});

client.on("interactionCreate", (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "verify") return;
    const embed = new Discord.MessageEmbed().setTitle("Weryfikacja").setColor("#8C6CFF");
    const role = interaction.guild.roles.cache.find(r => r.id === settings.verificationRole);
    const role1 = interaction.guild.roles.cache.find(r => r.id === settings.playersRole);
    if (!role || !role1) return interaction.reply({ embeds: [embed.setDescription("Nie udało się zweryfikować ponieważ nie ma takiej roli na serwerze, powiadom administracje")], ephemeral: true });
    if (!interaction.member.roles.cache.some(role => role.id === settings.verificationRole)) return interaction.reply({ embeds: [embed.setDescription("Jesteś już zweryfikowany/a, jeśli uważasz że to błąd napisz do administracji")], ephemeral: true })
    interaction.member.roles.remove(role);
    interaction.member.roles.add(role1);
    return interaction.reply({embeds: [embed.setDescription("Pomyślnie udało się Ciebie zweryfikować, życzymy miłego pobytu na serwerze.")], ephemeral: true});
})

client.login(process.env.TOKEN)