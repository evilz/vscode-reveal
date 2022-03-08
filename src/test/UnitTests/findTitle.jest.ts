import SlideParser from '../../SlideParser'
import {defaultConfiguration} from "../../Configuration"

test('Should retrieve title from content', () => {

    const content = "just first line"

    const {slides} = new SlideParser().parse(content, defaultConfiguration)
    expect(slides[0].title).toBe("just first line")
});

