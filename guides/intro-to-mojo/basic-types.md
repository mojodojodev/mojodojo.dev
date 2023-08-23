---
title: "Basic Types"
categories: "02: Basic Types"
usage: "Get started with Mojo basic types and how to interact with Python"
head:
  - [meta, { name: twitter:card , content: summary }]
  - [meta, { name: twitter:site , content: '@mojodojodev' }]
  - [meta, { name: twitter:title , content: "Intro to Mojo: Basic Types" }]
  - [meta, { name: twitter:description , content: "Get started with Mojo basic types and how to interact with Python" }]
  - [meta, { name: twitter:image , content: "https://mojodojo.dev/hero.png" }]
---

# Basic Types
_This guide is in the early stages, feedback welcomed [on Github](https://github.com/mojodojodev/mojodojo.dev/discussions/categories/feedback)_

## PythonObject
Let's start by running code through the Python interpreter from Mojo to get a [PythonObject](https://docs.modular.com/mojo/MojoPython/PythonObject.html) back:


```mojo
x = Python.evaluate('5 + 10')
print(x)
```

    15


`x` is represented in memory the same way as if we ran this in Python:


```mojo
%%python
x = 5 + 10
print(x)
```

    15


_in the Mojo playground, using `%%python` at the top of a cell will run code through Python instead of Mojo_

`x` is actually a pointer to `heap` allocated memory.

::: tip CS Fundamentals
`stack` and `heap` memory are really important concepts to understand, [this YouTube video](https://www.youtube.com/watch?v=_8-ht2AKyH4) does a fantastic job of explaining it visually. 

If the video doesn't make sense, for now you can use the mental model that:

- `stack` memory is very fast but small, the size of the values are static and can't change at runtime
- `pointer` is an address to lookup the value somewhere else in memory
- `heap` memory is huge and the size can change at runtime, but needs a pointer to access the data which is relatively slow

These concepts will make more sense over time
:::

You can access all the Python keywords by importing `builtins`:


```mojo
let py = Python.import_module("builtins")

py.print("this uses the python print keyword")
```

    this uses the python print keyword


We can now use the `type` builtin from Python to see what the dynamic type of `x` is:


```mojo
py.print(py.type(x))
```

    <class 'int'>


We can read the address that is stored in `x` on the `stack` using the Python builtin `id`


```mojo
py.print(py.id(x))
```

    139732464847136


This is pointing to a C object in Python, and Mojo behaves the same when using a `PythonObject`, accessing the value actually uses the address to lookup the data on the `heap` which comes with a performance cost. 

This is a simplified representation of how the `C Object` being pointed to would look if it were a Python dict:


```mojo
%%python
heap = {
    44601345678945: {
        "type": "int",
        "ref_count": 1,
        "size": 1,
        "digit": 8,
        #...
    }
    #...
}
```

On the stack the simplified representation of `x` would look like this:


```mojo
%%python
[
    { "frame": "main", "variables": { "x": 44601345678945 } }
]
```

`x` contains an address that is pointing to the heap object

In Python we can change the type dynamically:


```mojo
x = "mojo"
```

The object in C will change its representation:


```mojo
%%python
heap = {
    44601345678945 : {
        "type": "string",
        "ref_count": 1,
        "size": 4,
        "ascii": True,
        # utf-8 / ascii for "mojo"
        "value": [109, 111, 106, 111]
        # ...
    }
}
```

Mojo also allows us to do this when the type is a `PythonObject`, it works the exact same way as it would in a Python program.

This allows the runtime to do nice convenient things for us
- once the `ref_count` goes to zero it will be de-allocated from the heap during garbage collection, so the OS can use that memory for something else
- an integer can grow beyond 64 bits by increasing `size`
- we can dynamically change the `type`
- the data can be large or small, we don't have to think about when we should allocate to the heap

However this also comes with a penalty, there is a lot of extra memory being used for the extra fields, and it takes CPU instructions to allocate the data, retrieve it, garbage collect etc.

In Mojo we can remove all that overhead:

## Mojo 🔥


```mojo
x = 5 + 10
print(x)
```

    15


We've just unlocked our first Mojo optimization! Instead of looking up an object on the heap via an address, `x` is now just a value on the stack with 64 bits that can be passed through registers.

This has numerous performance implications:

- All the expensive allocation, garbage collection, and indirection is no longer required
- The compiler can do huge optimizations when it knows what the numeric type is
- The value can be passed straight into registers for mathematical operations
- There is no overhead associated with compiling to bytecode and running through an interpreter
- The data can now be packed into a vector for huge performance gains

That last one is very important in today's world, let's see how Mojo gives us the power to take advantage of modern hardware.

## SIMD

SIMD stands for `Single Instruction, Multiple Data`, hardware now contains special registers that allow you do the same operation across a vector in a single instruction, greatly improving performance, let's take a look:


```mojo
from DType import DType

y = SIMD[DType.uint8, 4](1, 2, 3, 4)
print(y)
```

    [1, 2, 3, 4]


In the definition `[DType.uint8, 4]` are known as `parameters` which means they must be compile-time known, while `(1, 2, 3, 4)` are the `arguments` which can be compile-time or runtime known. 

For example user input or data retrieved from an API is runtime known, and so can't be used as a `parameter` during the compilation process.

In other languages `argument` and `parameter` often mean the same thing, in Mojo it's a very important distinction.

This is now a vector of 8 bit numbers that are packed into 32 bits, we can perform a single instruction across all of it instead of 4 separate instructions:


```mojo
y *= 10
print(y)
```

    [10, 20, 30, 40]


::: tip CS Fundamentals
Binary is how your computer stores memory, with each bit representing a `0` or `1`. Memory is typically `byte` addressable, meaning that each unique memory address points to one `byte`, which consists of 8 `bits`.

This is how the first 4 digits in a `uint8` are represented in hardware:

- 1 = `00000001`
- 2 = `00000010`
- 3 = `00000011`
- 4 = `00000100`

Binary `1` and `0` represents `ON` or `OFF` indicating an electrical charge in the tiny circuits of your computer.

[Check this video](https://www.youtube.com/watch?v=RrJXLdv1i74) if you want more information on binary.
:::

We're packing the data together with SIMD on the `stack` so it can be passed into a SIMD register like this:

`00000001` `00000010` `00000011` `00000100`

The SIMD register in modern CPU's is huge, let's see how big it is in the Mojo playground:


```mojo
from TargetInfo import simdbitwidth
print(simdbitwidth())
```

    512


That means we could pack 64 x 8bit numbers together and perform a calculation on all of it with a single instruction.

You can also initialize SIMD with a single argument:


```mojo
z = SIMD[DType.uint8, 4](1)
print(z)
```

    [1, 1, 1, 1]


## Scalars

Scalar just means a single value, you'll notice in Mojo all the numerics are SIMD scalars:


```mojo
var x = UInt8(1)
x = "will cause an error"
```

    error: Expression [14]:20:9: cannot implicitly convert 'StringLiteral' value to 'SIMD[ui8, 1]' in assignment
        x = "will cause an error"
            ^~~~~~~~~~~~~~~~~~~~~
    


`UInt8` is just an `alias` for `SIMD[DType.uint8, 1]`, you can see all the [numeric SIMD types imported by default here](https://docs.modular.com/mojo/MojoStdlib/SIMD.html):

- Float16
- Float32
- Float64
- Int8
- Int16
- Int32
- Int64
- UInt8
- UInt16
- UInt32
- UInt64

Also notice when we try and change the type it throws an error, this is because Mojo is `strongly typed`

If we use existing Python modules, it will give us back a `PythonObject` that behaves the same `loosely typed` way as it does in Python:


```mojo
np = Python.import_module("numpy")

arr = np.ndarray([5])
print(arr)
arr = "this will work fine"
print(arr)
```

    [0.   0.25 0.5  0.75 1.  ]
    this will work fine


## Strings
In Mojo the heap allocated `String` isn't imported by default:


```mojo
from String import String

s = String("Mojo🔥")
print(s)
```

    Mojo🔥


`String` is actually a pointer to `heap` allocated data, this means we can load a huge amount of data into it, and change the size of the data dynamically during runtime.

Let's cause a type error so you can see the data type underlying the String:


```mojo
x = s.buffer
x = 20
```

    error: Expression [17]:22:10: cannot implicitly convert 'DynamicVector[SIMD[si8, 1]]' value to 'PythonObject' in assignment
        x = s.buffer
            ~^~~~~~~
    


`DynamicVector` is similar to a Python list, here it's storing multiple `int8`'s that represent the characters, let's print the first character:


```mojo
print(s[0])
```

    M


Now lets take a look at the decimal representation:


```mojo
from String import ord

print(ord(s[0]))
```

    77


That's the ASCII code [shown in this table](https://www.ascii-code.com/)

We can build our own string this way, we can put in 78 which is N and 79 which is O


```mojo
from Vector import DynamicVector

let vec = DynamicVector[Int8](2)

vec.push_back(78)
vec.push_back(79)
```

We can use a `StringRef` to get a pointer to the same location in memory, but with the methods required to output the numbers as text:


```mojo
from Pointer import DTypePointer
from DType import DType

let vec_str_ref = StringRef(DTypePointer[DType.int8](vec.data).address, vec.size)
print(vec_str_ref)
```

    NO


Because it points to the same location in `heap` memory, changing the original vector will also change the value retrieved by the reference:


```mojo
vec[1] = 78
print(vec_str_ref)
```

    NN


Create a `deep copy` of the String and allocate it to the heap:


```mojo
from String import String
let vec_str = String(vec_str_ref)

print(vec_str)
```

    NN


Now we've made a copy of the data to a new location in `heap` memory, we can modify the original and it won't effect our copy:


```mojo
vec[0] = 65
vec[1] = 65
print(vec_str)
```

    NN


The other string type is a `StringLiteral`, it's written directly into the binary, when the program starts it's loaded into `read-only` memory, which means it's constant and lives for the duration of the program:


```mojo
var lit = "This is my StringLiteral"
print(lit)
```

    This is my StringLiteral


Force an error to see the type:


```mojo
lit = 20
```

    error: Expression [26]:26:11: cannot implicitly convert 'Int' value to 'StringLiteral' in assignment
        lit = 20
              ^~
    


One thing to be aware of is that an emoji is actually four bytes, so we need a slice of 4 to have it print correctly:


```mojo
emoji = String("🔥😀")
print("fire:", emoji[0:4])
print("smiley:", emoji[4:8])
```

    fire: 🔥
    smiley: 😀


Check out [Maxim Zaks Blog post](https://mzaks.medium.com/counting-chars-with-simd-in-mojo-140ee730bd4d) for more details.

## Other Builtins
These are all of the other builtin types not discussed which are accessible without importing anything, the type can be inferred, but are explicit here for demonstration, for example `let bool: Bool = True` can just be `let bool = True`:

### Bool
Standard Bool type


```mojo
let bool: Bool = True
print(bool == False)
```

    False


### Int
Int is the same size as your architecture e.g. on a 64 bit machine it's 64 bits


```mojo
let i: Int = 2 
print(i)
```

    2


It can also be used as an index:


```mojo
var vec_2 = DynamicVector[Int]()
vec_2.push_back(2)
vec_2.push_back(4)
vec_2.push_back(6)

print(vec_2[i])
```

    6


### FloatLiteral


```mojo
let float: FloatLiteral = 3.3
print(float)
```

    3.2999999999999998



```mojo
let f32 = Float32(float)
print(f32)
```

    3.2999999523162842


### ListLiteral

When you initialize the list the types can be inferred, however when retrieving an item you need to provide the type as a `parameter`:


```mojo
let list: ListLiteral[Int, FloatLiteral, StringLiteral] = [1, 5.0, "Mojo🔥"]
print(list.get[2, StringLiteral]())
```

    Mojo🔥


### Tuple


```mojo
let tup = (1, "Mojo", 3)
print(tup.get[0, Int]())
```

    1


### Slice
A slice follows the python convention of:

`start:end:step`

So for example using Python syntax:


```mojo
let original = String("MojoDojo")
print(original[0:4])
```

    Mojo


You can also represent as:


```mojo
let slice_expression = slice(0, 4)

print(original[slice_expression])
```

    Mojo


And to get every second letter:


```mojo
print(original[0:4:2])
```

    Mj


Or:


```mojo
let slice_expression = slice(0, 4, 2)
print(original[slice_expression])
```

    Mj


### Error
The error type is very simplistic, we'll go into more details on errors in a later chapter:


```mojo
def return_error():
    raise Error("This returns an Error type")

return_error()
```

    Error: This returns an Error type


## Exercises
1. Use the Python interpreter to calculate 2 to the power of 8 in a `PythonObject` and print it
2. Using the Python `math` module, return `pi` to Mojo and print it
3. Initialize two single floats with 64 bits of data and the value 2.0, using the full SIMD version, and the shortened alias version, then multiply them together and print the result.
4. Create a loop using SIMD that prints four rows of data that looks like this:
```
    [1,0,0,0]
    [0,1,0,0]
    [0,0,1,0]
    [0,0,0,1]
```
In Mojo you can create a loop like this:

```mojo
for i in range(4):
    pass
```

## Solutions

### Exercise 1


```mojo
let pow = Python.evaluate("2 ** 8") 
print(pow)
```

    256


### Exercise 2


```mojo
let math = Python.import_module("math")

let pi = math.pi
print(pi)
```

    3.141592653589793


### Exercise 3


```mojo
let left = Float64(2.0)
let right = SIMD[DType.float64, 1](2.0)

print(left * right)
```

    4.0


### Exercise 4


```mojo
for i in range(4):
    simd = SIMD[DType.uint8, 4](0)
    simd[i] = 1
    print(simd)
```

    [1, 0, 0, 0]
    [0, 1, 0, 0]
    [0, 0, 1, 0]
    [0, 0, 0, 1]


<CommentService />
