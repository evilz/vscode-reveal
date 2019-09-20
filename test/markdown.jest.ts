import {slidify} from '../src/markdown'

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

test('Parse Slide content', () =>{
    //attributes
    const option = {
        separator:  '^\r?\n---\r?\n$',
        verticalSeparator: '^\r?\n--\r?\n$'
    }
const slides = slidify(slideContent, option)

expect(slides).toBeDefined()
})