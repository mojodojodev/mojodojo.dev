---
title: TargetInfo
categories: TargetInfo
usage: Functions related to determining host info such as OS, CPU, width etc.
---

## Width, Alignment and Size


```mojo
from TargetInfo import (
    alignof,
    bitwidthof,
    dtype_alignof,
    dtype_bitwidthof,
    dtype_simd_width,
    dtype_sizeof,
    simd_bit_width,
    simd_byte_width,
    simd_width,
    sizeof
)

from DType import DType
```

### alignof

You can check the alignment of a type, in the struct below it returns 4 bytes:


```mojo
struct Foo:
    var a: UI8
    var b: UI32

print(alignof[Foo]())
```

    4


This means each instance of `Foo` will start at a memory address that is a multiple of 4 bytes, the'll also be 3 bytes of padding to accommodate the `UI8`.

You can use this for anything falling under an `AnyType`:


```mojo
print(alignof[UI64]())
```

    8


### bitwidthof

The same as [alignof](#alignof) above, but uses bits instead of bytes:


```mojo
struct Foo:
    var a: UI8
    var b: UI32

print(bitwidthof[Foo]())
```

    64


There will be 24 bits of padding for this type as each object can only be placed at multiples of 64 in memory

### dtype_alignof
Check the alignment of a DType in bytes


```mojo
print(dtype_alignof[DType.address]())
```

    8


### dtype_bitwidthof
Check the alignment of a DType in bits


```mojo
print(dtype_bitwidthof[DType.address]())
```

    64


### dtype_simd_width

The vector size, e.g. to see how many ui64's can be processed with a single instruction:


```mojo
print(dtype_simd_width[DType.ui64]())
```

    8


### dtype_sizeof
The amount of memory consumed by the dtype in bytes


```mojo
print(dtype_sizeof[DType.address]())
```

    8


### simd_bit_width
The total amount of bits that can be processed at the same time on the host systems SIMD register


```mojo
print(simd_bit_width())
```

    512


Take note how the result of dtype_simd_width[DType.ui64]() shows you how many of that data type can fit into the systems SIMD register, e.g. 512 / 64 = 8

### simd_byte_width

The total amount of bytes that can be processed at the same time on the host systems SIMD register


```mojo
print(simd_byte_width())
```

    64


### simd_width
Shows you how many of this type could be processed by SIMD instructions at the same time


```mojo
print(simd_width[UI64]())
```

    8


### sizeof
The total size in bytes of an `AnyType`


```mojo
print(sizeof[UI8]())
```

    1


## OS


```mojo
from TargetInfo import os_is_linux, os_is_macos, os_is_windows
```

### os_is_linux

Example of conditional compilation based on the operating system:


```mojo
@parameter
if os_is_linux():
    print("this will be included in the binary")
else:
    print("this will be eliminated from compilation process")
```

    this will be included in the binary


### os_is_macos


```mojo
print(os_is_macos())
```

    False


### os_is_windows


```mojo
print(os_is_windows())
```

    False


## Arch


```mojo
from TargetInfo import (
    has_avx,
    has_avx2,
    has_avx512f,
    has_intel_amx,
    has_neon,
    has_sse4,
    is_apple_m1
)
```

### has_avx
[Advanced Vector Extensions](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions) are instructions for x86 SIMD support, they are commonly used in Intel and AMD chips, the first version of AVX first began shipping in 2011.


```mojo
print(has_avx())
```

    True


### has_avx2
[Advanced Vector Extensions 2](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions) are instructions for x86 SIMD support, expanding integer commands to 256 bits, and started shipping in 2013l


```mojo
print(has_avx2())
```

    True


### has_avx512f
[Advanced Vector Extensions 512](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions) added 512 bit support for x86 SIMD instructions, and began shipping in 2016.


```mojo
print(has_avx512f())
```

    True


### has_intel_amx

[AMX](https://en.wikipedia.org/wiki/Advanced_Matrix_Extensions) is an extension to x86 with instructions for special units designed for ML workloads such as TMUL which is a matrix multiply on BF16, it began shipping in 2023.


```mojo
print(has_intel_amx())
```

    False


### has_neon

[Neon](https://en.wikipedia.org/wiki/ARM_architecture_family#Advanced_SIMD_(Neon)) also known as Advanced SIMD is an ARM extension for specialized instructions.


```mojo
print(has_neon())
```

    False


### has_sse4
[SSE4](https://en.wikipedia.org/wiki/SSE4) is the older SIMD instruction extension for x86 processors introduced in the mid 2000's


```mojo
print(has_sse4())
```

    True


### is_apple_m1


The [Apple M1 chip](https://en.wikipedia.org/wiki/Apple_M1) contains a ARM CPU that supports Neon 128 bit instructions and GPU accessible through [metal API](https://developer.apple.com/metal/)


```mojo
print(is_apple_m1())
```

    False

