---
usage: Causes the function or if statement to run at compile time
---

# @parameter

## if statement

This will cause the `if` statement to run at compile time, there is no runtime performance cost because the path that doesn't run will be excluded from the final binary:


```mojo
from TargetInfo import os_is_linux

@parameter
if os_is_linux():
    print("this will be included in the binary")
else:
    print("this will be eliminated from compilation process")
```

    this will be included in the binary


## function

This will run at compile time, so that you pay no runtime price for anything inside the function:


```mojo
fn add_print[a: Int, b: Int](): 
    @parameter
    fn add[a: Int, b: Int]() -> Int:
        return a + b

    let x = add[a, b]()
    print(x)

add_print[5, 10]()
```

    15


What this essentially translates to is:


```mojo
fn add_print(): 
    let x = 15
    print(x)

add_print()
```

    15


The `add` calculation ran at compile time, so those extra instructions don't happen at runtime 

<CommentService />
