const { NodeHtmlMarkdown } = require('node-html-markdown')

const converter = new NodeHtmlMarkdown({
    strongDelimiter: '*'
})

module.exports = (content) => {
    return converter.translate(content)
}