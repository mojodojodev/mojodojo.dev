---
title: Bool
categories: Builtins
usage: The primitive Bool scalar value used in Mojo
---

Contributed by [StitchyPie](https://github.com/StitchyPie)

# Bool
The primitive Bool scalar value used in Mojo.

## init


```mojo
var x = True
print(x)

var y: Bool = False
print(y)
```

    True
    False


## fields
`Bool` stores it's data in the member variable `value`:


```mojo
print(my_bool.value)
```

    True


## invert
Flips from `True` to `False` or vice-versa


```mojo
print(True.__invert__())
print(~False)
```

    False
    True


## equal


```mojo
print(True.__eq__(True))
print(True == False)
```

    True
    False


## not equal


```mojo
print(True.__ne__(True))
print(True != False)
```

    False
    True


## and
True if both values are True


```mojo
print(True.__and__(True))
print(True & False)
```

    True
    False


## or
True if any value is True


```mojo
print(True.__or__(False))
print(False or False)
```

    True
    False


## xor
Exclusive or, outputs true if exactly one of two inputs is true


```mojo
print(True.__xor__(True))
print(True ^ False)
print(False ^ True)
print(False ^ False)
```

    False
    True
    True
    False


## ror, rand and rxor

Think of the `r` as reversed, for example in `a & b`, if `a` doesn't implement `__and__`, then `b.__rand__(a)` will run instead.

For example create a struct `MyNumber` and implement `__rand__` with a `Bool`:


```mojo
struct MyNumber:
    var value: FloatLiteral
    fn __init__(inout self, num: FloatLiteral):
        self.value = num

    fn __rand__(self, other: Bool) -> Bool:
        print("Called MyNumber's __rand__ function")
        if self.value > 0.0 and other:
            return True
        return False
```

You normally can't compare a `Bool` with a `FloatLiteral`, but now we implemented `__rand__` we can:


```mojo
let my_number = MyNumber(1.0)
print(True & my_number)
```

    Called MyNumber's __rand__ function
    True


`True.__and__(my_number)` has no implementation, so it reverses it and runs `my_number.__rand__(True)` instead, with the special logic we implemented.

<CommentService />
