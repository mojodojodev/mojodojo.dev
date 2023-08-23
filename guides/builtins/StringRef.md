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
let ptr = x.data()
let str_ref = StringRef(ptr)
print(str_ref)
```

    string



```mojo
let x = "string_2"
let ptr = x.data()
let length = len(x)

let str_ref = StringRef(ptr, length)
print(str_ref.length)
print(str_ref)
```

    8
    string_2


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

