const fs = require('fs');
const Filer = require('../../Utils/Filer');
const moment = require('moment');

module.exports = async function(client, path) {
    Filer(`${path}/Root/Commands/ButtonCommands`, async function(err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const button = require(file);
            if (button.ignoreFile) return;
            client.commands.buttonCommands.set(button.name, button);
        });
    });
};