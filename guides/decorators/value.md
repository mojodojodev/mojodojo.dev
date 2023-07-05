---
usage: Generates initialization, move and copy boilerplate
---

# @value
Generates boilerplate for a struct, for example on this struct with nothing implemented:


```mojo
struct Pair:
    var x: Int
    var y: Int
```

We can't initialize the struct:


```mojo
let pair = Pair(5, 10)
```

    error: Expression [2]:16:20: 'Pair' does not implement any '__init__' methods in 'let' initializer
        let pair = Pair(5, 10)
                   ~~~~^~~~~~~
    


Until we implement `__init__`:


```mojo
struct Pair:
    var x: Int
    var y: Int

    fn __init__(inout self: Pair, x: Int, y: Int):
        self.x = x
        self.y = y
```


```mojo
let pair = Pair(5, 10)
print(pair.x)
```

    5


But now we can't copy or move it:


```mojo
let pair2 = pair
```

    error: Expression [5]:16:17: value of type 'Pair' cannot be copied into its destination
        let pair2 = pair
                    ^~~~
    



```mojo
let pair2 = pair^
```

    error: Expression [16]:18:21: value of type 'Pair' cannot be copied into its destination
        let pair2 = pair^
                        ^
    
    error: Expression [16]:18:21: expression does not designate a value with a lifetime
        let pair2 = pair^
                        ^
    


Until we implement `__moveinit__` and `__copyinit__`:


```mojo
struct Pair:
    var x: Int
    var y: Int

    fn __init__(inout self, x: Int, y: Int):
        print("Running init")
        self.x = x
        self.y = y

    fn __moveinit__(inout self, owned existing: Self):
        print("Running move init")
        self.x = existing.x
        self.y = existing.x

    fn __copyinit__(inout self, existing: Self):
        print("Running copy init")
        self.x = existing.x
        self.y = existing.y

```


```mojo
let pair = Pair(5, 10)

# Move object
let pair2 = pair^

# Copy object
let pair3 = pair2
```

    Running init
    Running move init
    Running copy init


To generate all that boilerplate for our members you can annotate with `@value`:


```mojo
@value
struct Pair:
    var x: Int
    var y: Int

```

    20
    5


And use it as normal:


```mojo
let pair = Pair(5, 10)

# Move object
var pair2 = pair^
# Copy object
let pair3 = pair2
# Edit original
pair2.x = 20

# Print both the original and copy
print(pair2.x)
print(pair3.x)
```

    20
    5


<CommentService />
