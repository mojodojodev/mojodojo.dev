---
title: DynamicVector
categories: Vector
usage: Dynamically allocated vector
---

Contributed by [Alex1957](https://github.com/Alex19578)

# DynamicVector
## import


```mojo
from Vector import DynamicVector
```

## init

You can reserve memory to add elements without the cost of copying everything if it grows too large.

Reserve 8 elements worth of memory:


```mojo
var vec = DynamicVector[Int](8)
```

## push_back
To add elements to the vector, you can use the `push_back` method:


```mojo
vec.push_back(10)
vec.push_back(20)

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
Setting elements this way won't increase the `len` so may lead to errors, you should only use `push_back` to add a new element, and use this to modify existing elements
:::


```mojo
print(len(vec))
vec[6] = 10
print(len(vec))
```

    2
    2
    10


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


Use deep copy to copy all the data to a different location in memory so it's independent from the original:


```mojo
var vec3 = vec.deepcopy()
```

Modifying the original now won't effect the new copy:


```mojo
vec[1] = 100
print(vec3[1])
```

    42


## pop_back

Access the last element, deallocate it, and reduce the element size by 1:

::: warning
This will access garbage data if there are no elements left
:::


```mojo
print(vec.pop_back())
```

    100


## reserve
If it's greater than the current capacity then data is reallocated and moved:


```mojo
vec.reserve(16)
print(vec.capacity)
```

    16


## resize
Discard elements if smaller then current size, add uninitialized data if larger:


```mojo
vec.resize(16)
print(vec.size)
```

    16


## clear
Deallocates the data in the vector


```mojo
vec.clear()
print(vec[1])
```

    0


<CommentService />
