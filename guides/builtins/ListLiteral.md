---
title: ListLiteral
categories: Builtins
usage: The primitive ListLiteral class in Mojo
---

Contributed by [StitchyPie](https://github.com/StitchyPie)

# ListLiteral
The primitive ListLiteral class in Mojo.

A ListLiteral is a list of elements that are immutable, it only includes getter methods for accessing elements, nothing can be modified post-initialization.

# init
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


# len


```mojo
print(len(mixed_list))
```

    3


# get

Get a list element at the given index with the element type:


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
