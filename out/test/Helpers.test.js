"use strict";
const chai = require("chai");
const Helpers_1 = require("../src/Helpers");
const Configuration_1 = require("../src//Configuration");
chai.should();
suite("Helpers Tests", () => {
    test("Shoud count simple slides", () => {
        let configuration = new Configuration_1.Configuration();
        let helpers = new Helpers_1.Helpers(configuration);
        let content = `
# Slide 1

---

# Slide 2`;
        let count = helpers.getSlideCount(content);
        count.should.be.equal(2);
    });
    test("Shoud count inner slides of a given slide content", () => {
        let configuration = new Configuration_1.Configuration();
        let helpers = new Helpers_1.Helpers(configuration);
        let content = `
# Slide 1

--

## Slide 1.1

--

## Slide 1.2

`;
        let count = helpers.getInnerSlideCount(content);
        count.should.be.equal(2);
    });
    // Defines a Mocha unit test
    test("Shoud count slides when having front header and source code", () => {
        let configuration = new Configuration_1.Configuration();
        let helpers = new Helpers_1.Helpers(configuration);
        let content = `---
theme : "white"
transition: "zoom"
highlightTheme: "darkula"
---

## Slide 1.1


\`\`\`js
var a = 1;
\`\`\`

---

## Slide 1.2

---

## Slide 2`;
        let count = helpers.getSlideCount(content);
        count.should.be.equal(3);
    });
});
//# sourceMappingURL=Helpers.test.js.map