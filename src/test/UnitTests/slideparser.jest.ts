import { countLines, countLinesToSlide } from '../../utils'
import parser from '../../SlideParser'
import { defaultConfiguration } from '../../Configuration'

// const sampleFile = fs.readFileSync('../sample.md').toString()

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

const { slides } = parser.parse(slideContent, defaultConfiguration)

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

  const { slides } = parser.parse(content, defaultConfiguration)

  expect(slides[0]).toEqual({
    index: 0,
    text: `<!-- .slide: class="toto" data-something -->
# title`,
    title: 'title',
    verticalChildren: [],
    attributes: 'class="toto" data-something',
  })
})

test('Persists explicitly marked slide data-state through following and vertical slides', () => {
  const content = `<!-- .slide: data-state="section-red" data-state-persistent -->
# Red

---

# Still red

--

## Also red

---

<!-- .slide: data-state="section-blue" data-state-persistent -->
# Blue

---

# Still blue`

  const { slides } = parser.parse(content, defaultConfiguration)

  expect(slides[0].attributes).toBe('data-state="section-red"')
  expect(slides[1].attributes).toBe('data-state="section-red"')
  expect(slides[1].verticalChildren[0].attributes).toBe('data-state="section-red"')
  expect(slides[2].attributes).toBe('data-state="section-blue"')
  expect(slides[3].attributes).toBe('data-state="section-blue"')
})

test('Does not propagate an unmarked data-state and removes disabled persistence markers', () => {
  const content = `<!-- .slide: data-state="one" -->
# One

---

# Default

---

<!-- .slide: data-state="two" data-state-persistent = "false" -->
# Two

---

# Also default`

  const { slides } = parser.parse(content, defaultConfiguration)

  expect(slides[0].attributes).toBe('data-state="one"')
  expect(slides[1].attributes).toBe('')
  expect(slides[2].attributes).toBe('data-state="two"')
  expect(slides[3].attributes).toBe('')
})

test('Malformed front matter still returns parsed slides and parser location', () => {
  const malformedFrontMatter = `---
foo: [
---
# Slide one`

  const result = parser.parse(malformedFrontMatter, defaultConfiguration)

  expect(result.frontmatter).toBeUndefined()
  expect(result.slides).toHaveLength(1)
  expect(result.slides[0].title).toBe('---')
  expect(result.slides[0].text).toContain('# Slide one')
  expect(result.parseError).toEqual(
    expect.objectContaining({
      line: expect.any(Number),
      column: expect.any(Number),
      message: expect.any(String),
    })
  )
})
