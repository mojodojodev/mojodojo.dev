---
usage: Indicates the values can be passed through registers
---

# @register_passable 
You can decorate a type with `@register_passable` which allows a type to passed through registers and adds some generic behaviour, for example a `UInt32` is just 32 bits for the actual value and can be directly copied into and out of registers, while a `String` contains a pointer that requires special constructor and destructor behavior to allocate and free memory so it's `memory only`.

Create a type with a pair of `UInt32` and mark it register passable:


```mojo
@register_passable
struct Pair:
    var a: UInt32
    var b: UInt32

    fn __init__(a: UInt32, b: UInt32) -> Self:
        return Self{a: 2, b: 4}

    fn __copyinit__(self) -> Self:
        return Self{a: 2, b: 4}

    fn __del__(owned self):
        print("running __del__")
```

`__init__`, `__copyinit__` and `__del__` aren't required, this is just to indicate what you can define on a `@register_passable` type, for example printing something when the object is dropped:


```mojo
fn test():
    let x = Pair(5, 10)
    var y = x
    y.a = 10
    y.b = 20

    print(x.a, x.b)
    print(y.a, y.b)

test()
```

    running __del__
    2 4
    running __del__
    10 20


Generally you will also want to mark it with the [@value](/guides/decorators/value) decorator, which implements all the boilerplate for you:


```mojo
@value
@register_passable
struct Pair:
    var a: Int
    var b: Int

let x = Pair(5, 10)
print(x.a, x.b)
```

    5 10


Trying to define `__moveinit__` will result in an error, the whole idea behind `@register_passable` is that you can copy it into or out of a register by copying:


```mojo
@register_passable
struct Pair:
    var a: Int
    var b: Int

    fn __moveinit__(inout self, owned exisiting: Self):
        self.a = exisiting.a
        self.b = existing.b
```

    error: Expression [11]:10:5: '__moveinit__' is not supported for @register_passable types, they are always movable by copying a register
        fn __moveinit__(inout self, owned exisiting: Self):
        ^
    
    error: Expression [11]:12:18: use of unknown declaration 'existing', 'fn' declarations require explicit variable declarations
            self.b = existing.b
                     ^~~~~~~~
    


## @register_passable("trivial")
This means you can't define:
- `__init__`
- `__copyinit__`
- `__moveinit__`
- `__del__`

It's referred to as `trivial` because it is always pass by copy/value, there is no special logic required for destruction, construction, indirection or anything else. You can think of it like a `Int64` contains just 64 bits of data, generally lives on the stack, and can be copied straight into registers. You don't need any special allocation or memory freeing behaviour because it's `trivial`, copying it around everywhere is the most efficient way to use it. Right now Mojo's generics only work with trivial types because the compiler can treat these trivial types the same, while it can't generalize on objects that require special constructor and destructor behaviour. This will be resolved when `traits` are introduced.

Examples of trivial types:
- Arithmetic types such as `Int`, `Bool`, `Float64` etc.
- Pointers (the address value is trivial, not the data being pointed to)
- Arrays of other trivial types including SIMD
- Struct types decorated with `@register_passable("trivial")`, that can only contain other trivial types:


```mojo
@register_passable("trivial")
struct Pair:
    var a: Int
    var b: Int
```

<CommentService />
