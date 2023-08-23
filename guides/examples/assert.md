```mojo
from Intrinsics import llvm_intrinsic

fn asrt(cond: Bool, msg: StringLiteral):
        if cond:
            return
        print("Assert Error:", msg)
        llvm_intrinsic["llvm.trap", NoneType]()
 

asrt(5 == 10, "5 does not equal 10")
```

    Assert Error: 5 does not equal 10


    error: Execution was interrupted, reason: signal SIGILL: illegal operand.
    The process has been left at the point where it was interrupted, use "thread return -x" to return to the state before expression evaluation.



```mojo
from String import String

let name = "billy"
let domain = StringRef("gmail.com")
let x = String(name) + "@" + domain

print(x)
```

    billy@gmail.com

