import { ISlide } from './../src/ISlide';
import { defaultConfiguration, getDocumentOptions } from '../src/Configuration'
import { countLines, parseSlides, countLinesToSlide } from '../src/SlideParser'

// const sampleFile = fs.readFileSync('../sample.md').toString()

const config = getDocumentOptions(defaultConfiguration)

config.notesSeparator = 'note:'
config.separator = "^\\r?\\n---\\r?\\n$"
config.verticalSeparator = "^\\r?\\n--\\r?\\n$"

const slideContent = `# Title One

content here 

---

# Title 2

Some
other 
content !

---

# With sub slides

--

## Sub one

--

## Sub Two`

const slides = parseSlides(slideContent, config)


test('Check slide 1', () => {
    const expected = {
        index: 0,
        text:
            `# Title One

content here 
`,
        title: 'Title One',
        verticalChildren: undefined
    }
    expect(slides[0]).toEqual(expected)
})

test('Check slide 2', () => {
    const expected = {
        index: 1,
        text:
            `
# Title 2

Some
other 
content !
`,
        title: 'Title 2',
        verticalChildren: undefined
    }
    expect(slides[1]).toEqual(expected)
})


test('Check slide 3.0', () => {
    const expected = {
        index: 2,
        text:
            `
# With sub slides
`,
        title: 'With sub slides',
        verticalChildren: [{
            index: 1,
            text:
                `
## Sub one
`,
            title: 'Sub one',
            verticalChildren: undefined
        },
        {
            index: 2,
            text:
                `
## Sub Two`,
            title: 'Sub Two',
            verticalChildren: undefined
        }]
    }
    expect(slides[2]).toEqual(expected)
})


test('Should count horizontal slides', () => {
    expect(slides.length).toBe(3)
})


test('Should count vertical slides', () => {
    const subslides = slides[2].verticalChildren
    expect(subslides).toBeDefined()
    if (subslides) {
        expect(subslides.length).toBe(2)
    }
})

test('Slides should have correct number of lines', () => {
    const slides = parseSlides(slideContent, config)

    expect(countLines(slides[0].text)).toBe(4)
    expect(countLines(slides[1].text)).toBe(7)
    expect(countLines(slides[2].text)).toBe(3)

    const subslides = slides[2].verticalChildren

    expect(subslides).toBeDefined()

    if (subslides) {
        expect(countLines(subslides[0].text)).toBe(3)
        expect(countLines(subslides[1].text)).toBe(2)
    }

})



test('Count line to slide 1', () => {
    const lineToSlide = countLinesToSlide(slides, 0, 0, config)
    expect(lineToSlide).toBe(1)
})


test('Count line to slide 2', () => {
    const lineToSlide = countLinesToSlide(slides, 1, 0, config)
    expect(lineToSlide).toBe(6)
})


test('Count line to slide 3', () => {
    const lineToSlide = countLinesToSlide(slides, 2, 0, config)
    expect(lineToSlide).toBe(14)
})

test('Count line to slide 3.2', () => {
    const lineToSlide = countLinesToSlide(slides, 2, 1, config)
    expect(lineToSlide).toBe(22)
})
