---
title: FloatLiteral
categories: Builtins
usage: The primitive ListLiteral class in Mojo
---

Contributed by [StitchyPie](https://github.com/StitchyPie)

# FloatLiteral
Floating point literal type.

## init


```mojo
let x = 10.0
print(x)
```

    10.0



```mojo
let y: FloatLiteral = 4 # Must state type otherwise it will default to Int
print(y)
```

    4.0


## bool

`bool` returns true if the value does not equal 0.0


```mojo
if 1.0:
    print("not 0.0")

if not 0.0:
    print("is 0.0")
```

    not 0.0
    is 0.0


## neg

`neg` return `FloatLiteral` with a swapped sign.


```mojo
print(-x)
```

    -10.0


## lt

`lt` return true if `lhs` is smaller than `rhs`.


```mojo
print(-5 < -2)
```

    True


## le

`le` return true if `lhs` is smaller than or equal to the `rhs`.


```mojo
print(5.0 <= 5.0)
```

    True


## eq

`eq` return true if `lhs` is equal to `rhs`.


```mojo
print(1.0 == 1.0)
```

    True


## ne

`ne` return true if `lhs` is not equal to `rhs`.


```mojo
print(1.0 != 2.0)
```

    True


## gt

`gt` return true if `lhs` is larger than `rhs`.


```mojo
print(3.0 > 2.0)
```

    True


## ge

`ge` return true if `lhs` is larger than or equal to `rhs`.


```mojo
print(2.0 >= 2.0)
```

    True


## add

`add` return `lhs` plus `rhs`.


```mojo
print(40.0 + 2.0)
```

    42.0


## sub

`sub` return `lhs` minus `rhs`.


```mojo
print(2.0 - 44.0)
```

    -42.0


## mul

`mul` return `lhs` multiplied by `rhs`.


```mojo
print(21.0 * 2.0)
```

    42.0


## truediv

`truediv` return `lhs` divided by `rhs`.


```mojo
print(5.0 / 2.0)
```

    2.5


## floordiv

`floordiv` return `lhs` divided by `rhs` rounded down to the next whole number


```mojo
print(5.0 // 2.0)
```

    2.0


## mod

`mod` return the remainder of `lhs` divided by `rhs`


```mojo
print(x % y)
```

    2.0


# pow

`pow` return `lhs` raised to the power of `rhs`


```mojo
print(2 ** 8)
```

    256


## radd, rsub, rmul, rtruediv, rfloordiv, rmod, rpow
Think of the `r` as reversed, for example in `a & b`, if `a` doesn't implement `__and__`, then `b.__rand__(a)` will run instead.

## iadd, isub, imul, itruediv, ifloordiv, imod, ipow
`i` stands for `in-place`, the `lhs` becomes the result of the operation and a new object is not created.


```mojo
var a = 2
print(a)
a += 2
print(a)
```

    2
    4

