"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlideParser_1 = require("../src/SlideParser");
const Configuration_1 = require("./../src/Configuration");
test('Should retrieve title from content', () => {
    const content = "just first line";
    const slides = SlideParser_1.parseSlides(content, Configuration_1.defaultConfiguration);
    expect(slides[0].title).toBe("just first line");
});
//# sourceMappingURL=findTitle.jest.js.map