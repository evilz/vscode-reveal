import { defaultConfiguration } from './../src/Configuration';
import { parseSlides } from '../src/SlideParser'


test('Should retrieve title from content', () => {

    const content = "just first line"

    const slides = parseSlides(content, defaultConfiguration)
    expect(slides[0].title).toBe("just first line")
})

