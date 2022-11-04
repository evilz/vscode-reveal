# Code

## Sigle line
```markdown
`single line of code`
```

## Code block
```markdown
    ```js
    class Person(){
        #name = "Jhon Doe"
    }
    ```

```

## Line Numbers & Highlights
Use the revealjs `<code data-line-numbers>` attribute from [their documentation](https://revealjs.com/code/):
```markdown
    ```js {data-line-numbers}
    class Person(){
        #name = "Jhon Doe"
        #job = "Accounting"
    }

```
Using these you can highlight line numbers (`{data-line-numbers="2,3"}`) and also create step-by-step fragments ((`{data-line-numbers="2|3"}`)).
