---
title: ListLiteral
categories: Builtins
usage: The primitive ListLiteral class in Mojo
---

Contributed by [StitchyPie](https://github.com/StitchyPie)

# ListLiteral
The primitive ListLiteral class in Mojo.

A ListLiteral, as the name suggests, is a type of data structure representing a list of elements that are immutable, meaning once the list is created, it cannot be altered. This immutability is underlined by its design, which includes only getter methods for accessing elements, with no provision for setters to modify elements post-initialization. Hence, a ListLiteral is essentially a read-only list.

# init
You can initialize a ListLiteral much like in Python, or you can explicitly specify the type of each element using parameterization.


```mojo
let python_list = [1,2,3]
print(python_list)

let explicit_list: ListLiteral[Int, Int, Int] = [1, 2, 3]
print(explicit_list)
```

    [1, 2, 3]
    [1, 2, 3]
    

A ListLiteral can also contain element of different types.


```mojo
let mixed_list: ListLiteral[Int, FloatLiteral, Bool] = [1, 2.0, True]
print(mixed_list)
```

    [1, 2.0, True]
    

# len

ListLiteral also implements the \_\_len\_\_ and get functions.


```mojo
print(mixed_list.__len__())
```

    3
    

# get

Get a list element at the given index and the element type.


```mojo
print(mixed_list.get[0, Int]())
print(mixed_list.get[2, Bool]())
```

    1
    True
    
