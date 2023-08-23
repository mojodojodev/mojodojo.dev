---
title: StringLiteral
categories: Builtins
usage: This type represents a string literal. String literals are all null-terminated for compatibility with C APIs, but this is subject to change. String literals store their length as an integer, and this does not include the null terminator.
---

Contributed by [Lorenzobattistela](https://github.com/Lorenzobattistela)

# StringLiteral

This type represents a string literal.

String literals are all null-terminated for compatibility with C APIs, but this is subject to change. String literals store their length as an integer, and this does not include the null terminator.


## init


```mojo
var x: StringLiteral = "Literal"
print(x)

var y = "StringLiteral"
print(y)
```

    Literal
    StringLiteral


## fields

- `value`: The MLIR storage for the string literal, lets force an error to see the type:


```mojo
y.value = 0
```

    error: Expression [3]:19:15: cannot implicitly convert 'Int' value to 'string' in assignment
        y.value = 0
                  ^
    
    expression failed to parse (no further compiler diagnostics)

You can also print it directly:


```mojo
print(y.value)
```

    StringLiteral


## bool

Convert the string to a boolean value. True if the string is not empty, false otherwise.


```mojo
var x = ""
print(x.__bool__())

var y = "a"
print(y.__bool__())
```

    False
    True


## equal

Compare the equality of two strings, receiving other StringLiteral as parameter. True if equal.


```mojo
var x = "abc"
var y = "abc"
var z = "ab"

print(x.__eq__(y))
print(x.__eq__(z))
print(x == y)
```

    True
    False
    True


## not equal

Compare the inequality of two strings, receiving other StringLiteral as parameter. True if not equal.


```mojo
var x = "abc"
var y = "abc"
var z = "ab"

print(x.__ne__(y))
print(x.__ne__(z))
print(x != y)
```

    False
    True
    False


## add

Concatenate two StringLiterals.


```mojo
let x = "hello "
let y = "world"

var c = x.__add__(y)
var d = x + y

print(c)
print(d)
```

    hello world
    hello world


## len

Return the length of the string.


```mojo
var x = "string"
print(x.__len__())
print(len(x))
```

    6
    6


## data

Get raw pointer to the underlying data.

`pointer<scalar<si8>>` is the return type of the method. It means that the method returns a pointer to the underlying data of the string literal. The `si8`` indicates that the data is a sequence of 8-bit signed integers, which is a common way to represent characters in a string.

So, if you have a StringLiteral object, you can call data() on it to get a pointer to its underlying data. This could be useful if you need to pass the string data to a function that requires a pointer, or if you want to perform low-level operations on the string data.


```mojo
var x = "string"
var y = x.data()
x = "alo"
print(y)
print(x)
```

    string
    alo


<CommentService />
