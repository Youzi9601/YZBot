module.exports =
    /**
     *
     * @param {import('discord.js').Interaction} message
     * @param {client} client
     * @param {*} container
     */
    (client) => {
        client
            .on('interactionCreate',
                /** @param {import('discord.js').ButtonInteraction} message */
                message => {
                    if (!message.inGuild()) return;
                    if (!message.isButton) return;
                    //  console.log('ok>>>' + message.customId)

                    if (`${ message.customId }`.includes('button_role_')) {

                        // 檢查是否發送
                        try {
                            //  console.log(message.component.label)
                            const role_name = `${ message.component.label }`.replace('@', '')
                            // console.log(role_name)
                            let role = message.guild.roles.cache.find(r => r.name == role_name);
                            const member = message.member
                            // console.log(role)
                            // console.log(member.roles)
                            const member_roles = member.roles.cache.map(roles => roles.id).join('\n')
                            let has_role = (member_roles.includes(role.id))

                            if (has_role) {
                                message.member.roles.remove(role);
                            } else if (!has_role) {
                                message.member.roles.add(role);
                            }
                            message.reply({
                                content: `成功！`,
                                ephemeral: true,
                            });

                        } catch (error) {
                            message.reply({
                                content: ':x: 出了一些差錯...\n' + `\`\`\`\n${ error }\n\`\`\``,
                                ephemeral: true,
                            });

                        }



                    }
                    //

                    /*
                    fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(message.content)}&botname=${client.user.username}&ownername=${config.developers[0]}`)
                         .then(res => res.json())
                         .then(data => {
                             console.debug(data)
                             message.reply(`${data.message}`)
                             message.channel.send(`> ${message.content} \n <@${message.author.id}> ${data.message} `);
                         });
                    */

                });
    }