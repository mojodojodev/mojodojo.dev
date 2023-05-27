---
title: os_is_linux
categories: TargetInfo
usage: Returns true if the target OS is linux
---


```mojo
from TargetInfo import os_is_linux

@parameter
if os_is_linux():
    print("doing some special linux logic")
else:
    print("doing some other logic")
```

    doing some special linux logic

