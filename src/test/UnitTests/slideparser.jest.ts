import { countLines, countLinesToSlide } from '../../utils'
import SlideParser from '../../SlideParser'
import {defaultConfiguration} from "../../Configuration"

// const sampleFile = fs.readFileSync('../sample.md').toString()


const parser = new SlideParser()

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

const { slides} = parser.parse(slideContent, defaultConfiguration)

test('Parse Slide content', () => {
  expect(slides.length).toBe(3)
})

test('Check slide 1', () => {
  const expected = {
    index: 0,
    text: `# Title One

content here`,
    title: 'Title One',
    verticalChildren: [],
    attributes: '',
  }
  expect(slides[0]).toEqual(expected)
})

test('Check slide 2', () => {
  const expected = {
    index: 1,
    text: `# Title 2

Some
other
content !`,
    title: 'Title 2',
    verticalChildren: [],
    attributes: '',
  }
  expect(slides[1]).toEqual(expected)
})

test('Check slide 3.0', () => {
  const expected = {
    index: 2,
    text: `# With sub slides`,
    title: 'With sub slides',
    attributes: '',
    verticalChildren: [
      {
        index: 1,
        text: `## Sub one`,
        title: 'Sub one',
        verticalChildren: [],
        attributes: '',
      },
      {
        index: 2,
        text: `## Sub Two`,
        title: 'Sub Two',
        verticalChildren: [],
        attributes: '',
      },
    ],
  }
  expect(slides[2]).toEqual(expected)
})

test('Should count horizontal slides', () => {
  expect(slides.length).toBe(3)
})

test('Should count vertical slides', () => {
  const subslides = slides[2].verticalChildren
  expect(subslides).toBeDefined()
  expect(subslides.length).toBe(2)
})

test('Slides should have correct number of lines', () => {
  expect(countLines(slides[0].text)).toBe(3)
  expect(countLines(slides[1].text)).toBe(5)
  expect(countLines(slides[2].text)).toBe(1)

  const subslides = slides[2].verticalChildren

  expect(subslides).toBeDefined()

  expect(countLines(subslides[0].text)).toBe(1)
  expect(countLines(subslides[1].text)).toBe(1)
})

test('Count line to slide 1', () => {
  const lineToSlide = countLinesToSlide(slides, 0, 0)
  expect(lineToSlide).toBe(1)
})

test('Count line to slide 2', () => {
  const lineToSlide = countLinesToSlide(slides, 1, 0)
  expect(lineToSlide).toBe(7)
})

test('Count line to slide 3', () => {
  const lineToSlide = countLinesToSlide(slides, 2, 0)
  expect(lineToSlide).toBe(15)
})

test('Count line to slide 3.1', () => {
  const lineToSlide = countLinesToSlide(slides, 2, 1)
  expect(lineToSlide).toBe(19)
})

test('Count line to slide 3.2', () => {
  const lineToSlide = countLinesToSlide(slides, 2, 2)
  expect(lineToSlide).toBe(23)
})

test('Extract slide attributes', () => {
  const content = `<!-- .slide: class="toto" data-something -->
# title`

  const {slides} = parser.parse(content,defaultConfiguration)

  expect(slides[0]).toEqual({
    index: 0,
    text: `<!-- .slide: class="toto" data-something -->
# title`,
    title: 'title',
    verticalChildren: [],
    attributes: 'class="toto" data-something',
  })
})
