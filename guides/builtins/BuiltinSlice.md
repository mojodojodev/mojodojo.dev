---
title: BuiltinSlice
categories: Builtins
usage: Implements slice.
---

Contributed by [Lorenzobattistela](https://github.com/Lorenzobattistela)

# slice

Represents a slice expression.
Objects of this type are generated when slice syntax `[a:b:c]` is used.

## init

We can initialize slices by specifying where it should stop. If we don't specify a start, it will default to 0. If we don't specify a step, it will default to 1. The step is the number of elements to skip between each element.


```mojo
from String import String

var x = String("slice it!")
var a : slice = slice(5)
var b : slice = slice(5, 9)
var c : slice = slice(1, 4, 2)

print(x[a])
print(x[b])
print(x[c])
```

    slice
     it!
    lc

