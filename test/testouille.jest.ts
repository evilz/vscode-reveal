const splitter = "^\\r?\\n---\\r?\\n"

const rsplit = new RegExp(splitter, 'gm')

const input = `line1

---

line5`


test('wesh', () =>{

    const result = input.split(rsplit)

    //console.log(result)
    
    //console.log(result[0].split('\n').length)
    //console.log(result[1].split('\n').length)
    
    const resultExec = rsplit.exec(input)
    const index = rsplit.lastIndex
    const newstring = input.substr(index)
    console.log(newstring)
    
    const laststring = newstring.replace(rsplit,'')
    
    console.log(laststring)
})