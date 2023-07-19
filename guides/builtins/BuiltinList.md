---
title: BuiltinList
categories: Builtins
usage: Implements the ListLiteral class. The type of a literal heterogenous list expression.
---

Contributed by [Lorenzobattistela](https://github.com/Lorenzobattistela)

# ListLiteral

The type of a literal heterogenous list expression.

A list consists of zero or more values, separated by commas.

## init

Note that we have to specify the types of the elements we want in our list. It can be homogeneous or heterogeneous.


```mojo
var a : ListLiteral[Int, Int, Int] = ListLiteral(1, 2, 3)
print(a)

var b : ListLiteral[StringLiteral, FloatLiteral, Int] = ListLiteral("hey", 1.0, 3)
print(b)

var c : ListLiteral[Int, Int] = [1, 2]
print(c)

```

    [1, 2, 3]
    ['hey', 1.0, 3]
    [1, 2]


## fields

- `storage`  The underlying storage for the list.

## len

Returns the length of the list.


```mojo
var x : ListLiteral[Int, Int] = [1, 2]
print(x.__len__())
print(len(x))
```

    2
    2


## get

Returns a list element at a given index.
Note that we have to specify the index of the element and the type of the element we're retrieving. Refer to parametrization [here](https://docs.modular.com/mojo/programming-manual.html#defining-parameterized-types-and-functions).


```mojo
var x : ListLiteral[Int, Int] = [3, 4]
var y  = x.get[0, Int]()
print(y)
```

    3

