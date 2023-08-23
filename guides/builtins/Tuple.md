---
title: Tuple
categories: Builtins
usage: Tuple literal, consists of zero or more values separated by commas.
---

Contributed by [gautam-e](https://github.com/gautam-e)

# Tuple
Tuple literal, consists of zero or more values separated by commas.

## init
These are the same, as `Tuple` can be elided when using `()` brackets:


```mojo
let t = (1, 2, 3)
let t = Tuple(1, 2, 3)
```

You can also use different types inside the tuple, and can be implicit or explicit with the types:


```mojo
let u = ("string", 5.0, 2)
let v: Tuple[StringLiteral, FloatLiteral, Int] = ("string", 5.0, 2)
```

## length

Number of elements in the tuple.


```mojo
print("Length of the tuple:", len(t))
```

    Length of the tuple: 3


## get

Get a specific element in the tuple.


```mojo
print(u.get[1, FloatLiteral]())
```

    5.0


## limitations
You can't get items from a tuple if it's not [@register_passable](/guides/decorators/register_passable.md):


```mojo
@value
struct Coord:
    var x: Int
    var y: Int

var x = (Coord(5, 10), 5.5)

let y = x.get[0, Coord]()
print(y.data[0].x)
```

    error: Expression [2]:23:28: invalid call to 'get': result cannot bind generic !mlirtype to memory-only type 'Coord'
        let y = x.get[0, Coord]()
                ~~~~~~~~~~~~~~~^~
    
    /.modular/Kernels/mojo/Builtin/Tuple.mojo:58:5: function declared here
        fn get[i: Int, T: AnyType](self) -> T:
        ^
    


To remedy this you can mark it as [@register_passable](/guides/decorators/register_passable.md), but it must contain all register passable types:


```mojo
@value
@register_passable
struct Coord:
    var x: Int
    var y: Int

var x = (Coord(5, 10), 5.5)

print(x.get[0, Coord]().x)
```

    5


So items like a `String` won't work.

<CommentService />
