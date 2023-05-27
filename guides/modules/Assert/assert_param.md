---
title: assert_param
categories: |
  Assert
usage: |
    Asserts that the condition is true in the parameter domain, used to place constraints on functions
---
# assert_param
Asserts that the condition is true in the parameter (compile time) domain, used to place constraints on functions


```mojo
from Assert import assert_param
```

We can put compile time assertions in the ensure that the two numbers passed in are positive


```mojo
fn add_positives[x: Int, y: Int]() -> UI8:
    assert_param[x % 2 == 0]()
    assert_param[y % 2 == 0]()
    return x + y
```

Let's get the result that's calculated at compile time


```mojo
let res = add_positives[2, 4]()
print(res)
```

    6


Now we'll introduce the error so you can see how it looks, notice the last line


```mojo
add_positives[3, 5]()
```

    error: Expression [17]:6:1: no viable expansions found
    fn __lldb_expr__(inout __mojo_repl_arg: __mojo_repl_context__):
    ^
    
    Expression [17]:8:28:   call expansion failed
        __mojo_repl_expr_impl__(__mojo_repl_arg, __get_address_as_lvalue(__mojo_repl_arg.`res`.load().address))
                               ^
    
    Expression [17]:12:1:     no viable expansions found
    def __mojo_repl_expr_impl__(inout __mojo_repl_arg: __mojo_repl_context__, inout `res`: __mlir_type.`!kgen.declref<@"$SIMD"::@SIMD<type: @"$DType"::@DType = #lit.struct<{value: dtype = ui8}>, size: @"$Int"::@Int = #lit.struct<{value: scalar<index> = 1}>>>`) -> None:
    ^
    
    Expression [17]:19:26:       call expansion failed
      __mojo_repl_expr_body__()
                             ^
    
    Expression [17]:14:3:         no viable expansions found
      def __mojo_repl_expr_body__() -> None:
      ^
    
    Expression [17]:16:24:           call expansion failed
        add_positives[3, 5]()
                           ^
    
    Expression [15]:5:1:             no viable expansions found
    fn add_positives[x: Int, y: Int]() -> UI8:
    ^
    
    Expression [15]:6:29:               constraint failed: param assertion failed
        assert_param[x % 2 == 0]()
                                ^
    

