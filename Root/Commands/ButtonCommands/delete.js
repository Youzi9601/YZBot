module.exports = {
    name : 'delete',
    returnNoErrors: true,
    run : async (client, interaction, container) => {
        interaction.message.delete();
    },
};