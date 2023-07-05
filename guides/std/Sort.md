---
title: Sort
categories: Sort
usage: "Sorts a DynamicVector[Int] inplace, in ascending order"
---
Contributed by [gautam](https://github.com/gautam-e)

# sort

Sorts a `DynamicVector[Int]` inplace, in ascending order


```mojo
from Sort import sort
from Vector import DynamicVector

let v = DynamicVector[Int](3)

v.push_back(20)
v.push_back(10)
v.push_back(70)

sort(v)

for i in range(v.size):
    print(v[i])
```

    10
    20
    70


<CommentService />
