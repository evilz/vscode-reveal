// tslint:disable-next-line:no-implicit-dependencies
import { should } from 'chai'
import * as fs from 'fs'
import * as matter from 'gray-matter'
import * as path from 'path'
// import * as vscode from 'vscode'
import { ISlide, ISlidifyOptions } from '../src/Models'
import { countLines, parseSlides } from '../src/SlideParser'

// const sampleFile = fs.readFileSync('../sample.md').toString()

const defaultSlidifyOptions: ISlidifyOptions = {
  notesSeparator: 'note:',
  separator: '^[\r\n?|\n]---[\r\n?|\n]$',
  verticalSeparator: '^[\r\n?|\n]--[\r\n?|\n]$'
}

should()
suite('Slide parser tests', function() {
  let slideContent = ''

  suiteSetup(function() {
    const currentPath = path.dirname(this.test.parent.file)
    const samplePath = path.join(currentPath, '../../sample.md')
    const data = fs.readFileSync(samplePath)
    slideContent = matter(data.toString()).content
  })

  test('Shoud count simple slides', function() {
    const slides = parseSlides(slideContent, defaultSlidifyOptions)
    slides.should.has.lengthOf(26)
  })

  test('First slide should have correct number of lines', function() {
    const slides = parseSlides(slideContent, defaultSlidifyOptions)

    const expectedLineCount = [7, 5]

    expectedLineCount.forEach((expected, i) => {
      countLines(slides[i].text).should.equal(expected)
    })
  })
})
