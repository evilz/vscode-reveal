import { parseSlides } from '../src/SlideParser'
import { defaultConfiguration } from './../src/Configuration';


test('Should retrieve title from content', () => {

    const content = "just first line"

    const slides = parseSlides(content, defaultConfiguration)
    expect(slides[0].title).toBe("just first line")
})

