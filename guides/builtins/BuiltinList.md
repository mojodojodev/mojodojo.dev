---
title: BuiltinList
categories: Builtins
usage: The primitive ListLiteral class in Mojo
---

Contributed by [StitchyPie](https://github.com/StitchyPie) and [Lorenzobattistela](https://github.com/Lorenzobattistela)

# BuiltinList
The primitive ListLiteral class in Mojo.

A ListLiteral is a list of elements that are immutable, it only includes getter methods for accessing elements, nothing can be modified post-initialization.

## init
The types can be implicit:


```mojo
let list = [1,2,3]
print(list)
```

    [1, 2, 3]


Or explicit:


```mojo
let explicit_list: ListLiteral[Int, Int, Int] = [1, 2, 3]
print(explicit_list)
```

    [1, 2, 3]


A ListLiteral can also contain elements of different types.


```mojo
let mixed_list= [1, 2.0, True]
print(mixed_list)
```

    [1, 2.0, True]


## fields
- storage: this is the MLIR type that stores the literals, we'll force an error to see what `mixed_list` storage looks like:


```mojo
mixed_list.storage = 0
```

    error: Expression [8]:20:26: cannot implicitly convert 'Int' value to '!pop.pack<[!kgen.declref<_"$Builtin"::_"$Int"::_Int>, !kgen.declref<_"$Builtin"::_"$FloatLiteral"::_FloatLiteral>, !kgen.declref<_"$Builtin"::_"$Bool"::_Bool>]>' in assignment
        mixed_list.storage = 0
                             ^
    
    expression failed to parse (no further compiler diagnostics)

## len


```mojo
print(len(mixed_list))
```

    3


## get

Get a list element at the given index with the element type, note that we have to specify the index of the element and the type of the element we're retrieving, refer to [parametrization here](https://docs.modular.com/mojo/programming-manual.html#defining-parameterized-types-and-functions)


```mojo
print(mixed_list.get[0, Int]())
print(mixed_list.get[2, Bool]())
```

    1
    True



```mojo
let x = -1
print(x.__index__())
```

    -1


<CommentService />
