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

    error: Expression [4]:6:1: no viable expansions found
    fn __lldb_expr__(inout __mojo_repl_arg: __mojo_repl_context__):
    ^
    
    Expression [4]:8:28:   call expansion failed - no concrete specializations
        __mojo_repl_expr_impl__(__mojo_repl_arg, __get_address_as_lvalue(__mojo_repl_arg.`res`.load().address))
                               ^
    
    Expression [4]:12:1:     no viable expansions found
    def __mojo_repl_expr_impl__(inout __mojo_repl_arg: __mojo_repl_context__, inout `res`: __mlir_type.`!kgen.declref<@"$SIMD"::@SIMD<type: @"$DType"::@DType = #lit.struct<{value: dtype = ui8}>, size: @"$Int"::@Int = #lit.struct<{value = 1}>>>`) -> None:
    ^
    
    Expression [4]:19:26:       call expansion failed - no concrete specializations
      __mojo_repl_expr_body__()
                             ^
    
    Expression [4]:14:3:         no viable expansions found
      def __mojo_repl_expr_body__() -> None:
      ^
    
    Expression [4]:16:25:           call expansion failed - no concrete specializations
        add_positives[-2, 4]()
                            ^
    
    Expression [2]:5:1:             no viable expansions found
    fn add_positives[x: Int, y: Int]() -> UInt8:
    ^
    
    Expression [2]:6:24:               constraint failed: param assertion failed
        assert_param[x > 0]()
                           ^
    
    expression failed to parse (no further compiler diagnostics)

You can also add a message to change the compiler error output:


```mojo
fn add_positives[x: Int, y: Int]() -> UInt8:
    assert_param[x > 0, "x is not positve, use a positve number over 0"]()
    assert_param[y > 0, "y is not positve, use a positve number over 0"]()
    return x + y

let res = add_positives[-2, -4]()
print(res)
```

    error: Expression [8]:10:1: no viable expansions found
    fn __lldb_expr__(inout __mojo_repl_arg: __mojo_repl_context__):
    ^
    
    Expression [8]:12:28:   call expansion failed - no concrete specializations
        __mojo_repl_expr_impl__(__mojo_repl_arg, __get_address_as_lvalue(__mojo_repl_arg.`res`.load().address))
                               ^
    
    Expression [8]:16:1:     no viable expansions found
    def __mojo_repl_expr_impl__(inout __mojo_repl_arg: __mojo_repl_context__, inout `res`: __mlir_type.`!kgen.declref<@"$SIMD"::@SIMD<type: @"$DType"::@DType = #lit.struct<{value: dtype = ui8}>, size: @"$Int"::@Int = #lit.struct<{value = 1}>>>`) -> None:
    ^
    
    Expression [8]:24:26:       call expansion failed - no concrete specializations
      __mojo_repl_expr_body__()
                             ^
    
    Expression [8]:18:3:         no viable expansions found
      def __mojo_repl_expr_body__() -> None:
      ^
    
    Expression [8]:20:36:           call expansion failed - no concrete specializations
        let res = add_positives[-2, -4]()
                                       ^
    
    Expression [8]:5:1:             no viable expansions found
    fn add_positives[x: Int, y: Int]() -> UInt8:
    ^
    
    Expression [8]:6:90:               constraint failed: x or y are not positve, use a positve numbers over 0
        assert_param[x > 0 and y > 0, "x or y are not positve, use a positve numbers over 0"]()
                                                                                             ^
    
    expression failed to parse (no further compiler diagnostics)

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
