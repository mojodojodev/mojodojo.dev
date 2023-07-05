---
usage: Causes body of the function to be copied directly into the body of the calling function in the final binary 
---

# @always_inline
At compile time this causes the body of the function to be copied or `inlined` directly into the body of the calling function for the final binary. This removes overhead associated with function calls jumping to a new point in code. Normally the compiler will do this automatically where it improves performance, but this decorator forces it to occur, the downside is that it can increase the binary size for the duplicated functions.

## @always_inline("nodebug")
This works the same but doesn't include debug information so you can't step into the function when debugging, but it will reduce debug build binary size.

<CommentService />
