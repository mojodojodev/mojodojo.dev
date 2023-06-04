---
title: Sort
categories: Sort
usage: "Sorts a DynamicVector[Int]"
---
# sort

Sorts a `DynamicVector[Int]` inplace, in ascending order


```mojo
from Sort import sort
from Vector import DynamicVector

let v = DynamicVector[Int](3)

v.push_back(20)
v.push_back(10)
v.push_back(70)
```


```mojo
for i in range(v.size):
    print(v[i])
```

    20
    10
    70



```mojo
sort(v)

for i in range(v.size):
    print(v[i])
```

    10
    20
    70

