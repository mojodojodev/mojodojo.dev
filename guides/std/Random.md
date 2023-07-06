---
title: Random
categories: Random
usage: "Provides functions for random numbers"
---

Contributed by [gautam](https://github.com/gautam-e)

# Random

Provides functions for random numbers


```mojo
from Random import rand, randint
from Pointer import DTypePointer
from DType import DType
from Memory import memset_zero
```

Let's create a two variables to store new addresses on the heap and allocate space for 8 values, note the different `DType`:


```mojo
var p1 = DTypePointer[DType.uint8].alloc(8)
var p2 = DTypePointer[DType.float32].alloc(8)
```

Zero them to ensure we don't read garbage memory:


```mojo
memset_zero(p1, 8)
memset_zero(p2, 8)
```


```mojo
print('values at p1:', p1.simd_load[8](0))
print('values at p2:', p2.simd_load[8](0))
```

    values at p1: [0, 0, 0, 0, 0, 0, 0, 0]
    values at p2: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]


## rand

Fill with 8 random numbers:


```mojo

rand[DType.uint8](p1, 8)
rand[DType.float32](p2, 8)
print('values at p1:', p1.simd_load[8](0))
print('values at p2:', p2.simd_load[8](0))

```

    values at p1: [171, 1, 98, 17, 106, 175, 150, 238]
    values at p2: [0.066842235624790192, 0.68677270412445068, 0.93043649196624756, 0.52692878246307373, 0.65391898155212402, 0.70119059085845947, 0.76219803094863892, 0.047464512288570404]


## randint
Fill memory with integer values within a range, e.g. 0 to 10.


```mojo
randint[DType.uint8](p1, 8, 0, 10)
print(p1.simd_load[8](0))
```

    [9, 5, 1, 7, 4, 7, 10, 8]


## random_float64

Returns a single random `Float64` value within a specified range e.g 0.0 to 1.0.


```mojo
from Random import random_float64
print(random_float64(0.0, 1.0))
```

    0.32823422616000769


## random_si64

Returns a single random `Int64` value within a specified range e.g -10 to +10.


```mojo
from Random import random_si64
print(random_si64(-10, 10))
```

    -8


## random_ui64

Returns a single random `UInt64` value within a specified range e.g 0 to 10.


```mojo
from Random import random_ui64
print(random_ui64(0, 10))
```

    2


<CommentService />
