---
title: Buffer
categories: Buffer
usage: The buffer doesn't own the underlying memory, it's a view over data that is owned by another object
---

# Buffer

The buffer doesn't own the underlying memory, it's a view over data that is owned by another object


```mojo
from Buffer import Buffer
from DType import DType
from Pointer import DTypePointer
```

Allocate 8 `uint8` and pass that pointer into the buffer:


```mojo
let p = DTypePointer[DType.uint8].alloc(8)
let x = Buffer[8, DType.uint8](p)
```

## zero
Zero all the valuees to make sure no garbage data is used:


```mojo
x.zero()
print(x.simd_load[8](0))
```

    [0, 0, 0, 0, 0, 0, 0, 0]


## Get Item and Set Item
Loop through and set each item:


```mojo
for i in range(len(x)):
    x[i] = i

print(x.simd_load[8](0))
```

    [0, 1, 2, 3, 4, 5, 6, 7]


## Copy Init

Copy the buffer `x` to `y`, change the dynamic size to 4, and multiply all the values by 10


```mojo
var y = x
y.dynamic_size = 4

for i in range(y.dynamic_size):
    y[i] *= 10 
```

Now print the values from the original buffer `x`, to show they point to the same data:


```mojo
print(x.simd_load[8](0))
```

    [0, 10, 20, 30, 4, 5, 6, 7]


## simd_store
Utilize Single Instruction Mutliple Data by manipulating 32 bytes of data at the same time:


```mojo
let first_half = x.simd_load[4](0) * 2
let second_half = x.simd_load[4](4) * 10

x.simd_store(0, first_half)
x.simd_store(4, second_half)

print(x.simd_load[8](0))
```

    [0, 20, 40, 60, 40, 50, 60, 70]


## simd_nt_store
`nt` is non-temporal

Skips the cache for memory that isn't going to be accessed soon, so if you have a large amount of data it doesn't fill up the cache and block something else that would benefit from quick access.


```mojo
x.simd_nt_store(0, second_half)
print(x.simd_load[8](0))
```

    [40, 50, 60, 70, 40, 50, 60, 70]


## simd_fill
Store the value in the argument for chunks of the width provided in the parameter


```mojo
x.simd_fill[8](10)
print(x.simd_load[8](0))
```

    [10, 10, 10, 10, 10, 10, 10, 10]


## stack_allocation
Returns a buffer with the data allocated to the stack


```mojo
x.stack_allocation()
print(x.simd_load[8](0))
```

    [10, 10, 10, 10, 10, 10, 10, 10]


## bytecount
Count the total bytes


```mojo
print(x.bytecount())
```

    8


## aligned_simd_store
Some registers work better with different alignments e.g. AVX-512 performs better with 64 bit alignment, so you might want padding for a type like a UInt32


```mojo
x.aligned_simd_store[8, 8](0, 5)
```

## aligned_simd_load
Some registers work better with different alignments e.g. AVX-512 performs better with 64 bit alignment, so you might want padding for a type like a UInt32


```mojo
print(x.aligned_simd_load[8, 8](0))
```

    [5, 5, 5, 5, 5, 5, 5, 5]


## aligned_stack_allocation
Allocate to the stack with a given alignment for extra padding


```mojo
x.aligned_stack_allocation[8]()
```

## prefetch
Specifies hows soon until the data will be visited again and how the data will be used, to optimize for the cache


```mojo
from Intrinsics import PrefetchOptions
x.prefetch[PrefetchOptions().for_read().high_locality()](0)
```

<CommentService />
