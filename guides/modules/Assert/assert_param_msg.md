---
title: assert_param_msg
categories: |
  Assert
usage: |
    Asserts that the condition is true in the parameter (compile time) domain, and add a message to error on failure.
---
# assert_param_msg
Asserts that the condition is true in the parameter (compile time) domain, and add a message to error on failure.


```mojo
from Assert import assert_param_msg
```

We can put compile time assertions in the ensure that the two numbers passed in are positive


```mojo
fn add_positives[x: Int, y: Int]() -> UI8:
    assert_param_msg[x > 0, "x is not positve, use a positve number over 0"]()
    assert_param_msg[y > 0, "y is not positive, use a positive number over 0 "]()
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
add_positives[-2, -4]()
```

    error: Expression [7]:6:1: no viable expansions found
    fn __lldb_expr__(inout __mojo_repl_arg: __mojo_repl_context__):
    ^
    
    Expression [7]:8:28:   call expansion failed
        __mojo_repl_expr_impl__(__mojo_repl_arg, __get_address_as_lvalue(__mojo_repl_arg.`res`.load().address))
                               ^
    
    Expression [7]:12:1:     no viable expansions found
    def __mojo_repl_expr_impl__(inout __mojo_repl_arg: __mojo_repl_context__, inout `res`: __mlir_type.`!kgen.declref<@"$SIMD"::@SIMD<type: @"$DType"::@DType = #lit.struct<{value: dtype = ui8}>, size: @"$Int"::@Int = #lit.struct<{value: scalar<index> = 1}>>>`) -> None:
    ^
    
    Expression [7]:19:26:       call expansion failed
      __mojo_repl_expr_body__()
                             ^
    
    Expression [7]:14:3:         no viable expansions found
      def __mojo_repl_expr_body__() -> None:
      ^
    
    Expression [7]:16:26:           call expansion failed
        add_positives[-2, -4]()
                             ^
    
    Expression [4]:5:1:             no viable expansions found
    fn add_positives[x: Int, y: Int]() -> UI8:
    ^
    
    Expression [4]:6:77:               constraint failed: x is not positve, use a positve number over 0
        assert_param_msg[x > 0, "x is not positve, use a positve number over 0"]()
                                                                                ^
    

