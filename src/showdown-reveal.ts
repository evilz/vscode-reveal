import * as showdown from "showdown"

// const DEFAULT_ELEMENT_ATTRIBUTES_SEPARATOR = '\\\.element\\\s*?(.+?)$',
// const DEFAULT_SLIDE_ATTRIBUTES_SEPARATOR = '\\\.slide:\\\s*?(\\\S.+?)$';
showdown.extension('reveal', () => {
  return [
    {
      type: 'output',
      filter: (text: string, converter) => {
        let out: Array<string> = []
        let background: string | null = null
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimed = line.trim();
          if (trimed === "") continue;

          const isSlideAttributsMatch = trimed.match(/<!--\s+\.slide:\s+(.+)\s+-->/)
          if (isSlideAttributsMatch && isSlideAttributsMatch.length > 0) {
            const attributes = isSlideAttributsMatch[1]

            const matchs = attributes.match(/(data-\S+="\S+")/g)
            if (matchs) {
              return `<section ${matchs.join(' ')}>\n${lines.slice(i + 1).join('\n')}\n</section>`
            }
          }
        }
        return `<section>${text}</section>`
      }

    }

  ];
});


const converter = new showdown.Converter({
  extensions: ['reveal'],
  tables: true,
  ghCompatibleHeaderId: true,
  strikethrough: true,
  emoji: true,
  tasklists: true,
  simplifiedAutoLink: false
})

export default converter;