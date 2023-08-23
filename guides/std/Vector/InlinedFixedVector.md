---
categories: Vector
usage: Contains a statically known vector size, but can also grow dynamically at runtime
---

Contributed by [Alex1957](https://github.com/Alex19578)

# InlinedFixedVector
## import


```mojo
from Vector import InlinedFixedVector
```

## init

You can reserve memory to add elements without the cost of copying everything if it grows too large.

Statically allocate 4 elements, and reserve a capacity of 8 elements


```mojo
var vec = InlinedFixedVector[4, Int](8)
```

## append
To add elements to the vector, you can use the `append` method:


```mojo
vec.append(10)
vec.append(20)

print(len(vec))
```

    6


## variables


```mojo
print(vec.capacity)
print(vec.current_size)
print(vec.dynamic_data[0])
print(vec.static_data[0])
```

    8
    6
    10
    10


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

    6
    6


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


## clear
Deallocates the data in the vector


```mojo
vec.clear()
print(vec[1])
```

    0


<CommentService />
