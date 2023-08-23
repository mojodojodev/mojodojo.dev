---
title: Error
categories: Builtins
usage: Implements the Error class.
---

Contributed by [Lorenzobattistela](https://github.com/Lorenzobattistela)

# Error

The Error class is used to handle errors in Mojo.

## init

We are able to initialize empty errors, with custom messages and even with string references.



```mojo
var err : Error = Error()
raise err
```

    warning: Expression [3]:22:5: unreachable code after raise statement
        return
        ^
    


    Error: 



```mojo
var custom_err : Error = Error("my custom error")
raise custom_err
```

    warning: Expression [4]:22:5: unreachable code after raise statement
        return
        ^
    


    Error: my custom error



```mojo
var ref : StringRef = StringRef("hello")
var err : Error = Error(ref)

raise err
```

    warning: Expression [7]:24:5: unreachable code after raise statement
        return
        ^
    


    Error: hello


## fields

- `value`: The error message.


```mojo
var err : Error = Error("something is wrong")
print(err.value)
```

    something is wrong


## copyinit

Allows error to be copied.


```mojo
var err : Error = Error("hey")
var other : Error = err

raise other
```

    warning: Expression [8]:25:5: unreachable code after raise statement
        return
        ^
    


    Error: hey

