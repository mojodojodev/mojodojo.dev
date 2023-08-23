# Definitions 
## inout
Any mutations `in` the function will persist `out` of the function, also known as a mutable reference

## argument
A value that you pass to a function when calling it, or the identifier in the function definition:


```mojo
fn example(argument: Int):
    pass
```

## parameter
Not to be confused with `argument`, these go in the `[]` brackets in a method or function definition. Everything inside these brackets must be known at compile time:


```mojo
fn example[parameter: Int](argument: Int):
    pass
```

The `@parameter` decorator over an `if` statement runs during compilation:


```mojo
from TargetInfo import os_is_linux
@parameter
if os_is_linux():
    print("this will be included in the binary")
else:
    print("this will be eliminated from compilation process")
```

    this will be included in the binary


# register_passable 
You can decorate a type with `@register_passable` to indicate it's not `memory only`, for example a `UInt3232` is just 32 bits for the actual value and can be directly copied into and out of registers, while a `String` contains an address that requires indirection to access the data so it's `memory only`.

Create a type with a pair of `UInt3232` and mark it register passable:


```mojo
@register_passable
struct Pair:
    var a: Int
    var b: Int

    fn __copyinit__(self) -> Self:
        return Self{a: self.a, b: self.b}

    fn __del__(owned self):
        print("dropping")
```

`__copyinit__` and `__del__` aren't required, this is just to indicate that you can define how it copies if you like, and do something special when the object is dropped:


```mojo
fn test():
    let x = Pair{a: 5, b: 10}
    var y = x
    y.a = 10
    y.b = 20

    print(x.a, x.b)
    print(y.a, y.b)

test()
```

    dropping
    5 10
    dropping
    10 20


Generally you just want to mark it with the [@value](/guides/decorators/value) decorator, which will give you everything you need for `value-semantics`:


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


Trying to define `__moveinit__` will result in an error, the whole idea behind `register_passable` is that the type is moveable into or out of a register by copying without any indirection:


```mojo
@register_passable
struct Pair:
    var a: Int
    var b: Int

    fn __moveinit__(inout self, owned exisiting: Self):
        self.a = exisiting.a
        self.b = existing.b
```

    error: Expression [7]:10:5: '__moveinit__' is not supported for @register_passable types, they are always movable by copying a register
        fn __moveinit__(inout self, owned exisiting: Self):
        ^
    
    error: Expression [7]:10:5: '__moveinit__' result type must be 'Pair'
        fn __moveinit__(inout self, owned exisiting: Self):
        ^
    
    error: Expression [7]:12:18: use of unknown declaration 'existing', 'fn' declarations require explicit variable declarations
            self.b = existing.b
                     ^~~~~~~~
    


## trivial
For a trivial type you can't define `__init__`, `__copyinit__`, `__moveinit__`, `__del__`, moving is `trivial` because it always moves by copy, there is no special logic required for indirection or anything else.

Examples of trivial types:
- Arithmetic types such as `Int`, `Bool`, `Float64` etc.
- Pointers
- Arrays of other trivial types including SIMD
- Struct only trivial types decorated with `@register_passable("trivial")`:


```mojo
@register_passable("trivial")
struct Pair:
    var a: Int
    var b: Int
```
