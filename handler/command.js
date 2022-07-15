const ascii = require("ascii-table");
const table = new ascii().setHeading("Command", "Load Status");
const fs = require("fs");
module.exports = (client) => {
    const commands = fs.readdirSync(`./commands`).filter(f => f.endsWith(".js"));
    for (let file of commands) {
        let pull = require(`../commands/${file}`);
        if (pull.name) {
            client.commands.set(pull.name, pull);
            table.addRow(file, 'Yes');
        } else {
            table.addRow(file, "No");
            continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases))
            pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    }
    console.log(table.toString());
}