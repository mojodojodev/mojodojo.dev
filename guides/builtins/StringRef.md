---
title: StringRef
categories: Builtins
usage: Represent a constant reference to a string, i.e. a sequence of characters and a length, which need not be null terminated.
---

Contributed by [Lorenzobattistela](https://github.com/Lorenzobattistela)

# StringRef

Represent a constant reference to a string, i.e. a sequence of characters and a length, which need not be null terminated.

## init

```mojo
var x = StringRef("a")
print(x)
```

    a

Or specifying the pointer

```mojo
let x = "string"
let ptr = strLit.data()
​
let strRef = StringRef(ptr)
```

Or specifying the pointer and the length

```mojo
let x = "string"
let ptr = strLit.data()
let length = len(strLit)

let strRef = StringRef(ptr, length)
print(strRef.length)
print(strRef.data)
```

    6
    %zi (the pointer)

## fields

`data`: A pointer to the beginning of the string data being referenced.
`length`: The length of the string being referenced.

```mojo
var a : StringRef = StringRef("a")
print(a.data)
print(a.length)
```

    a
    1


## getitem

Get the string value at the specified position. It receives the index of the character to get. You can use the brackets notation to get the character at the specified position.

```mojo
var x = StringRef("hello")
print(x.__getitem__(0))
print(x[1])
```

    h
    e


## equal

Compares two strings are equal.

```mojo
var x = StringRef("hello")
var y = StringRef("hello")
print(x.__eq__(y))
print(x == y)
```

    True
    True


## not equal

Compares two strings are not equal.

```mojo
var x = StringRef("hello")
var y = StringRef("hello")
print(x.__ne__(y))
print(x != y)
```

    False
    False


## length

Returns the length of the string.

```mojo
var x = StringRef("hello")
print(x.__len__())
print(len(x))
```

    5
    5
