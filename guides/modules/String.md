---
title: String
categories: String
usage: A mutable string
---
# String

## Join


```mojo
from String import String

var s = String(",")
```

The `join` function has a similar syntax to Python's `join`. You can join elements using the current string as a delimiter.


```mojo
print(s.join('a', 'b'))
print(s.join(40, 2))
```

    a,b
    40,2


You can also use it to join elements of a StaticIntTuple.


```mojo
from Index import StaticIntTuple

var sit = StaticIntTuple[3](1,2,3)
print(s.join(sit))
```

    1,2,3


## atol


```mojo
from String import atol

var n = atol("19")
print(n)
```

    19



```mojo
var e = atol("hi")
print(e)
```

    Error: String is not convertible to integer.


## chr


```mojo
from String import chr

print(chr(97))
```

    a


## ord


```mojo
from String import ord

print(ord('a'))
```

    97
