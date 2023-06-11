---
title: Assert
categories: Assert
usage: Place constraints on functions that are checked at compile time, and check conditions only in debug builds
---
# Assert
## assert_param
Asserts that the condition is true in the `parameter / comptime` domain, used to place constraints on functions


```mojo
from Assert import assert_param
```

We can put compile time assertions in the ensure that the two numbers passed in are positive


```mojo
fn add_positives[x: Int, y: Int]() -> UInt8:
    assert_param[x > 0]()
    assert_param[y > 0]()
    return x + y
```

Let's get the result that's calculated at compile time


```mojo
let res = add_positives[2, 4]()
print(res)
```

    6


Now we'll introduce the error so you can see how it looks, it will always be at the end of the error message:


```mojo
add_positives[-2, 4]()
```

    error: Expression [8]:6:1: no viable expansions found
    fn __lldb_expr__(inout __mojo_repl_arg: __mojo_repl_context__):
    ^
    
    Expression [8]:8:28:   call expansion failed - no concrete specializations
        __mojo_repl_expr_impl__(__mojo_repl_arg, __get_address_as_lvalue(__mojo_repl_arg.`res`.load().address))
                               ^
    
    Expression [8]:12:1:     no viable expansions found
    def __mojo_repl_expr_impl__(inout __mojo_repl_arg: __mojo_repl_context__, inout `res`: __mlir_type.`!kgen.declref<@"$SIMD"::@SIMD<type: @"$DType"::@DType = #lit.struct<{value: dtype = ui8}>, size: @"$Int"::@Int = #lit.struct<{value: scalar<index> = 1}>>>`) -> None:
    ^
    
    Expression [8]:19:26:       call expansion failed - no concrete specializations
      __mojo_repl_expr_body__()
                             ^
    
    Expression [8]:14:3:         no viable expansions found
      def __mojo_repl_expr_body__() -> None:
      ^
    
    Expression [8]:16:25:           call expansion failed - no concrete specializations
        add_positives[-2, 4]()
                            ^
    
    Expression [2]:5:1:             no viable expansions found
    fn add_positives[x: Int, y: Int]() -> UInt8:
    ^
    
    Expression [2]:6:24:               constraint failed: param assertion failed
        assert_param[x > 0]()
                           ^
    


## assert_param_msg

This works the same way as [assert_param](#assert-param) but you can add a custom error message at the end:


```mojo
from Assert import assert_param_msg

fn add_positives[x: Int, y: Int]() -> UInt8:
    assert_param_msg[x > 0, "x is not positve, use a positve number over 0"]()
    return x + y

let res = add_positives[-2, -4]()
print(res)
```

    error: Expression [9]:11:1: no viable expansions found
    fn __lldb_expr__(inout __mojo_repl_arg: __mojo_repl_context__):
    ^
    
    Expression [9]:13:28:   call expansion failed - no concrete specializations
        __mojo_repl_expr_impl__(__mojo_repl_arg, __get_address_as_lvalue(__mojo_repl_arg.`res`.load().address))
                               ^
    
    Expression [9]:17:1:     no viable expansions found
    def __mojo_repl_expr_impl__(inout __mojo_repl_arg: __mojo_repl_context__, inout `res`: __mlir_type.`!kgen.declref<@"$SIMD"::@SIMD<type: @"$DType"::@DType = #lit.struct<{value: dtype = ui8}>, size: @"$Int"::@Int = #lit.struct<{value: scalar<index> = 1}>>>`) -> None:
    ^
    
    Expression [9]:25:26:       call expansion failed - no concrete specializations
      __mojo_repl_expr_body__()
                             ^
    
    Expression [9]:19:3:         no viable expansions found
      def __mojo_repl_expr_body__() -> None:
      ^
    
    Expression [9]:21:36:           call expansion failed - no concrete specializations
        let res = add_positives[-2, -4]()
                                       ^
    
    Expression [9]:6:1:             no viable expansions found
    fn add_positives[x: Int, y: Int]() -> UInt8:
    ^
    
    Expression [9]:7:77:               constraint failed: x is not positve, use a positve number over 0
        assert_param_msg[x > 0, "x is not positve, use a positve number over 0"]()
                                                                                ^
    


## debug_assert
Asserts that the condition is true in debug builds, and is removed from the compilation process in release builds


```mojo
from Assert import debug_assert

fn test_debug_assert[x: Int](y: Int):
    debug_assert(x == 42, "x is not equal to 42")
    debug_assert(y == 42, "y is not equal to 42")


test_debug_assert[1](2)
```

debug_assert doesn't work in the playground because it's not a debug build.
