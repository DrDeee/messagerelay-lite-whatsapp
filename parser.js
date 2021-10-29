const { NodeHtmlMarkdown } = require('node-html-markdown')

const converter = new NodeHtmlMarkdown({
    strongDelimiter: '*'
})

// Source: https://github.com/sankalp179/whatsapp-formatter/
function whatsappStyles(content, wildcard, opTag, clTag) {
    var indices = [];
    for (var i = 0; i < content.length; i++) {
        if (content[i] === wildcard) {
            if (indices.length % 2)
                (content[i - 1] == " ") ? null : ((typeof(content[i + 1]) == "undefined") ? indices.push(i) : (is_aplhanumeric(content[i + 1]) ? null : indices.push(i)));
            else
                (typeof(content[i + 1]) == "undefined") ? null : ((content[i + 1] == " ") ? null : (typeof(content[i - 1]) == "undefined") ? indices.push(i) : ((is_aplhanumeric(content[i - 1])) ? null : indices.push(i)));
        } else {
            (content[i].charCodeAt() == 10 && indices.length % 2) ? indices.pop(): null;
        }
    }
    (indices.length % 2) ? indices.pop(): null;
    var e = 0;
    indices.forEach(function(v, i) {
        var t = (i % 2) ? clTag : opTag;
        v += e;
        content = content.substr(0, v) + t + content.substr(v + 1);
        e += (t.length - 1);
    });
    return content;
}
module.exports = {
    HTMLToWhatsapp(content) {
        return converter.translate(content)
    },
    WhatsAppToHTML(content) {
        content = whatsappStyles(content, '_', '<i>', '</i>');
        content = whatsappStyles(content, '*', '<b>', '</b>');
        content = whatsappStyles(content, '~', '<s>', '</s>');
        content = content.replace(/\n/gi, "<br>");
        return content
    }
}