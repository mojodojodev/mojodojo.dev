---
title: UnsafeFixedVector
categories: Vector
usage: Can not be resized after initialization, but size can be runtime known
---

Contributed by [Alex1957](https://github.com/Alex19578)

# UnsafeFixedVector
## import


```mojo
from Vector import UnsafeFixedVector
```

## Init

You can reserve memory to add elements without the cost of copying everything if it grows too large.

Statically allocate 4 elements, and reserve a capacity of 8 elements


```mojo
var vec = UnsafeFixedVector[Int](8)
```

## append
To add elements to the vector, you can use the `append` method:


```mojo
vec.append(10)
vec.append(20)

print(len(vec))
```

    2


## variables


```mojo
print(vec.capacity)
print(vec.data[0])
print(vec.size)
```

    8
    10
    2


## indexing
You can access and assign elements using indexes

::: warning
No bounds checking, can access garbage data
:::


```mojo
print(vec[0])
```

    10



```mojo
vec[1] = 42
print(vec[1])
```

    42


::: warning
Setting elements this way won't increase the `len` so may lead to errors, you should only use `append` to add a new element, and use this to modify existing elements
:::


```mojo
print(len(vec))
vec[6] = 10
print(len(vec))
```

    2
    2


## copying

This will result in a shallow copy, it'll be a pointer to the same location in memory:


```mojo
var vec2 = vec
```

If we modify `vec` then `vec2` will also be updated:


```mojo
vec[0] = 99
print(vec2[0])
```

    99


There is no deep copy for this type

## clear
Deallocates the data in the vector


```mojo
vec.clear()
print(vec[1])
```

    0


<CommentService />
