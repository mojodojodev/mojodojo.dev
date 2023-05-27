---
title: debug_assert
categories: Assert
usage: Asserts that the condition is true in debug builds, and is not included in release builds
---
# debug_assert
Asserts that the condition is true in debug builds, and is not included release builds


```mojo
from Assert import debug_assert
```


```mojo
let x = 10

debug_assert(x == 10, "x is not equal to 10")
debug_assert(x > 11, "x is not more than 10")
```
