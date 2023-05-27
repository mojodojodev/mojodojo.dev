---
title: os_is_linux
categories: TargetInfo
usage: Returns true if the target OS is linux
---
# os_is_linux

```mojo
from TargetInfo import os_is_linux
```
This builtin allows conditional compilation, the `@parameter` annotation over an `if` statement causes the block to be completely excluded from the final binary if the condition isn't met:
```mojo
@parameter
if os_is_linux():
    print("doing some special linux logic")
else:
    print("doing some other logic")
```

    doing some special linux logic

