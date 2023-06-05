# Mojo Basics
This guide assumes some familiarity with a programming language like Python, but does not assume knowledge about computer science fundamentals. It will be a natural stepping stone from Python to Mojo, but also useful for beginners through to experienced programmers to dive in and understand how the language works.

## Basic types
Python is an amazing language because it's so easy to use, but it hides a lot of details from the programmer, and that comes at a performance cost.

Let's run some Python code and print the result in Mojo:


```mojo
x = Python.evaluate("5 + 10")
print(x)
```

    15


Mojo now has the same representation for `x` as Python uses, which is a `pointer` to a C object with a value and a type. Let's explore this a little more using the Python interpreter, we can access all the Python builtin keywords:


```mojo
let py = Python.import_module("builtins")

print(py.id(x))
```

    140704753096992


`id()` gives us an address to the C object that `x` is pointing to, when we `print(x)`, it's actually taking the address stored in `x` and looking up the value at that location in your computers RAM, which comes with a performance cost. Let's dive into this a little further by understanding `stack` and `heap` memory.

## Stack
This is the fast access section of memory that is allocated to your computers RAM, take a simple program:


```mojo
%%python
def double(a):
    return a * 2 

def quad(a):
    return a * 4 

a = 1

a = double(a)
a = quad(a)
```

If we represent the instructions in pseudo code, this is a simplified version of what your `stack` memory would look like as the program runs:


```mojo
%%python
from pprint import pprint
stack = []
stack.append({"frame": "main", "a": 1, "function_calls": ["double(a)", "quad(a)"]})
stack.append({"frame": "add", "a": 1})

pprint(stack)
```

    [{'a': 1, 'frame': 'main', 'function_calls': ['double(a)', 'quad(a)']},
     {'a': 1, 'frame': 'add'}]


The program starts by allocating variables from `main` to the `stack` memory, the first function is `add` so it is then appended to the stack.

The instructions assign the result to the `main` frame `a`, and pops it off the stack, freeing all the variables that were allocated inside `add`:


```mojo
%%python
stack.pop()
stack[0]["a"] *= 2
print(stack)
```

    [{'frame': 'main', 'a': 2, 'function_calls': ['double(a)', 'quad(a)']}]


This is why a `stack` is called Last In First Out (LIFO), because the `last` function to be allocated is the first one `out` of the stack.

Now that's completed the next function call and variable is allocated to the stack memory, `a` in `main` is updated, and then both stack frames are popped which ends the program:


```mojo
%%python
stack.append({"frame": "quad", "a": 2})
stack[0]["a"] *= 4
stack.pop()
stack.pop()
print(stack)
```

    []


## Heap

The Heap memory is much larger, Python uses it for every object to provide us with conveniences, `a` in the previous example doesn't actually contain the value `8` by the end of the program, it contains an address to another place in memory on the heap (simplified):


```mojo
%%python
heap = {
    "a": {
        "type": "int",
        "ref_count": 1,
        "size": 1,
        "digit": 8,
    }
}
```

So on the stack `a` looks more like this for each frame:


```mojo
%%python
[
    {"frame": "main", "a": 44601345678945 }
]
```

Where `a` contains an address that is pointing the heap object, when we do something like:


```mojo
a = "mojo"
```

The object in C will change its representation (simplified):


```mojo
%%python
heap = {
    "a": {
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

This allows Python to do nice convenient things for us
- once the `ref_count` goes to zero it will be de-allocated from the heap during garbage collection
- a integer can grow beyond 64 bits by increasing `size`
- we can dynamically change the `type`

However this also comes with a penalty, there is a lot more extra data being used, and it also takes CPU instructions to allocate the data, retrieve it, deallocate it etc.

In Mojo we can remove all that overhead:


```mojo
let torch = Python.import_module("torch")

print(torch.__version__)
```

    2.0.1+cu117

