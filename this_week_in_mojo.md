# This Week in Mojo
If you'd like to add any content here please [raise a pull request](https://github.com/mojodojodev/mojodojo.dev/edit/main/this_week_in_mojo.md) or email `mojodojodev@gmail.com`

## 2023-05-26 - Week in Progress
### New Mojo Playground Release
[See all the bug fixes here](https://docs.modular.com/mojo/changelog.html#fixed)

#### ⭐️ New
`finally` clauses are now supported on `try` statements. In addition, `try` statements no longer require `except` clauses, allowing `try-finally` blocks. `finally` clauses contain code that is always executed from control-flow leaves any of the other clauses of a `try` statement by any means.

#### 🦋 Changed
`with` statement emission changed to use the new `finally` logic so that

```python
with ContextMgr():
    return
```

Will correctly execute `ContextMgr.__exit__` before returning.

### Community
- New Mojo Dojo post: [Mojo first impressions](https://mojodojo.dev/blog.html#mojo-first-impressions-2023-05-22)

- [sa-](https://github.com/sa-) who is active on the Discord as `sa-code` made their own [tensor struct](https://github.com/modularml/mojo/discussions/251#discussioncomment-5998651) for tensors with up to 2 dimensions as well as a linear regression struct, as they experiment with creating a nice API for a full library.

- [DayDun]() who has been actively raising bugs and answering questions on GitHub has been experimenting with ray tracing and attempting to improve performance via SIMD, here was the latest image and speed:

![Ray Tracing via SIMD](/raytrace-2.png)

- [yt7589](https://gist.github.com/yt7589) has been enthusiastically experimenting with their own [matmul implementation](https://gist.github.com/yt7589/e6f28328a0ce56f21db3861113ea5c94) of up to 4 dimensions similiar to `numpy.matmul` a.k.a the `@` operator for an `ndarray`

#### Python and Mojo creator exchange
Python creator and `Benevolent Dictator For some-of-Life` Guido van Rossum had a small tongue-in-cheek exchange with Mojo creator and Modular CEO Chris Lattner:

Guido:

How do you pronounce the flame emoji that’s part of the language name?

Chris:

Good question, everyone I've heard say it out loud pronounced it as 🔥

Guido:

Snark 😀 BTW we should talk some more about the evolution of Mojo's design in the context of Python.

Chris:

It is super important to me that Mojo is a good member of the wider Python community. I'd love to reconnect of course!


### New Team Answers
#### `lambda` syntax
Loosely held opinion, Mojo clearly needs to support:

Nested functions (currently wired up, but have a few issues given lifetimes are not here yet). I'd like @parameter to go away on the nested functions eventually too.
Existing Python lambda syntax, which is sugar for Add the initial README.md #1. We need to support type annotations here.
Lower priority, but I think we're likely to explore:

Possibly implement more flexible/general/ergonomic light-weight closures like Scala3 => syntax
User defined statement blocks, e.g.:

```python
parallel_loop(42):
    stuff()
```

User defined statements are a nice way to shift more language syntax into the library, but are just syntactic sugar and will require a little more infra to get wired up. For example, I would like "return" in that context to return from the enclosing function (not from the lambda), and things like break to work for loop-like constructs. This is quite possible to wire up, but will require a bit of design work.

#### Error Handling
> On question about Result type like Rust

It will be one of the things added when Abstract Data Types (ADT) and traits are in place

#### Curly Brackets
There are practical reasons why brackets will not work and why significant whitespace is crucial to the parser: lazy body parsing. Mojo's parser can trivially skip over the body of structs, functions, etc. because it can use the expected indentation to find the end of the indentation block.

> Answer from Chris after more discussion

This suggestion cuts directly against or goals for Mojo, which is to be a member of the Python family. Thank you for your suggestions, but our goal isn't to design a new language from first principles (been there done that 😄), it is to lift an existing ecosystem. We are also not adding general syntactic sugar, we are focused on core systems programming features that Python lacks.

#### `type` builtin
The issue with adding the type bultin to Mojo is that we don't have a runtime type representation yet. I.e. in Python, type returns a type instance that can be used like a class.

#### Infinite Recursion Error
We want the compiler to generate diagnostics on obvious bugs to help the programmer. If someone accidentally typos something or (like your initial example) does something that is obviously recursive, we should help the programmer out.

I don't think there is a good reason for people to want to exhaust the stack; generating an error seems fine, and if there is some important use case we can figure out if there are different ways to address the need.

I agree we should generate a good error rather than just crashing when an undetected-infinite recursion (or just DEEP recursion) happens, this isn't going to get fixed in the immediate future due to prioritization, but I agree we should do it at some point.

Watch out for LLVM which has tail call and other optimizations, which can turn things into closed form loops in some cases :-)


## 2023-05-19

### New Mojo Playground Release
#### ⭐ New:
- Added missing dunder methods to PythonObject, enabling the use of common arithmetic and logical operators on imported Python values.
- PythonObject is now printable from Mojo, instead of requiring you to import Python’s print function.

#### 🛠️ Fixed:
- Issue #98: Incorrect error with lifetime tracking in loop.
- Issue #49: Type inference issue (?) in ‘ternary assignment’ operation (FloatLiteral vs. ‘SIMD[f32, 1]’).
- Issue #48: and/or don’t work with memory-only types.
- Issue #11: setitem Support for PythonObject.

### Community Content
- [Maxim Zaks](https://mzaks.medium.com/) did a blog post on [counting chars with SIMD in Mojo](https://mzaks.medium.com/counting-chars-with-simd-in-mojo-140ee730bd4d)
- [Abhinav Upadhyay](https://substack.com/profile/14520974-abhinav-upadhyay) did a substack post titled [Mojo: The Future of AI Programming 🔥](https://codeconfessions.substack.com/p/mojo-the-future-of-ai-programming)
- [Code to the Moon](https://www.youtube.com/@codetothemoon) did a live demo and introduction to Mojo titled [All-in-one C++, Rust, AND Python Successor?](https://www.youtube.com/watch?v=w14vohgjnKo)

### New Mojo Team Answers

#### Unsafe Code
> The standard Pointer is very unsafe and can lead catastrophic scenarios

I agree, the Mojo Pointer type is currently "too sharp and pointy" 😀. In my opinion, we should rename it to `UnsafePointer` and make some other changes to make it not have to be something that people reach for immediately, just like in C++ or Rust you should use higher level collections, and not jump right to unsafe features.

#### Bounds Checking
We have to implement array bound checking for our array/slice types, we just haven't solidified them due to missing features (notably traits)

#### Community
On community, this dovetails with our open source plan.  We're getting a bit crushed under lots of different kinds of interest right now, but I'd love to open up more code, enable pull requests etc, that's mostly blocked on logistical work and that we're being crushed in various ways. We have a Mojo developer advocate role open that will help us sort that out.

#### traits
_currently an unimplemented feature_
We don't have a final name here, Guido recommended that `Protocols` as term of art in python already, but we'll need to loop back around and make a decision when we get there.

#### help
On the implementation, we'll need some work to build out `help(object)` and `help(Int)` (where Int is a struct, not a class).  I don't see us prioritizing that in the next month or so, but it is super important for us to do that over time.  We have ways to do that without adding a field to Int 🙂 etc, so that should be fine. It depends on Traits/Protocols which is on our roadmap

#### CPython Implementation Details
You're quite right about CPython.  Mojo takes a different implementation approach: ignoring C extensions for a moment, the core compilation model for mojo is to compile to native code, and use ownership optimizations, and more modern data layout approaches to avoid heap boxing all the things, and therefore reference counting them.  In CPython for example, a lot of reference counting traffic is required for simple integers and short strings etc.

Mojo solves this in several ways:
1. compilers: you get a lot of performance by not going through an interpreter, using register allocation etc.
2. unboxing things: our default "object" is still naive in many ways, but has inline storage + variant for small types like integers to avoid indirections, refcount overhead, etc. 
3. types like Int are put in cpu registers etc, which give a massive performance uplift vs that.

Now you can't ignore CPython and can't ignore c extensions.  Good news, MLIR and compilers can do more than one thing :), and so we can talk to other ABIs and handle other layout constraints.  We haven't built a proper "talk to c python extensions" directly from Mojo subsystem, but when we do, __it__ will have a GIL because c extensions require it, just as you say.

Similarly, when you import a cpython module, you get the cpython interpreter in the loop, which has a gil (and its datalayout etc) implicitly.

The cool thing about mojo is that you don't pay this overhead in pure Mojo code, so if you care about performance you can incrementally move Python code -> Mojo and you can adopt new features for performance ... but only if you care about performance!  If you don't, hack on and do so without caring, and all is well.

#### IOT
yes, definitely, we want Mojo to go everywhere, and deploying to small devices is part of our design. One step at a time though 😀

#### rebind
> It will be nice to change the current rebind parameters from [dest, src] to [src, dest] since its more intuitive that the other way around. The current signature is rebind[dest_type, src_type](src_val)

The current way works better with parameter inference, because you can call it with `rebind[dest_type](src_val)` and have src_type inferred from the argument.

#### Pytorch on Different hardware
We outperform PyTorch across a large range of hardware (Intel, AMD, ARM etc) [see performance dashboard](https://www.modular.com/engine#performance) and swap around the Instance Types

#### Quantization
We support quantization and it will support many other HW types like edge deployments

#### Inference Engine Frameworks
It’s a unified engine that enables multi-framework support - many users aren’t just using PyTorch (TensorFlow, JAX etc)

It integrates natively with Mojo 🔥 for a completely new high performance programming model that enables many things outside of just pure model execution performance

#### alias
`comptime` is really obvious to Zig folk, but that's not really our audience. You're right that `alias` may not be the right word to use here either. Aligning this around "parameter" could be a good way to go, but I'm curious if there are other suggestions.

Once nice thing about "alias" is that it is more obvious for the trivial cases like alias my_magic = 12312 or alias Int8 = SIMD[DType.si8, 1]. That doesn't make it the right thing, but it is a nice thing.

If we replaced the keyword "alias x = 42" with "parameter x = 42", then we can say "it's a declaration of a parameter" and that "parameters are all compile time expressions."

alias (regardless of what it is called) is a declaration of a thing. We need spoken vocabulary for programmers to describe these things. It isn't just about encoding things in source code for the compiler, it is allowing humans to communicate ideas as well.

Also, "let" values are not aliases. They've very different. A let isn't mutable after it is initialized, which is a flow sensitive property, e.g. this is allowed:
```
let x : Int 
if cond:
    x = foo()
else:
    x = bar()
use(x)
```

which isn't allowed for aliases.

#### MLIR and LLVM
> Reading the documents on MLIR related APIs, I feel that the style of these APIs seems to be quite different with Python

Indeed, the MLIR integration hasn't been polished or designed to be pretty - we've focused primarily on making it fully capable and unblocking our needs. The idea for it is that only MLIR experts would be using this, but then they'd be wrapping user-facing Pythonic types and methods around them (e.g. like OurBool wraps i1). that said, we can definitely improve this in various ways, we just can't do so at the loss of fidelity/expressiveness.

> I wonder if it is possible to make Mojo more extensible such that it can also create new didacts?

This is also something we're likely to look into in the far future, but isn't a priority right now. Also, as mojo opens up more, it would be great for community members to poke at this.

#### MLIR code with unknown dialects
The mojo compiler has a number of internal dialects, including `pop` and `kgen`, but they aren't documented yet. They are very much internal implementation details of the compiler and change all the time. I'd recommend sticking with the llvm and other dialects that are more stable.

#### i32 vs si32
> Python programmers will probably be more familiar with the i32/u32 syntax.

Yeah, for the core language types, our audience are general programmers and Python folks, not MLIR nerds 😉

We want things to be clear and unambiguous, compiler folk can deal with naming mapping. We will discuss.

> would it ever makes sense for Mojo to also support signless integers?

I don't see a benefit to that. It would mean that we couldn't use the standard Python operators (which imply sign behavior, e.g. on divides). Signless integers are good for compilers because they want canonical forms, but users want operations that work on types. It's a bit of a different concern.

#### Optimization via MLIR
Mojo is a gateway to the whole MLIR ecosystem. It is entirely plausible that the matmul implementation for a particular piece of hardware just calls a few MLIR operations.

#### Accelerators
We can only say that we're working on accelerators and that is core to the mission, but can't talk about that until we're ready to talk about it 😀

#### Compile Time Optimizations
Mojo's compiler is not going to be magic. If you write matmul as a triply nested for loop, you will get a triply nested for loop on all hardwares (barring LLVM optimizations).

The general idea is that Mojo's compiler is not going to perform some magic to optimize the code you are generating, but the language provides all the facilities to write that magic in a portable way as just Mojo code. Today, that magic is bundled into a handful of higher-order functions, like parallelize and vectorize_unroll, and as time continues, Mojo will ship with more "batteries" that mean most developers won't have to worry about SIMD, unrolling, etc. You just need to slap a few decorators on your functions/loops and call a function.

#### Python keyword compatibility
For now, we need to get Mojo from 0.1 to at least 0.7 (conceptually, we have no specific versioning planned), at which point we'll understand more of what we're dealing with, and have broader developed relationships with the python community.

Also, my understanding is that Python3 generally doesn't take hard keywords for various compatibility reasons, even things like "case" are a soft keyword. If that is true, then we may be fine.

## 2023-05-12
### Mojo Team Content
- [Tim Davis](https://www.modular.com/team/tim-davis) released a [blog post](https://www.modular.com/blog/our-launch-whats-next) on the launch and what's next
- [Scott Main](https://www.modular.com/team/scott-main) added a section to the programming manual on [memory ownership](https://docs.modular.com/mojo/programming-manual.html#argument-passing-control-and-memory-ownership) that clarifies value and reference semantics in Mojo.

### Language and Mojo Playground updates
The changes from [week ending 2023-05-01](https://docs.modular.com/mojo/changelog.html#week-of-2023-05-01) and [week ending 2023-05-08](https://docs.modular.com/mojo/changelog.html#week-of-2023-05-08) have been released to the Mojo Playground with highlights:

#### inout
The `inout` keyword replaces `&` postfix to declare a mutable reference, `self&` is now `inout self`:
```
struct MyVal:
    var val: Int

    fn __init__(inout self, val: Int):
        self.val = val
```

`inout` will be familiar to Swift programmers, any mutations `in` the function will persist `out` of the function.

See justification for the naming of the keyword [here](https://github.com/modularml/mojo/issues/7) and [here](https://github.com/modularml/mojo/discussions/105). To summarize `&` is a heavily overloaded character, while `inout` describes exactly what's happening.
 
#### Generic parameters
Generic parameters would previously crash notebooks, this now works:
```mojo
struct Multi[T: AnyType]:
    var x: T

    fn __init__(inout self, x: T):
        self.x = x

let x = Multi(10)
let y = Multi("string")
```

### New Mojo Team Answers
#### Thread Safety
A borrowed argument is `safe to share`. It isn't enforced yet, but the model is that a borrowed argument can never alias a mutable reference.

Mojo provides the same model as Rust, which is `mutable XOR sharing` model. If you have a mutable reference to something, it is known to be unique. You can have many immutable references though.

#### Actor Model
We only have "ideas" not "plans" here. I'm a fan of actors, having designed/built out a system for swift a few years ago. I think an evolved version of that would compose well and will fit nicely into our system. I think we'll want a Mutex abstraction and classes first though. See [Swift Concurrency Manifesto](https://gist.github.com/lattner/31ed37682ef1576b16bca1432ea9f782) and [Swift Concurrency Docs](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)

You don't need to convince me of the value of actors, Carl Hewitt already did 🙂

#### Leading underscore `_foo` for private members
This is a very clear extension we could consider, highly precedented of course. In the immediate future we are focusing on building the core systems programming features in the roadmap. When that is complete, we can consider "general goodness" features like this.

#### WASM Support
The Mojo stack is perfectly set up to do this. It doesn't use garbage collection, supports very small installed binaries etc. It'll be great, we just need to make a bit more progress 😄

#### Global Variables
Both `def` and `fn` cannot access variables outside their scope because Mojo as a language doesn't have proper global variables yet, this is a known missing feature.

#### Float Literals
`FloatLiteral` is backed by `F64` but the Mojo Playground is currently only printing to 6 decimal places. [Feature request added here](https://github.com/modularml/mojo/issues/115) to print all significant digits.

#### Type Erasure for Python Support
This currently doesn't work in Mojo as it does in Python:
```python
a = 9
print(a)
a = "Hello"
print(a)
```

I agree we need to decide what the model is. This __must__ work, at least in a `def`, for python compatibility. `def` currently allows implicit declaration, but infer the type from the first assignment. The above implies that implicitly declared variables in a `def` should default to having object type (which type erases the concrete type and will allow the above).

I think this is the right/unavoidable thing to do, but I have two concerns:

We don't really have the language features in place to implement object correctly (notably need the basics of classes), so I'd like to avoid switching to this model until we can make it work right.

This push us to define/create the "type erasure of structs to object" model so that user defined struct types can be used here. We may or may not want to do this, it isn't clear to me. There is a lot of precedent in this in the Swift world where Swift classes can be typed erased to `AnyObject` (aka `id` in ObjC) and that [allow dynamic dispatch in various ways](https://github.com/apple/swift-evolution/blob/main/proposals/0116-id-as-any.md)

These are super nuanced issues and I'd like to get more experience with the core language before touching into this. There is a big difference between bringing up something simple and building it really great.

#### Compile to Shared Library
Yes, it can be compiled as a shared library, no problem. We're not prioritizing this right now, but we'll enable this at some point

#### Mutable Reference vs Mutable Referee
An `immutable reference` can still have a `mutable referee`, this is equivalent to the difference between `const int*` and `int* const` in C. 

### Community Projects
- Github user [crisadamo](https://github.com/crisadamo/mojo-lang-syntax) has released a VS Code extension for syntax highlighting: [mojo-lang-syntax](https://github.com/crisadamo/mojo-lang-syntax) while we wait for the official language extension.
- Github user [https://github.com/czheo](https://github.com/czheo/mojo.vim) released a [vim plugin](https://github.com/czheo/mojo.vim) for syntax highlighting

### Community Content
- Telukso did a video where he experimented with [the Mojo playground](https://www.youtube.com/watch?v=yovCqxZalJU) and the matmul notebook, giving a nice visual for matrix multiplication before diving in [starting at 8:08](https://www.youtube.com/watch?v=yovCqxZalJU?t=483)
- Jeff Delaney responsible for [fireship.io](https://fireship.io) released a [meme filled video about Mojo](https://www.youtube.com/watch?v=V4gGJ7XXlC0&t=3s)
- The Primagen who mixes comedy and tech [did a reaction video](https://www.youtube.com/watch?v=RZhTC33lStQ) to Jeremy Howard's launch demo

