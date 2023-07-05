---
title: FloatLiteral
categories: Builtins
usage: Floating point literal type.
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

Returns true if the value does not equal 0.0


```mojo
if 1.0:
    print("not 0.0")

if not 0.0:
    print("is 0.0")
```

    not 0.0
    is 0.0


## neg

Returns `FloatLiteral` with a swapped sign.


```mojo
print(-x)
```

    -10.0


## lt

Returns true if `lhs` (left hand side) is smaller than `rhs` (right hand side).


```mojo
print(-5.0 < -2.0)
```

    True


## le

Returns true if `lhs` is smaller than or equal to the `rhs`.


```mojo
print(5.0 <= 5.0)
```

    True


## eq

Returns true if `lhs` is equal to `rhs`.


```mojo
print(1.0 == 1.0)
```

    True


## ne

Returns true if `lhs` is not equal to `rhs`.


```mojo
print(1.0 != 2.0)
```

    True


## gt

Returns true if `lhs` is larger than `rhs`.


```mojo
print(3.0 > 2.0)
```

    True


## ge

Returns true if `lhs` is larger than or equal to `rhs`.


```mojo
print(2.0 >= 2.0)
```

    True


## add

returns `lhs` plus `rhs`.


```mojo
print(40.0 + 2.0)
```

    42.0


## sub

returns `lhs` minus `rhs`.


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

returns `lhs` divided by `rhs`.


```mojo
print(5.0 / 2.0)
```

    2.5


## floordiv

Returns `lhs` divided by `rhs` rounded down to the next whole number


```mojo
print(5.0 // 2.0)
```

    2.0


## mod
Returns the remainder of `lhs` divided by `rhs`


```mojo
print(5.0 % 2.0)
```

    1.0


# pow

Returns `lhs` raised to the power of `rhs`


```mojo
print(2.0 ** 8.0)
```

    256.0


## radd, rsub, rmul, rtruediv, rfloordiv, rmod, rpow
Think of the `r` as reversed, for example in `a + b`, if `a` doesn't implement `__add__`, then `b.__radd__(a)` will run instead.

For example create a struct `MyNumber` only implementing `__radd__`:


```mojo
struct MyNumber:
    var value: FloatLiteral

    fn __init__(inout self, num: FloatLiteral):
        self.value = num

    fn __radd__(self, rhs: FloatLiteral) -> FloatLiteral:
        print("running MyNumber 'radd' implementation")
        return self.value + rhs
```


```mojo
let num = MyNumber(40.0)
print(2.0 + num)
```

    running MyNumber 'radd' implementation
    42.0



## iadd, isub, imul, itruediv, ifloordiv, imod, ipow
`i` stands for `in-place`, the `lhs` becomes the result of the operation and a new object is not created.


```mojo
var a = 40.0

a += 2.0
print(a)
```

    42.0



```mojo
a -= 10.0
print(a)
```

    32.0



```mojo
a %= 5.0
print(a)
```

    2.0



```mojo
a /= 3.0
print(a)
```

    0.66666666666666663



```mojo
a *= 20.0
print(a)
```

    13.333333333333332



```mojo
a //= 2.0
print(a)
```

    6.0



```mojo
a **= 2.0
print(a)
```

    36.0


<CommentService />
