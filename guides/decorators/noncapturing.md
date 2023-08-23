---
usage: Marks a closure as not capturing variables from the outer scope
---

# @noncapturing
Marks a closure as not capturing variables from the outer scope.

Mojo considers closures capturing by default, even if it's not capturing anything, for example if you don't put the `capturing` keyword after `fn()` you'll get a compiler error:


```mojo
fn outer(f: fn() -> None):
    f()

fn call_it():
    fn inner():
        print("inner")

    outer(inner) 

call_it()
```

    error: Expression [5]:12:10: invalid call to 'outer': argument #0 cannot be converted from 'fn() capturing -> None' to 'fn() -> None'
        outer(inner) 
        ~~~~~^~~~~~~
    
    Expression [5]:5:1: function declared here
    fn outer(f: fn() -> None):
    ^
    
    expression failed to parse (no further compiler diagnostics)

You can fix it by adding the `capturing` keyword:


```mojo
fn outer(f: fn() capturing -> None):
    f()

fn call_it():
    fn inner():
        print("inner")

    outer(inner) 

call_it()
```

    inner


Alternatively, because it's not actually capturing any outer values you can annotate with `@noncapturing`:


```mojo
fn outer(f: fn() -> None):
    f()

fn call_it():
    @noncapturing
    fn inner():
        print("inner")

    outer(inner) 

call_it()
```

    inner


To give you a sense of what capturing is in a closure, let's take a look:


```mojo
fn outer(f: fn() capturing -> Int):
    print(f())

fn call_it():
    let a = 5 
    fn inner() -> Int:
        return a

    outer(inner) 

call_it()
```

    5


You can see that we captured the `a` variable in the inner closure and returned it to the outer function

<CommentService />
