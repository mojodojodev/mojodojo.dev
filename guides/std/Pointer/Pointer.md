---
title: Pointer
categories: |
  Pointer
usage: |
  Store an address to any type, allowing you to allocate, load and modify single instances or arrays of the type on the heap
---
# Pointer
  Store an address to any type, allowing you to allocate, load and modify single instances or arrays of the type on the heap

## Import


```mojo
from Pointer import Pointer

from Memory import memset_zero
from String import String
```

## Initialization
Create a struct and use that as the type for the pointer


```mojo
struct Coord:
    var x: UInt8 
    var y: UInt8
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


## Register Passable

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
    var x: UInt8 
    var y: UInt8
```

Now we'll be able to use Python syntax to access objects of type `Coord`:


```mojo
var p1 = Pointer[Coord].alloc(2)
memset_zero(p1, 2)

var coord = p1[0]
print(coord.x)
```

    0


## Storing Values

Let's try setting the values


```mojo
coord.x = 5
coord.y = 5
print(coord.x)
```

    5



```mojo
print(p1[0].x)
```

    0


Note above that `coord` is an identifier to memory on the stack or in a register, when we try and print `p1[0]` it hasn't been modified. We need to write the data.


```mojo
p1.store(0, coord)
print(p1[0].x)
```

    5


Lets add 5 to it and store it at offset 1


```mojo
coord.x += 5
coord.y += 5

p1.store(1, coord)
```

Now print both the coords:


```mojo
for i in range(2):
    print(p1[i].x)
    print(p1[i].y)
```

    5
    5
    10
    10


## Undefined Behaviour

Now we'll destroy the universe by going outside the bounds we allocated:


```mojo
let third_coord = p1.load(2)
print(third_coord.x)
print(third_coord.y)
```

    179
    85


These are garbage values, we've done something very dangerous that will cause undefined behaviour, and allow attackers to access data they shouldn't.

Let's keep going down this dangerous path:


```mojo
p1 += 2
```

Now the pointer is pointer is pointing straight to unallocated garbage data! Let's have a look:


```mojo
for i in range(2):
    print(p1[i].x)
    print(p1[i].y)
```

    179
    85
    0
    0


Oh no! Let's move back to where we were and free the memory, if we forget to free the memory that'll cause a memory leak if this code runs a lot:


```mojo
p1 -= 2
p1.free()
```

## Build your own struct

It's easy to make mistakes when playing with pointers, let's create a struct to reduce the surface area of potential errors.


```mojo
struct Coords:
    var data: Pointer[Coord]
    var length: Int

    fn __init__(inout self, length: Int) raises:
        self.data = Pointer[Coord].alloc(length)
        memset_zero(self.data, length)
        self.length = length

    fn __getitem__(self, index: Int) raises -> Coord:
        if index > self.length - 1:
            raise Error("Trying to access index out of bounds")
        return self.data.load(index)

    # This is what will run when the object goes out of scope
    fn __del__(owned self):
        return self.data.free()
```

We've added some initial safety, this is the bare minimum but instead of allowing potential undefined behaviour, we're causing the program to throw an error when accessing an index out of bounds:


```mojo
let coords = Coords(5)

print(coords[5].x)
```

    Error: Trying to access index out of bounds


Experiment with your own safety checks and adding functions utilizing the pointer safely, Mojo gives you the power to do whatever you want with pointers, but [always remember what uncle ben said](https://youtu.be/P9qCFIVlNyM?t=12)

<CommentService />
