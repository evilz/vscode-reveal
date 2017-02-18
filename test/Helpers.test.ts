import * as vscode from 'vscode';
import { should } from 'chai';
import { Helpers } from "../src/Helpers";
import { Configuration } from "../src//Configuration";

should();
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

        let configuration = new Configuration();
        let helpers = new Helpers(configuration);

        let content = `
# Slide 1

---

# Slide 2`;

        let count = helpers.getSlideCount(content);
        count.should.be.equal(2);
    });

    test("Shoud count inner slides of a given slide content", () => {

        let configuration = new Configuration();
        let helpers = new Helpers(configuration);

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