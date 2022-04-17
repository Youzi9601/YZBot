/**
 *
 * @param {Client} client
 * @param {interactionCreate} interaction
 * @param {container} container
 */
function say(client, interaction, container) {
    const channel =
        client.channels.cache.get(
            interaction.options.getString('channel_id'),
        ) || interaction.channel;
    const content = interaction.options.getString('contents') || '';
    const embed = {};
    // EMBED
    // main
    const embed_title = interaction.options.getString('title') || undefined;
    if (embed_title) {
        embed.title = embed_title;
    }
    const embed_description =
        interaction.options.getString('description') || undefined;
    if (embed_description) {
        embed.description = embed_description;
    }
    const embed_title_url =
        interaction.options.getString('title_url') || undefined;
    if (embed_title_url) {
        embed.url = embed_title_url;
    }
    // author
    const embed_author_name =
        interaction.options.getString('author_name') || undefined;
    if (embed_author_name) {
        embed.author.name = embed_author_name;
    }
    const embed_author_icon =
        interaction.options.getString('author_icon') || undefined;
    if (embed_author_icon) {
        embed.author.icon = embed_author_icon;
    }
    const embed_author_url =
        interaction.options.getString('author_url') || undefined;
    if (embed_author_url) {
        embed.author.url = embed_author_url;
    }
    // thumbnail
    const embed_thumbnail =
        interaction.options.getString('thumbnail') || undefined;
    if (embed_thumbnail) {
        embed.thumbnail.url = embed_thumbnail;
    }
    // image
    const embed_image = interaction.options.getString('image') || undefined;
    if (embed_image) {
        embed.image.url = embed_image;
    }
    // footer
    const embed_footer_text =
        interaction.options.getString('footer_text') || undefined;
    if (embed_footer_text) {
        embed.footer.text = embed_footer_text;
    }
    const embed_footer_icon =
        interaction.options.getString('footer_icon') || undefined;
    if (embed_footer_icon) {
        embed.footer.icon_url = embed_footer_icon;
    }
    // fields
    const embed_fields =
        interaction.options.getString('footer_text') || undefined;
    if (embed_fields) {
        embed.fields = embed_fields;
    }
    // 取得訊息內容
    const msg = {};
    if (content) {
        msg.content = content;
    }

    if (
        embed.title ||
        embed.description ||
        embed.footer ||
        embed.image ||
        embed.thumbnail ||
        embed.fields
    ) {
        // timestamp & color
        const embed_color = interaction.options.getString('color') || '000000';
        if (embed_color) {
            embed.color = '0x' + embed_color;
        }
        const embed_timestamp =
            interaction.options.getString('timestamp') || false;
        if (embed_timestamp == true) {
            embed.timestamp = new Date();
        } else {
            // 不新增
        }
        // 設定
        msg.embeds = [embed];
    }
    channel.send(msg);
    interaction.reply({
        content: '已經成功發送指定訊息',
        ephemeral: true,
    });
}
module.exports = { say };