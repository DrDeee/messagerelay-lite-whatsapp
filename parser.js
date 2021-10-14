const { NodeHtmlMarkdown } = require('node-html-markdown')

const converter = new NodeHtmlMarkdown({
    strongDelimiter: '*'
})

module.exports = (content) => {
    converter.translate(content)
}