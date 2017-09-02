"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Helpers_1 = require("../src/Helpers");
const Configuration_1 = require("../src//Configuration");
chai_1.should();
let slidesWithFront = `---
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
});
//# sourceMappingURL=Helpers.test.js.map