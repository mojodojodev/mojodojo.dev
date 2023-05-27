---
title: Pointer
categories: |
  Pointer
usage: |
  Store an address to any type, allowing you to allocate, load and modify single instances or arrays of the type on the heap
---
# Pointer
  Store an address to any `register_passable` type, and allocate `n` amount of them to the heap.

## Import


```mojo
from Pointer import Pointer

from DType import DType
from Random import rand
from Memory import memset_zero
```

## Initialization
Create a struct and use that as the type for the pointer


```mojo
struct Coord:
    var name: StringRef
    var x: UI8 
    var y: UI8
```


```mojo
var p1 = Pointer[Coord].alloc(2)
var p2 = Pointer[Coord].alloc(2)
```

All the values will be garbage, we need to manually zero them if there is a chance we might read the value before writing it, otherwise it'll be undefined behaviour (UB):


```mojo
memset_zero(p1, 2)
memset_zero(p2, 2)
```

## Operators
Perform operations with the two pointers


```mojo
if p1:
    print("p1 is not null")
print("p1 and p2 are equal:", p1 == p2)
print("p1 and p2 are not equal:", p1 != p2)
```

    p1 is not null
    p1 and p2 are equal: False
    p1 and p2 are not equal: True


Let's try printing the zeroed value from the first point:


```mojo
let coord = p1[0]
print(coord.x)
```

    error: Expression [6]:17:19: invalid call to '__getitem__': result cannot bind generic !mlirtype to memory-only type 'Coord'
        let coord = p1[0]
                    ~~^~~
    
    /.modular/Kernels/mojo/Stdlib/Pointer.mojo:118:5: function declared here
        fn __getitem__(self, offset: Int) -> type:
        ^
    


Take note of the above error, a `memory-only` type means it can't be passed through registers, we need that behavior to use the `[x]` syntax on a Pointer. Lets redefine it with `@register_passable` annotated: 


```mojo
@register_passable
struct Coord:
    var name: StringRef
    var x: UI8 
    var y: UI8
```

Now we'll be able to use Python syntax to access objects of type `Coord`:


```mojo
var p1 = Pointer[Coord].alloc(2)
memset_zero(p1, 2)

var coord = p1[0]
print(coord.x)
```

    0


Let's try setting the values


```mojo
coord.x = 5
coord.y = 5
coord.name = "Nose"
```


```mojo
print(p1[0].x)
```

    0


Note above that `coord` is an identifier to memory on the stack or in a register, when we try and print `p1[0]` it hasn't been modified. We
