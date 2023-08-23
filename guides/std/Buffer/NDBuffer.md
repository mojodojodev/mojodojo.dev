---
title: NDBuffer
categories: Buffer
usage: A buffer that doesn't own the underlying memory, it allows you to represent an N-Dimensional shape both statically, and dynamically at runtime
---

# NDBuffer
A buffer that doesn't own the underlying memory, it allows you to represent an N-Dimensional shape both statically, and dynamically at runtime

## import


```mojo
from DType import DType
from List import DimList
from Pointer import DTypePointer
from Buffer import NDBuffer
from Memory import memset_zero
from List import VariadicList, DimList
from Assert import assert_param
from Functional import unroll
from Index import StaticIntTuple
```

## setup
This struct allows you to carry around the pointer that owns the data the NDBuffer is pointing to.


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
```

## init
We can now create a shape statically and store data, but be careful there's no safety checks on our struct yet:


```mojo
let x = Tensor[3, DimList(2, 2, 2), DType.uint8]()
x.data.simd_store(0, SIMD[DType.uint8, 8](1, 2, 3, 4, 5, 6, 7, 8))
```

Let's try using the buffer now:


```mojo
print(x.buffer.num_elements())
```

    8


## indexing

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


To set an item we need to use a `StaticIntTuple`


```mojo
x.buffer[StaticIntTuple[3](1, 1, 1)] = 50
print(x.buffer[1, 1, 1])
```

    50


## runtime bounds checking

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


## compile time bounds checking
This bounds checking isn't optimal because it has a runtime cost, we could create a separate function that checks the shape at compile time:


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

    Expression [12]:17:56:                             constraint failed: param assertion failed
                assert_param[idx[i] < shape.value[i].get()]()
                                                           ^
    
    expression failed to parse (no further compiler diagnostics)

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
x.buffer.simd_store(StaticIntTuple[3](1, 0, 0), x.buffer.simd_load[4]() * 8)
print(x.buffer.simd_load[8]())
```

    [0, 1, 2, 3, 0, 8, 16, 24]


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


<CommentService />
