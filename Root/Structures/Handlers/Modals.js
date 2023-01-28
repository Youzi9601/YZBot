const fs = require('fs');
const Filer = require('../../Utils/Filer');
const moment = require('moment');

module.exports = async function(client, path) {
    Filer(`${path}/Root/Commands/Modals`, async function(err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const modal = require(file);
            if (modal.ignoreFile) return;
            client.commands.modals.set(modal.name, modal);
        });
    });
};