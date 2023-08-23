---
title: DTypePointer
categories: Pointer
usage: Store an address with a given DType, allowing you to allocate, load and modify data with convenient access to SIMD operations.
---
# DTypePointer
  Store an address with a given DType, allowing you to allocate, load and modify data with convenient access to SIMD operations.

## Import


```mojo
from Pointer import DTypePointer

from DType import DType
from Random import rand
from Memory import memset_zero
```

## Initialization
Create two variables to store a new address on the heap and allocate 8 bytes


```mojo
var p1 = DTypePointer[DType.uint8].alloc(8)
var p2 = DTypePointer[DType.uint8].alloc(8)
```

## Operators
Perform operations with the two pointers


```mojo
if p1:
    print("p1 is not null")
print("p1 is at a lower address than p2:", p1 < p2)
print("p1 and p2 are equal:", p1 == p2)
print("p1 and p2 are not equal:", p1 != p2)
```

    p1 is not null
    p1 is at a lower address than p2: False
    p1 and p2 are equal: False
    p1 and p2 are not equal: True


## Storing and loading SIMD data
First zero all the values for this exercise to make it clear what's happening. 


```mojo
memset_zero(p1, 8)
```

this zeroes 8 bytes as `p1` a pointer of type `UInt8`, if it was `UInt16` it would set 8*16 bits to 0

Grab the 8 values and print them:


```mojo
var all_data = p1.simd_load[8](0)
print(all_data)
```

    [0, 0, 0, 0, 0, 0, 0, 0]


Store some random data in only half of the 8 bytes:


```mojo
rand(p1, 4)
print(all_data)
```

    [0, 0, 0, 0, 0, 0, 0, 0]


Take note that the `all_data` variable does not contain a reference to the heap, it's a sequential 8 bytes on the stack or in a register, so we don't see the changed data yet.

We need to load the data from the heap to see what's now at the address:


```mojo
all_data = p1.simd_load[8](0)
print(all_data)
```

    [0, 33, 193, 117, 0, 0, 0, 0]


Now lets grab the first half, add 1 to the first 4 bytes with a single instruction SIMD (Single Instruction, Multiple Data) and store it in the second half


```mojo
var half = p1.simd_load[4](0)
half = half + 1
p1.simd_store[4](4, half)
```

Load the data again and print it


```mojo
all_data = p1.simd_load[8](0)
print(all_data)
```

    [0, 33, 193, 117, 1, 34, 194, 118]


You're now taking advantage of the hardware by using specialized instructions to perform an operation on 32/64 bytes of data at once, instead of 4 separate operations, and these operations can also run through special registers that can significantly boost performance.

## Pointer Arithmetic
Lets use the same data from the SIMD operators, and shift the pointer address up by 1 byte


```mojo
p1 += 1
all_data = p1.simd_load[8](0)
print(all_data)
```

    [33, 193, 117, 1, 34, 194, 118, 0]


You can see we're now starting from the 2nd byte, and we have a garbage value at the end that we haven't allocated! Be careful as this is undefined behaviour (UB) and a security vulnerability, attackers could take advantage of this. You need to be very careful not to introduce a problem like this when using pointers.

Lets move back to where we were:


```mojo
p1 -= 1
all_data = p1.simd_load[8](0)
print(all_data)
```

    [0, 33, 193, 117, 1, 34, 194, 118]


## Freeing memory
If we don't free the memory, the operating system won't be able to reclaim it, this is one way memory leaks are created.


```mojo
p1.free()
```

We can introduce a security vulnerability by using the pointer after free and accessing the garbage data that's not allocated, don't do this!


```mojo
all_data = p1.simd_load[8](0)
print(all_data)
```

    [99, 206, 45, 92, 5, 0, 0, 0]


## Build your own Struct
Playing with pointers is dangerous! Lets build a safe `struct` abstraction around it that interacts with the pointer, so we have less surface area for potential mistakes.


```mojo
struct Matrix:
    var data: DTypePointer[DType.uint8]

    fn __init__(inout self):
        "Initialize the struct and set everything to zero"
        self.data = DTypePointer[DType.uint8].alloc(64)
        memset_zero(self.data, 64)

    # This is what will run when the object goes out of scope
    fn __del__(owned self):
        return self.data.free()

    # This allows you to use let x = obj[1]
    fn __getitem__(self, row: Int) -> SIMD[DType.uint8, 8]:
        return self.data.simd_load[8](row * 8)

    # This allows you to use obj[1] = SIMD[DType.uint8]()
    fn __setitem__(self, row: Int, data: SIMD[DType.uint8, 8]):
        return self.data.simd_store[8](row * 8, data)

    fn print_all(self):
        print("--------matrix--------")
        for i in range(8):
            print(self[i])
```

Initializing the matrix will set all the values to 0, please take note that the `matrix` identifier is immutable with `let`, but we're still able to modify the data because the `data` member is `var`


```mojo
let matrix = Matrix()
matrix.print_all()
```

    --------matrix--------
    [0, 0, 0, 0, 0, 0, 0, 0]
    [0, 0, 0, 0, 0, 0, 0, 0]
    [0, 0, 0, 0, 0, 0, 0, 0]
    [0, 0, 0, 0, 0, 0, 0, 0]
    [0, 0, 0, 0, 0, 0, 0, 0]
    [0, 0, 0, 0, 0, 0, 0, 0]
    [0, 0, 0, 0, 0, 0, 0, 0]
    [0, 0, 0, 0, 0, 0, 0, 0]


We can loop through and set the values, one row at a time with SIMD using the abstraction we built


```mojo
for i in range(8):
    matrix[i] = i

matrix.print_all()
```

    --------matrix--------
    [0, 0, 0, 0, 0, 0, 0, 0]
    [1, 1, 1, 1, 1, 1, 1, 1]
    [2, 2, 2, 2, 2, 2, 2, 2]
    [3, 3, 3, 3, 3, 3, 3, 3]
    [4, 4, 4, 4, 4, 4, 4, 4]
    [5, 5, 5, 5, 5, 5, 5, 5]
    [6, 6, 6, 6, 6, 6, 6, 6]
    [7, 7, 7, 7, 7, 7, 7, 7]


Because it's returning a `SIMD[DType.u8, 8]`, we can also modify the column value using `__setitem__` from the SIMD implementation


```mojo
for i in range(8):
    matrix[i][0] = 9
    matrix[i][7] = 9

matrix.print_all()
```

    --------matrix--------
    [9, 0, 0, 0, 0, 0, 0, 9]
    [9, 1, 1, 1, 1, 1, 1, 9]
    [9, 2, 2, 2, 2, 2, 2, 9]
    [9, 3, 3, 3, 3, 3, 3, 9]
    [9, 4, 4, 4, 4, 4, 4, 9]
    [9, 5, 5, 5, 5, 5, 5, 9]
    [9, 6, 6, 6, 6, 6, 6, 9]
    [9, 7, 7, 7, 7, 7, 7, 9]


For one more example lets try grabbing the fourth row, doubling it, and then writing that to the first row


```mojo
var fourth_row = matrix[3]
print("\nforth row:", fourth_row)
fourth_row *= 2
print("modified:", fourth_row, "\n")

matrix[0] = fourth_row
matrix.print_all()
```

    
    forth row: [9, 3, 3, 3, 3, 3, 3, 9]
    modified: [18, 6, 6, 6, 6, 6, 6, 18] 
    
    --------matrix--------
    [18, 6, 6, 6, 6, 6, 6, 18]
    [9, 1, 1, 1, 1, 1, 1, 9]
    [9, 2, 2, 2, 2, 2, 2, 9]
    [9, 3, 3, 3, 3, 3, 3, 9]
    [9, 4, 4, 4, 4, 4, 4, 9]
    [9, 5, 5, 5, 5, 5, 5, 9]
    [9, 6, 6, 6, 6, 6, 6, 9]
    [9, 7, 7, 7, 7, 7, 7, 9]


We've created a specific specialized data type that is optimized to perform operations on a matrix of data 8*8 bytes wide, experiment yourself, create a function to manipulate the entire matrix of 64 bytes using SIMD.

Mojo gives you the power to do whatever you want with pointers, but [always remember what uncle ben said](https://youtu.be/P9qCFIVlNyM?t=12)

<CommentService />
