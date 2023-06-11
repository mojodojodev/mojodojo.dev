---
title: NDBuffer
categories: Buffer
usage: A buffer that doesn't own the underlying memory, it allows you to represent an N-Dimensional shape both statically, and dynamically at runtime
---

# NDBuffer
A buffer that doesn't own the underlying memory, it allows you to represent an N-Dimensional shape both statically, and dynamically at runtime

## Imports


```mojo
from DType import DType
from List import DimList
from Pointer import DTypePointer
from Buffer import NDBuffer
from Memory import memset_zero
from List import VariadicList, DimList
```

## Setup
This struct allows you to carry around the pointer that owns the data the NDBuffer is pointing to.

Take notice of the parameters in the `[]` brackets for example `DT`:


```mojo
struct Tensor[RANK: Int, SHAPE: DimList, DT: DType]:
    var data: DTypePointer[DT]
    var buffer: NDBuffer[RANK, SHAPE, DT]

    fn __init__(inout self):
        let size = SHAPE.product[RANK]().get()
        self.data = DTypePointer[DT].alloc(size)
        memset_zero(self.data, size)
        self.buffer = NDBuffer[RANK, SHAPE, DT](self.data)

    fn __del__(owned self):
        self.data.free()
```

## Initialization
We can now create a shape statically and store data, but be careful there's no safety checks on our struct yet:


```mojo
let x = Tensor[3, DimList(2, 2, 2), DType.uint8]()
x.data.simd_store(0, SIMD[DType.uint8, 8](1, 2, 3, 4, 5, 6, 7, 8))
```

## Usage

Let's try using the buffer now:


```mojo
print(x.buffer.num_elements())
```

    8


We can also access elements via it's 3D shape:


```mojo
print(x.buffer[0, 0, 0])
```

    1


Notice incrementing the first dimension will get the 5th item:


```mojo
print(x.buffer[1, 0, 0])
```

    5


And incrementing the 2nd dimension will increment get the 7th:


```mojo
print(x.buffer[1, 1, 0])
```

    7


## Bounds Checking

There are no safety checks on our struct yet so we can access data out of bounds:


```mojo
print(x.buffer[1, 1, 2])
```

    0


This is a big safety concern so let's make our own `__get__` method that enforces bounds checking:


```mojo
struct Tensor[rank: Int, shape: DimList, type: DType]:
    var data: DTypePointer[type]
    var buffer: NDBuffer[rank, shape, type]
    fn __init__(inout self):
        let size = shape.product[rank]().get()
        self.data = DTypePointer[type].alloc(size)
        memset_zero(self.data, size)
        self.buffer = NDBuffer[rank, shape, type](self.data)

    fn __del__(owned self):
        self.data.free()

    fn __getitem__(self, *idx: Int) raises -> SIMD[type, 1]:
        for i in range(rank):
            if idx[i] >= shape.value[i].get():
                raise Error("index out of bounds")
        return self.buffer.simd_load[1](VariadicList[Int](idx))
```


```mojo
let x = Tensor[3, DimList(2, 2, 2), DType.uint64]()
x.data.simd_store(0, SIMD[DType.uint64, 8](0, 1, 2, 3, 4, 5, 6, 7))

print(x[0, 2, 0])
```

    Error: index out of bounds


## Compile Time Bounds Checking
This bounds checking isn't optimal because it has a runtime cost, we could create a separate function that checks the shape at compile time:


```mojo
from Assert import assert_param
from Functional import unroll
```


```mojo
struct Tensor[rank: Int, shape: DimList, type: DType]:
    var data: DTypePointer[type]
    var buffer: NDBuffer[rank, shape, type]
    fn __init__(inout self):
        let size = shape.product[rank]().get()
        self.data = DTypePointer[type].alloc(size)
        memset_zero(self.data, size)
        self.buffer = NDBuffer[rank, shape, type](self.data)

    fn get[*idx: Int](self) -> SIMD[type, 1]:
        @parameter
        fn check_dim[i: Int]():
            assert_param[idx[i] < shape.value[i].get()]()

        unroll[rank, check_dim]()

        return self.buffer.simd_load[1](VariadicList[Int](idx))
```

`*idx` is a variadic list of `Int`, so you can pass in as many as you like.

`get()` Creates a closure named `check_dim` decorated by `@parameter` so it runs at compile time, it's checking that each item in `*idx` is less then the same dimension in the static `shape`. `unroll` is used to run it at compile-time `i` amount of times.


```mojo
let x = Tensor[3, DimList(2, 2, 2), DType.uint64]()
x.data.simd_store(0, SIMD[DType.uint64, 8](0, 1, 2, 3, 4, 5, 6, 7))
```


```mojo
print(x.get[1, 1, 2]())
```

    error: Expression [14]:6:1: no viable expansions found
    fn __lldb_expr__(inout __mojo_repl_arg: __mojo_repl_context__):
    ^
    
    Expression [14]:8:28:   call expansion failed - no concrete specializations
        __mojo_repl_expr_impl__(__mojo_repl_arg, __get_address_as_lvalue(__mojo_repl_arg.`x`.load().address))
                               ^
    
    Expression [14]:12:1:     no viable expansions found
    def __mojo_repl_expr_impl__(inout __mojo_repl_arg: __mojo_repl_context__, inout `x`: __mlir_type.`!kgen.declref<@"$Expression [12]"::@Tensor<rank: @"$Int"::@Int = #lit.struct<{value: scalar<index> = 3}>, shape: @"$List"::@DimList = apply(:<>(!kgen.variadic<@"$List"::@Dim> borrow) vararg -> !kgen.declref<@"$List"::@DimList> @"$List"::@DimList::@"__init__($List::Dim*)", [#lit.struct<{value: variant<i1, @"$Int"::@Int> = #pop.variant<:@"$Int"::@Int #lit.struct<{value: scalar<index> = 2}>>}>, #lit.struct<{value: variant<i1, @"$Int"::@Int> = #pop.variant<:@"$Int"::@Int #lit.struct<{value: scalar<index> = 2}>>}>, #lit.struct<{value: variant<i1, @"$Int"::@Int> = #pop.variant<:@"$Int"::@Int #lit.struct<{value: scalar<index> = 2}>>}>]), type: @"$DType"::@DType = #lit.struct<{value: dtype = ui64}>>>`) -> None:
    ^
    
    Expression [14]:19:26:       call expansion failed - no concrete specializations
      __mojo_repl_expr_body__()
                             ^
    
    Expression [14]:14:3:         no viable expansions found
      def __mojo_repl_expr_body__() -> None:
      ^
    
    Expression [14]:16:25:           call expansion failed - no concrete specializations
        print(x.get[1, 1, 2]())
                            ^
    
    Expression [12]:14:5:             no viable expansions found
        fn get[*idx: Int](self) -> SIMD[type, 1]:
        ^
    
    Expression [12]:19:32:               call expansion failed - no concrete specializations
            unroll[rank, check_dim]()
                                   ^
    
    /.modular/Kernels/mojo/Stdlib/Functional.mojo:48:1:                 no viable expansions found
    fn unroll[
    ^
    
    /.modular/Kernels/mojo/Stdlib/Functional.mojo:59:33:                   call expansion failed - no concrete specializations
        _unroll_impl[0, count, func]()
                                    ^
    
    /.modular/Kernels/mojo/Stdlib/Functional.mojo:63:1:                     no viable expansions found
    fn _unroll_impl[
    ^
    
    /.modular/Kernels/mojo/Stdlib/Functional.mojo:71:43:                       call expansion failed - no concrete specializations
            _unroll_impl[idx + 1, count, func]()
                                              ^
    
    /.modular/Kernels/mojo/Stdlib/Functional.mojo:63:1:                         no viable expansions found
    fn _unroll_impl[
    ^
    
    /.modular/Kernels/mojo/Stdlib/Functional.mojo:71:43:                           call expansion failed - no concrete specializations
            _unroll_impl[idx + 1, count, func]()
                                              ^
    
    /.modular/Kernels/mojo/Stdlib/Functional.mojo:63:1:                             no viable expansions found
    fn _unroll_impl[
    ^
    
    /.modular/Kernels/mojo/Stdlib/Functional.mojo:70:18:                               call expansion failed - no concrete specializations
            func[idx]()
                     ^
    
    Expression [12]:16:9:                                 no viable expansions found
            fn check_dim[i: Int]():
            ^
    
    Expression [12]:17:56:                                   constraint failed: param assertion failed
                assert_param[idx[i] < shape.value[i].get()]()
                                                           ^
    


## simd_load
Loads SIMD values from the specified position, e.g.:


```mojo
print(x.buffer.simd_load[4](0, 0, 0))
print(x.buffer.simd_load[4](1, 0, 0))
print(x.buffer.simd_load[2](1, 1, 0))
```

    [0, 1, 2, 3]
    [4, 5, 6, 7]
    [6, 7]


## simd_store
Store a SIMD vector at the given ND index, for example here we take the first 4 numbers, multiply them by 8, and store them in the second half of the tensor.


```mojo
from Index import StaticIntTuple

x.buffer.simd_store(StaticIntTuple[3](1, 0, 0), x.buffer.simd_load[4]() * 8)
print(x.buffer.simd_load[8]())
```

    [0, 1, 2, 3, 0, 8, 16, 24]


## `__setitem__`


```mojo
x.buffer[StaticIntTuple[3](1, 1, 1)] = 50
print(x.get[1, 1, 1]())
```

    50


## Fields


```mojo
print(x.buffer.dynamic_dtype)
print(x.buffer.dynamic_shape)
print(x.buffer.dynamic_stride)
print(x.buffer.is_contiguous)
```

    uint64
    (2, 2, 2)
    (4, 2, 1)
    True


## bytecount
The total amount of bytes in the buffer


```mojo
print(x.buffer.bytecount())
```

    64


## dim
The dimension at the given index


```mojo
print(x.buffer.dim[0]())
```

    2


## fill
Fills the buffer in chunks of you SIMD register size, but doesn't go out of bounds


```mojo
x.buffer.fill(10)
print(x.buffer[1, 1, 1])
```

    10


## flatten
Returns a buffer of 1 dimension


```mojo
var y = x.buffer.flatten()
print(y[7])
```

    10


## get_nd_index
Get the N-Dimensional Index needed to access the nth item


```mojo
print(x.buffer.get_nd_index(5))
```

    (1, 0, 1)


## get_rank
The total amount of dimensions


```mojo
print(x.buffer.get_rank())
```

    3


## get_shape
A tuple indicating dimensions of the buffer.


```mojo
print(x.buffer.get_shape())
```

    (2, 2, 2)


## num_elements
Calculates the total number of elements in the buffer, works the same as `size`


```mojo
print(x.buffer.num_elements())
```

    8


## size
Calculates the total number of elements in the buffer, works the same as `num_elements`


```mojo
print(x.buffer.size())
```

    8


## stack_allocation
Return a new NDBuffer that is backed by stack allocated data, aligned to the DType


```mojo
let new = x.buffer.stack_allocation()

print(new.size())
```

    8


## stride
The step size of a dimension, e.g. in a `2x2x2` tensor if you increment the first dimension, you'll skip over 4 elements:


```mojo
print(x.buffer.stride(0))
```

    4


Lets prove this by seeing how we could access the 4th element:


```mojo
print(x.buffer.get_nd_index(4))
```

    (1, 0, 0)


## zero
Set all elements to the zero value


```mojo
x.buffer.zero()
print(x.get[0, 0, 0]())
```

    0
