
function Lexer(text) {
}

function createLexer(text) {
    return new Lexer(text);
}

module.exports = {
    lexer: createLexer
};