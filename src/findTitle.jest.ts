import SlideParser from '../src/SlideParser'


test('Should retrieve title from content', () => {

    const content = "just first line"

    const {frontmatter,slides} = new SlideParser().parse(content)
    expect(slides[0].title).toBe("just first line")
});

