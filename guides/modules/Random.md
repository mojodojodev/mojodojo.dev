---
title: Random
categories: Random
usage: "Provides functions for random numbers"
---

# Random
Provides functions for random numbers


```mojo
from Random import rand, randint
from Pointer import DTypePointer
from DType import DType
from Memory import memset_zero
```

Let's create a two variables to store new addresses on the heap and allocate space for 8 values (note the different `DType`s).


```mojo
var p1 = DTypePointer[DType.ui8].alloc(8)
var p2 = DTypePointer[DType.f32].alloc(8)
```

To start with a clean slate, lets zero them out first.


```mojo
memset_zero(p1,8)
memset_zero(p2,8)
```


```mojo
print('values at p1:', p1.simd_load[8](0))
print('values at p2:', p2.simd_load[8](0))
```

    values at p1: [0, 0, 0, 0, 0, 0, 0, 0]
    values at p2: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]


## rand

Fill the 8 values with random integer values.


```mojo

rand[DType.ui8](p1, 8)
rand[DType.f32](p2, 8)
print('values at p1:', p1.simd_load[8](0))
print('values at p2:', p2.simd_load[8](0))

```

    values at p1: [0, 33, 193, 117, 136, 56, 12, 173]
    values at p2: [0.1315377950668335, 0.458650141954422, 0.21895918250083923, 0.67886471748352051, 0.93469291925430298, 0.51941639184951782, 0.034572109580039978, 0.52970021963119507]


## randint
Fill memory with integer values within a range, e.g. 0 to 10.


```mojo
randint[DType.ui8](p1, 8, 0, 10)
print(p1.simd_load[8](0))
```

    [7, 10, 4, 5, 9, 0, 0, 5]


## random_f64

Returns a single random `Float64` value within a specified range e.g 0.0 to 1.0.


```mojo
from Random import random_f64
print(random_f64(0.0, 1.0))
```

    0.007698186061599179


## random_si64

Returns a single random `Int64` value within a specified range e.g -10 to +10.


```mojo
from Random import random_si64
print(random_si64(-10, 10))
```

    -10


## random_ui64

Returns a single random `UInt64` value within a specified range e.g 0 to 10.


```mojo
from Random import random_ui64
print(random_ui64(0, 10))
```

    7

