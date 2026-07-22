(() => {
  const hljs = window.RevealHighlight?.().hljs
  if (!hljs) return

  hljs.registerLanguage('sparql', () => ({
    name: 'SPARQL',
    aliases: ['rq'],
    case_insensitive: true,
    keywords: {
      keyword: 'BASE PREFIX SELECT CONSTRUCT DESCRIBE ASK FROM NAMED WHERE ORDER BY GROUP HAVING LIMIT OFFSET DISTINCT REDUCED AS BIND VALUES INSERT DELETE DATA LOAD CLEAR CREATE DROP COPY MOVE ADD WITH USING DEFAULT GRAPH SILENT OPTIONAL UNION FILTER EXISTS NOT IN MINUS SERVICE BINDINGS',
      literal: 'true false',
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      { className: 'variable', begin: /[?$][A-Za-z_][\w-]*/ },
      { className: 'symbol', begin: /<[^<>\s]*>/ },
      { className: 'number', begin: /[+-]?(?:\d+\.\d*|\.\d+|\d+)(?:[Ee][+-]?\d+)?/ },
    ],
  }))

  hljs.registerLanguage('turtle', () => ({
    name: 'Turtle',
    aliases: ['ttl'],
    case_insensitive: true,
    keywords: {
      keyword: '@prefix @base PREFIX BASE a',
      literal: 'true false',
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      { className: 'meta', begin: /@(prefix|base)\b/i, end: /\./, excludeEnd: true },
      { className: 'symbol', begin: /<[^<>\s]*>/ },
      { className: 'symbol', begin: /(?:[A-Za-z][\w-]*)?:[\w.-]*/ },
      { className: 'number', begin: /[+-]?(?:\d+\.\d*|\.\d+|\d+)(?:[Ee][+-]?\d+)?/ },
    ],
  }))
})()
