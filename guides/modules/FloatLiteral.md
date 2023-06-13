---
title: FloatLiteral
categories: Builtins
usage: The primitive ListLiteral class in Mojo
---

Contributed by [StitchyPie](https://github.com/StitchyPie)

# FloatLiteral
The primitive ListLiteral class in Mojo.

## init


```mojo
let x: FloatLiteral = 10.0
print(x)

let y: FloatLiteral = 4 # Must state type otherwise it will default to Int
print(y)
```

    10.0
    4.0
    

# bool

`bool` returns true if the value does not equal 0.


```mojo
print(x.__bool__())
let zero_float: FloatLiteral = 0
print(zero_float.__bool__())
```

    True
    False
    


# neg

`neg` return `FloatLiteral` with a swapped sign.


```mojo
print(x.__neg__())
```

    -10.0
    

# lt

`lt` return true if `lhs` is smaller than `rhs`.


```mojo
print(x < y)
```

    False
    



# le

`le` return true if `lhs` is smaller than or equal to the `rhs`.


```mojo
print(x <= y)
```

    False
    

# eq

`eq` return true if `lhs` is equal to `rhs`.


```mojo
print(x == y)
```

    False
    

# ne

`ne` return true if `lhs` is not equal to `rhs`.


```mojo
print(x != y)
```

    True
    

# gt

`gt` return true if `lhs` is larger than `rhs`.


```mojo
print(x > y)
```

    True
    

# ge

`ge` return true if `lhs` is larger than or equal to `rhs`.


```mojo
print(x >= y)
```

    True
    


# add

`add` return `lhs` plus `rhs`.


```mojo
print(x + y)
```

    14.0
    

# sub

`sub` return `lhs` minus `rhs`.


```mojo
print(x - y)
```

    6.0
    

# mul

`mul` return `lhs` multiplied by `rhs`.


```mojo
print(x * y)
```

    40.0
    

# truediv

`truediv` return `lhs` divided by `rhs`.


```mojo
print(x / y)
```

    2.5
    

# floordiv

`floordiv` return `lhs` divided by `rhs` rounded to negative infinity.


```mojo
print(x // y)
```

    2.0
    

# mod

`mod` return the remainder of `lhs` divided by `rhs`


```mojo
print(x % y)
```

    2.0
    

# pow

`pow` return `lhs` raised to the power of `rhs`


```mojo
print(x.__pow__(y))
```

    10000.0
    

## radd, rsub, rmul, rtruediv, rfloordiv, rmod, rpow

Think of the `r` as reversed, for example in `a & b`, if `a` doesn't implement `__and__`, then `b.__rand__(a)` will run instead.

## iadd, isub, imul, itruediv, ifloordiv, imod, ipow
Think of the `i` as I now become the result of this operation. The `lhs` becomes the result of the operation.


```mojo
print(x)
x.__iadd__(4)
print(x)
```

    10.0
    14.0
    
