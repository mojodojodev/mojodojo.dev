---
head:
  - [meta, { name: twitter:card , content: summary }]
  - [meta, { name: twitter:site , content: '@mojodojodev' }]
  - [meta, { name: twitter:title , content: Mojo Team Answers }]
  - [meta, { name: twitter:description , content: "Answers from various team members about the Mojo language and Modular" }]
  - [meta, { name: twitter:image , content: "https://mojodojo.dev/hero.png" }]
---

# Mojo Team Answers
To check when new answers are added, you can follow [This Week in Mojo](/this_week_in_mojo/)

## Language Features

### Keyword Arguments
Mojo doesn’t support keyword arguments yet, this is important but hasn’t been prioritized just because it is “syntax sugar”

- [2023-05-09 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1105395176723198102/1105467381083541594)

### Implicit Type Declaration
Within a function, implicitly declared variables get the type of their first value assigned into them. This is probably not the right thing - within a def, we will need to maintain dynamic typing (including type transformations like python has) for compatibility. Our base object isn't super built out and set up for this yet, which is why we have a "default to the first type" approach.

- [2023-05-31 Github Chris Lattner](https://github.com/modularml/mojo/issues/290#issuecomment-1569131070)

### Parametric Algorithms
Yes, Mojo provides guaranteed specialization of parametric algorithms like Julia/Rust/C++.

- [2023-05-05 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1103711813582987374)

### Overloading Return Type
Mojo doesn’t support overloading solely on result type, and doesn’t use result type or contextual type information for type inference, keeping things simple, fast, and predictable. Mojo will never produce an “expression too complex” error, because its type-checker is simple and fast by definition.


### Creating New Operators
We can definitely add that in time, but in the immediate future we're focused on /not/ adding gratuitous syntactic sugar. We're focused on building out the core model and getting the fundamentals right.

e.g. even changing `def __add__()` to `def +()` would be trivial to do, but sends us down the route of building syntax sugar, which is hugely distracting. It's better to stay focused.

### Algebraic Data Types
I'm a fan of optional and other algebraic data types, you don't need to convince me. It's in our roadmap doc 😀 Swift has way too much special purpose sugar which I'd prefer to reduce this time around, there are ways to have the best of both worlds - ergonomic and extensible.

- [2023-05-05 Hackernews Chris Lattner](https://news.ycombinator.com/item?id=35809658#35811170)

### Mutability let and var
let and var are just about safety/scoping etc. They are also helpful when using advanced types and move semantics, but even then not required. [More info here](https://docs.modular.com/mojo/programming-manual.html#let-and-var-declarations)

### Cyclic Imports
Yes, Python packages perform cyclic imports and we had to support that. We will share information about our compilation model soon

### Enums
We like Swift enums so Mojo enums will probably become more feature complete over time. Enums are a different thing entirely to types, but they're basically just aliases for compile-time values.

### Unsafe Code
Mojo is safe by default, but if you want to go low-level Mojo provides powerful tools, a Rust style `unsafe` block in our opinion has not been an aggregate win, it built a lot of distrust and negative feelings, even though the standard library is built on top of unsafe APIs. We prefer Swift's approach to show that an API is unsafe through naming, for example we should rename the Mojo `Pointer` to `UnsafePointer`, instead of propagating an effect that the user has to manage. Unsafe code in Rust also makes it easy to unknowingly expose Undefined Behaviour (UB) when interacting with the borrow checker if you don't follow the rules, we make different tradeoffs to expose less potential UB when writing unsafe code.

Pointers serve an important function even for safe code, it allows type-erasing a reference into an arbitrary container that holds a value in memory, just like a safe reference does. This is a pretty important thing, but you really want this to be safe for the common use-case. Such a thing would not support pointer arithmetic or indexing though, this is something a Slice type would support.

- [2023-07-01 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1124302001430339616/1124437937640194120)
- [2023-05-19 Discord Reply Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1108969825008615475)
- [2023-05-09 Discord Reply Chris Lattner](https://discord.com/channels/1087530497313357884/1105161023218008094/1105223842605039626)
- [YouTube: Unsafe Rust Undefined Behavior](https://youtu.be/DG-VLezRkYQ)

### Loose Typing
This is an evolving part of the language and likely another difference we pull into the `fn` vs `def` world, in a `def` we could default to getting objects for literals, but within a `fn` you get typed literals. Another potential solution is to have aggressive decay rules in `def` e.g. `True` starts out being typed to `Bool` but we allow decaying to object when an expression doesn't type check otherwise. We'll need to experiment with that when we make progress on other more basic things. The major reason to have both `def` and `fn` is to have a Python compatible world and a stricter systems programmer world, and have them coexist seamlessly.

- [2023-06-05 Discord Reply Chris Lattner](https://discord.com/channels/1087530497313357884/1114818534946648165/1114971056671838350)

### Float Literals
`FloatLiteral` is backed by `Float64`, Mojo Playground is currently only printing to 6 decimal places, but the mantissa width is 52

### Error Handling
It uses variants to avoid performance cost and allows it to run on various hardware, e.g. a function can return a variant of None/Error, but it maps to Python try / except syntax.

- [2023-06-02 Lex Fridman Interview 2:44:41](https://youtu.be/pdJQ8iVTwj8?t=9881)

We support the existing Python raise/try syntax, and also support with blocks etc.

We will also support an optional + result type as well for the usecases that benefit from it, e.g. functional patterns, although we are missing some support in the generics system to do that right now.

Mojo doesn't actually have exceptions (stack unwinding, etc). Our error handling is like Rust's error handling, except sugared `fn foo() raises -> Int:` actually returns an `ErrorOr<Int>` type and the parser generates automatic error propagation, etc.
```mojo
try:
mightRaise()
except e:
print(e)
```

is the same as

```mojo
maybeErr = mightRaise()
if maybeErr.isError():
print(maybeErr.getError())
```

We're not impressed with how the swift `marked propagation` stuff worked out. The `try` thing (besides being the wrong keyword) was super verbose for things that required lots of fallible calls, e.g. encoders and decoders and it isn't clear that the ambiguity we were afraid of was actually a thing.  We'll certainly explore that in the future, but for now we should try to just keep things simple and bring up the stack end to end imo.

> On question about Result type like Rust

It will be one of the things added when Abstract Data Types (ADT) and traits are in place

### Error messages
We do really like Rust's error messages, even the way that they're output with super slick ASCII art arrows, we want Mojo to have clear error messages and Rust's are definitely great in this respect, but we may not have the same super slick ASCII art.

### Sockets
We haven't invested in building anything here, but you can use all the existing Python libraries in the meantime. We also expect (as a community) to build out a bunch of mojo native libraries over time

### Mojo Types
Python has types like strings, integers, dictionaries etc. but they all live at runtime, in Mojo you specify what the actual types are which allows the compiler to do way better optimizations, gets rid of the expensive indirections, and gives you code completion. You can progressively adopt types where you want them, but you don't have to use them if you don't want to. Our opinion is not that types are the wrong or right thing, but they're a useful thing.

- [2023-06-02 Lex Fridman Interview 31:09](https://youtu.be/pdJQ8iVTwj8?t=1869)

### Dynamic and static typing
(question was on a scale of Python to Rust)

It's a false dichotomy in my opinion based on how those systems work. Mojo already supports great integration with Python and has a more powerful ownership system than Rust [but lifetimes are not finished yet, so that isn't comparable yet](https://docs.modular.com/mojo/programming-manual.html#argument-passing-control-and-memory-ownership)

Much of the root of the dichotomy comes from fairly opinionated perspectives on "manual control over everything is the 'right' and therefore 'only' way to do things", which forces you into super rigorous programming mode. Our view is a bit more pragmatic: dynamic is good, static is good, use the right tool for the job.


### Complex types
We have experienced slow and overly complex type systems and too much sugar as you're pointing out. We've learned a lot from it, and the conclusion is "don't do it again". You can see a specific comment about this at the [end of this section](https://docs.modular.com/mojo/notebooks/HelloMojo.html#overloaded-functions-methods)

It's also interesting that Rust et al made similar (but also different) mistakes and have compile time issues scaling. Mojo has a ton of core compiler improvements as well addressing the "LLVM is slow" sorts of issues that "zero abstraction" languages have when expecting LLVM to do all the work for them.

- [2023-05-04 Hackernews Chris Lattner](https://news.ycombinator.com/item?id=35809658#35811426)

### Ray tracer
Question: If you can expose tensor core instructions, why not expose ray tracing instructions when you support GPUs? Then this would solve major fragmentation problems in HPC.

Chris Lattner: I'd looooove that ❤️‍🔥

### Automatic differentiation
We don't have any current language features to enable this in the works, but I'm very familiar with the work on tape based and SCT (Source Code Transformation) approaches for AD (automatic differentiation), I believe our metaprogramming features will be useful to explore that when we get to wanting to build it. Tape based approaches will "just work" of course, because they don't need language support.

We also talk to all the existing python apis, including things like nn.module that use this, so those also "just work". I'm not sure if that's the question though

There's a whole body of work called "differentiable programming" that I'm a nerd about 😀, but we don't have immediate plans to work on this. I'm sure we'll intersect with that work in the future.

I can't prove this today, but my intuition is that we will be able to automatically produce backward versions of kernels from the forward version. [This has already been done by a number of other projects in other systems](https://enzyme.mit.edu/) and we have strictly more information than those systems do.

### Metaprogramming and compile time
Libraries like PyTorch have pushed ML towards an abstract specification of a compute problem, which then gets mapped in a whole bunch of different ways. This is why it has become a metaprogramming problem, say you have a neural net, now run it with batch size 1000, do a mapping across batch, or run it across 1000 GPUs/CPUs.

Hardware systems and algorithms are really complicated, most programmers don't want to know how the intricate details of how the hardware actually works, so how do we allow people to build more abstracted and portable code, a lot of the algorithms are the same but parameters like cache size, vector length or tail size might need to change to optimize for different hardware.

Instead of having humans go and test all these things with different parameters which can grow to complex multidimensional spaces, why don't we have computers do that for us. So you can specify different options and have the compiler empirically test what the fastest implementation is for the target you're compiling to.

Python has amazing dynamic metaprogramming features, and they translate to beautiful static metaprogramming features which has profound implications. People use Python for things it wasn't meant to do, because it was designed very thoughtfully in this space.

One of the things that makes Python very beautiful is it's very dynamic and expressive through the powerful dynamic metaprogramming features. But you can't use those features on things like a GPU due to performance costs, so we take the interpreter and allow it to run at compile time. This gives us Python style expressive API's that enable libraries like PyTorch, with no performance penalty.

This is similar to newer languages like Zig, which allow you use the core language during compile time the same way you would during runtime. As opposed to C++ templating where it's a completely different language and universe, one of the goals of Mojo is to make things really easy to use and learn so there's a natural stepping stone.

One of the cool things that Mojo provides is an extremely powerful parametric metaprogramming system (see the language design doc for a brief intro) which allows extending the compiler itself in mojo, so you can invent your own combinators. This is very important, because different accelerators have different cool features and we are not looking for a watered down programming model.

This isn't fully documented yet, and there are a few missing pieces we want to wrap up before doing so, but this provides a pretty different programming model than existing systems.

One way to say this is that Mojo is taking a lot of the power out of the compiler and putting it into libraries, allowing Mojo developers to radically extend the language. Python already has this but does so with super dynamic reflective metaprogramming, so this is an old idea done in a new way

- [2023-06-02 Lex Fridman Interview 16:23](https://youtu.be/pdJQ8iVTwj8?t=983)
- [2023-06-02 Lex Fridman Interview 21:02](https://youtu.be/pdJQ8iVTwj8?t=1262)
- [2023-06-02 Lex Fridman Interview 1:45:20](https://youtu.be/pdJQ8iVTwj8?t=6321)


### Compile time metaprogramming relationship to MLIR
Mojo has great support for evaluating fairly arbitrary expressions at compile time with an interpreter that (under the covers) ends up calling an MLIR dialect's fold operations.

These then get wrapped up in structs to give a new programmable veneer etc. Check out the Bool workbook example in the documentation for a simple example of doing this with the index dialect.

Mojo is designed "for" MLIR in this way - MLIR can talk to roughly anything that computes, and it is very important (over time) for Mojo to scale into new forms of computation, whether it be low level things like low-level tensorcore operators, mid-level things like a shape dialect, or high level things like an ML operator graph.

Right now many folks on the channel are excited about a Python++, but Mojo was designed to work backwards from the "speed of light" of hardware and accelerators. The syntax and applicability to Python is important for community reasons, but not particularly relevant to the accelerator side of Mojo.

- [2023-06-12 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1114406301808726138/1116540613618323517)

### Autotune and adaptive compilation
Libraries like PyTorch have pushed ML towards an abstract specification of a compute problem, which then gets mapped in a whole bunch of different ways, this is why it has become a metaprogramming problem.

Hardware systems and algorithms are really complicated, most programmers don't want to know the intricate details of how the hardware actually works, so how do we allow people to build more abstracted and portable code, a lot of the algorithms are the same but parameters like cache size, vector length or tail size might need to change to optimize for different hardware.

Instead of having humans go and test all these things with different parameters which can grow to complex multidimensional spaces, why don't we have computers do that for us. So you can specify different options and have the compiler empirically test what the fastest implementation is for the target you're compiling to.

- [2023-06-02 Lex Fridman Interview 21:02](https://youtu.be/pdJQ8iVTwj8?t=1262)

### Compile time function results
Yes, you can do this in two ways: first any normal function may be used at compile time.  No need to duplicate all math that works on ints between comptime and not, and no need to explicitly label everything as being constexpr capable

Second, runtime functions are also able to have “parameter results” [documented in the manual here](https://docs.modular.com/mojo/programming-manual.html#autotuning-adaptive-compilation), but it is mainly useful when returning parameterized capabilities from run time functions that are selected through auto tuning. This is an exotic power user feature, not the sort of thing I’d expect most mojo programmers to want to care about

### Concurrency and parallelism
We support for async/await syntax in python and have a high performance runtime that enables parallelism. The Matmul notebook online shows some simple examples.

We haven't described the runtime side of this, but Mojo is built on a high performance heterogenous runtime with very lightweight tasks and full asynchrony at its core. The Modular engine is all about high performance heterogenous accelerated compute after all.

We haven't built out all the concurrency features in Mojo yet, but do have the basics re: async/await etc that Python has.

We'll need to build this out over time, if you're not familiar with it, you might find the Swift actor and structured concurrency systems to be interesting. It is a production language today that has solved a bunch of these problems already, and while there are a few mistakes made, it has lots of good ideas that are not widely known.

- [You can read about the swift prior art here](https://gist.github.com/lattner/31ed37682ef1576b16bca1432ea9f782)

### Async
Python has async def, async with, and async for, only async def and await have been implemented today, but no GIL, so you can write actual parallel code with async functions.

`async fn` and coroutines are a fairly powerful mechanism, the underlying mechanism is quite powerful and allows running in thread pools, etc.

- [Parallelize docs](https://docs.modular.com/mojo/MojoStdlib/Functional.html#parallelize)
- [2023-07-08 Discord Alex Kirchhoff](https://discord.com/channels/1087530497313357884/1126917199551012874/1126961335423483924)

### Ternary operator
Python has a conditional (often called ternary) operator, so Mojo, as a superset of Python, will have the same functionality with the same syntax: x if y else z (similar to y ? x : z in other languages) 

### Nim uniform function call
We'll have to evaluate it when we get there (probably 2-3 months) but an alternative to the nim approach is to supported "extensions" [along the lines of what Swift did](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions)

They solve the same problem without making "two ways to do things" and dovetails better into generics.

### Mutable Reference vs Mutable Referee
An `immutable reference` can still have a `mutable referee`, this is equivalent to the difference between `const int*` and `int* const` in c. 

### Thread Safety
A borrowed argument is "safe to share". It isn't enforced yet, but the model is that a borrowed argument can never alias a mutable reference.

Mojo provides the same model as Rust, which is "mutable XOR sharing" model.  If you have a mutable reference to something, it is known to be unique.  You can have many immutable references though.

### Actor Model
We only have "ideas", not "plans" here.  I'm a fan of actors, having designed/built out a system for swift a few years ago.  I think an evolved version of that would compose well and will fit nicely into our system. I think we'll want a Mutex abstraction and classes first though. See [Swift Concurrency Manifesto](https://gist.github.com/lattner/31ed37682ef1576b16bca1432ea9f782) and [Swift Concurrency Docs](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)

You don't need to convince me of the value of actors, Carl Hewitt already did 🙂

### Infinite Recursion Error
We want the compiler to generate diagnostics on obvious bugs to help the programmer. If someone accidentally typos something or (like your initial example) does something that is obviously recursive, we should help the programmer out.

I don't think there is a good reason for people to want to exhaust the stack; generating an error seems fine, and if there is some important use case we can figure out if there are different ways to address the need.

I agree we should generate a good error rather than just crashing when an undetected-infinite recursion (or just DEEP recursion) happens, this isn't going to get fixed in the immediate future due to prioritization, but I agree we should do it at some point.

Watch out for LLVM which has tail call and other optimizations, which can turn things into closed form loops in some cases 😀

### Generics for non trivial types
This is going to be tricky to address in the immediate term. In the absence of traits/protocols (which is scheduled to start July/August) we can't reason about what members a generic AnyType has, nor can we constrain that type. This is actually a pretty big deal, because we don't have the infra to map back to what a substituted type's destructors are. As a consequence of this, it is only possible to use trivial types like Int/FP with generic algorithms. This is incredibly constraining right now 🙁

There is a separate issue where register_passable and memory-only types have different concrete ABIs / conventions. This is solvable in a simple way (just treat register passable types as memory abi when generic) or a fancier way (delay binding of ABI until type substitution)... but until we solve the trait issue, we'll still only be able to express generic algorithms over trivial types, even if they are memory only. So solving this in the immediate term isn't much of a relief.

The best workarounds right now are pretty ugly:

- Limit your generic code to trivial register passable types; e.g. add an explicit delete() method that you manually manage instead of a __del__ method that is automatically invoked.
- Copy and paste things to make them non-generic.

sorry, this is pretty annoying to me too. I really want to get on top of this of course.

- [2023-05-28 Github Issue](https://github.com/modularml/mojo/issues/271#issuecomment-1565709849)

### Arbitrary Precision Literals
We don't have support for arbitrary precision literals yet, but we have ideas on that.

- [2023-06-05 Github Issue](https://github.com/modularml/mojo/issues/318#issuecomment-1575656080)

### Built in types like C++ `int`
I want to get magic out of the compilers and put it into the libraries, we can build an `Int` that's beautiful and has an amazing API and does all the things you expect an integer to do, but maybe you don't like it and want to build a `BigInt`, you can do that and it's not a second class citizen. This is opposed to a language like C++ where the builtins have special promotion rules and other things that are hacked into the compiler.

- [2023-06-02 Lex Fridman Interview 40:08](https://youtu.be/pdJQ8iVTwj8?t=2408)

### Struct Memory Layout C Compatibility
I agree that an opt-in decorator that specifies layout is the right way to go. By default the compiler should be able to reorder fields to eliminate internal padding so programmers don't have to worry about this, but people putting bits on a wire or dealing with c compatibility should be able to get that. We will need to properly design this out.

- [2023-06-04 Github Chris Lattner](https://github.com/modularml/mojo/discussions/289#discussioncomment-6080125)

### Int Provenance
Ints and pointers are different things, so no ints don't carry provenance. This is one of the major things that C/C++ got wrong that has haunted LLVM IR and many other things for a long time. Taking a hard line on this makes everything simpler, but that is only possible when you have a fresh slate like Mojo provides us.

- [2023-06-06 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1115452333074153653)

### Float8
There are so many variants of Float8 representation. We need to think about which ones does Mojo represents and how to expose the variety. For now, we are removing Float8 from the DType list to avoid folks from falling into this trap.

- [2023-06-04 Github Abdul Dakkak](https://github.com/modularml/mojo/discussions/289#discussioncomment-6080125)

### URL based imports
Traditionally, it has been a responsibility placed on the build system, but that makes reproducible scripts harder to manage. Having first-class support for URL imports seem like the right direction for Mojo. We're still focusing on nailing down having packages first, but later on thinking about distribution and sharing will be important to building an ecosystem.

- [2023-06-27 GitHub Jeff Niu](https://github.com/modularml/mojo/discussions/413#discussioncomment-6285136)

### Pure Functions
Pureness is what is known as an "effect" in PL terminology. You can see this in the handling of async and raises in the current mojo implementation: a non-raising function is not allowed to call a raising function directly - it must wrap it in a try block.

I don't see a way to provide this sort of mapping from one world to the other for purity, I think we cannot practically implement this, and while pure computation is important, it is actually quite complicated: is reading from memory pure? If no, "purity" is pretty useless. If so, you cannot use purity information for much optimization, because you need to know which memory sets may be read and written by functions anyway.

Also, in other pure-functional languages like Haskell, you need escape hatches (perform unsafe io) because you want to add printf debugging etc to "pure" functions and compiler enforcement makes that whole thing incredibly difficult.

Overall I can understand wanting to have this conceptually, but I can't see how it could work out well in practice. We can come back to this later as the language evolves.

- [Pure Functions](https://github.com/modularml/mojo/discussions/345#discussioncomment-6136537)

### Side Effect Propagation
Unfortunately, it is pretty impractical to define what `side effect free` means in a general purpose language; particularly one that wants you to be able to call existing python code.

In practice side effects would be so common that the model would have to be "add a keyword to opt-in/indicate/require that a function is side effect free", not "add a keyword saying it has side effects".

Given that, very few people would use it, and it would interfere with printf debugging and a lot of other things.

It's possible that there is a model here that will work and would be usable, but I'm not sure how much value it would provide.

- [2023-06-12 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1117003204400513054/1117495786507354233)

### Receiver / Free Floating Functions
There are alternative ways to address the same thing, e.g. check out how extensions work in Swift. We'll need to look at this whole area as traits come in. We don't have a goal of providing the Julia multimethod dispatch thing. There isn't an efficient way to implement that other than full monomorphization, it is better to express the same thing with generics, which we haven't designed yet. Let's build out the traits system and see what the limitations are.

- [2023-06-13 Github Chris Lattner](https://github.com/modularml/mojo/discussions/366#discussioncomment-6155792)

### Custom Allocators
We don't have an established policy here and this is a really complicated topic, I'm not keen on making everyone _always_ think about allocators like Zig does, I don't think that is practical in a language that cares about usability and ergonomics, but it is clearly good to _allow_ folks to care.

In my personal opinion, there is a big difference practically between `node` allocation and `array` allocation. Error handling for small objects will kill us, and we don't want to make allocation of any class instance be failable. That said, allocating an array that could be 16GB definitely can fail. On the third hand, core data structures like Array probably don't want to expose memory allocation failability to the client by default for usability reasons.

It would be interesting to explore making these different APIs, possibly overloaded with a keyword argument or something. As one idea, we could make `UnsafePointer[T].allocate()` non-failable, but make `UnsafePointer[T].allocate(Int)` failable. We'd still have to decide what to do with that at the Array api level, but it too could have overloads for `arr.resize(n)` vs `arr.resize(checked = n)` or something like that.

- [2023-06-16 Github Chris Lattner](https://github.com/modularml/mojo/discussions/377#discussioncomment-6188353)

### Vales region borrow checker
Yep, I've followed it. It is currently experimental and adds non-trivial overhead to the runtime of a program, so it will be interesting to see how it bakes out and matures in Vale. For Mojo, we're sticking with somewhat more traditional implementation approaches.

This isn't to say "no, we will never do this": we need to get more experience with the planned lifetimes and other features, and if they don't work then we'd consider it. That said, I can say that "it isn't on our radar and it looks like there is more research to be done before we'd seriously consider it".

- [2023-07-18 Github Chris Lattner](https://github.com/modularml/mojo/discussions/461#discussioncomment-6474092)

### Only allowing `fn` in `struct`
I can see how this might avoid some accidental use of dynamic behavior, but I'm not sure why that is something we're worried about. Further, there are other issues - we need to support top level code and other things that aren't tied to an `fn` keyword. Furthermore, we want constrained dynamic classes as well (Jeff will share a doc hopefully ~this week about this) in Mojo that aren't as dynamic as Python's.

At the end of the day, we also want `fn` and `def` to be friends and get along and allow intermixing. This is a pretty important design principle - we don't want "fn to be mojo" and "def to be legacy python code", so I see this approach working...

- [2023-07-18 Github Chris Lattner](https://github.com/modularml/mojo/issues/452#issuecomment-1639473356)

### Null Pointers
We are definitely interested in introducing an `Option[T]` / `Optional[T]` type in the future, but need more traits support built out. Once we have that, we can shift to non-nullable "pointers" by default.

- [2023-08-10 Github Chris Lattner](https://discord.com/channels/1087530497313357884/1138854784930172928/1138902579640807566)



## Syntax 
### Syntactic Sugar
Syntactic sugar is fun and exciting, but we want to avoid this after learning the hard way from Swift that it distracts from building the core abstractions for the language, and we want to be a good member of the Python community so we can evolve Mojo alongside Python. We'd prefer to avoid it complely dding any additional syntax

Syntactic sugar is fun and can be exciting, but it is also dangerous, and I'd personally prefer we avoid it completely unless it is extremely highly motivated by the core use case (accelerators, systems programming etc) that Python doesn't already service.


- [2023-06-02 Lex Fridman Interview 3:04:28](https://youtu.be/pdJQ8iVTwj8?t=11068)


### `let` inside `fn` definitions
Thank you for filing this. This is known (to me) to not be supported. We have the infrastructure to do this now, but we need to decide whether we want it. There are various folks (incl on this forum) that are proposing that we eliminate `let` declarations to simplify things, and I'd rather resolve that direction before investing more time into let declarations.

Incidentally, this discussion will come up "real soon now" as it is all tangled into the lifetime proposal. This should be coming to the community for discussion in the next two weeks.

- [2023-05-29 Github Issue](https://github.com/modularml/mojo/issues/280#issuecomment-1566300145)

### traits / protocols
_currently an unimplemented feature_

We don't have a final name here, Guido recommended that `Protocols` as term of art in Python already, but we'll need to loop back around and make a decision when we get there.

### `help` builtin
On the implementation, we'll need some work to build out `help(object)` and `help(Int)` (where Int is a struct, not a class).  I don't see us prioritizing that in the next month or so, but it is super important for us to do that over time.  We have ways to do that without adding a field to Int 🙂 etc, so that should be fine. It depends on Traits/Protocols which is on our roadmap

### `alias` keyword
`comptime` is really obvious to Zig folk, but that's not really our audience. You're right that `alias` may not be the right word to use here either. Aligning this around "parameter" could be a good way to go, but I'm curious if there are other suggestions.

Once nice thing about "alias" is that it is more obvious for the trivial cases like alias my_magic = 12312 or alias Int8 = SIMD[DType.int8, 1]. That doesn't make it the right thing, but it is a nice thing.

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

### Float32 vs DType.float32
`Float32` is defined as an alias of `SIMD[DType.float32, 1]`. The equivalent for `DType.int32` is `Int32`, although you'll need `from SIMD import Int32`. DType is an enum describing different data types -- SIMD is how you get something that can hold a value of that type. [More information here](https://docs.modular.com/mojo/MojoStdlib/SIMD.html)

### `self` keyword
Dropping the `self` keyword would diverge from Python a lot. it would also break orthogonality in the language. Swift suffers from a ton of extra keywords by not making self be explicit. It is better to just keep things consistent and explicit (also precedent in rust etc)

### Owned and consumed
They're the same thing. Consume is the word we're currently using for the operator, owned is the argument convention. We may need to iterate on terminology a bit more.

- [2023-05-04 Hackernews Chris Lattner](https://news.ycombinator.com/item?id=35809658#35817237)

### `^` consume postfix operator
Because it composes properly with chained expressions: `x.foo().bar().baz^.do_thing()` vs something like `(move x.foo().bar().baz).do_thing()`

- [2023-05-04 Hackernews Chris Lattner](https://news.ycombinator.com/item?id=35809658#35817237)

### `Int`
Int is like intptr_t which is 64-bit on a 64-bit machine, 32-bit on a 32-bit machine

### Leading underscore `_foo` for private members
This is a very clear extension we could consider, highly precedented of course. In the immediate future we are focusing on building the core systems programming features in the roadmap. When that is complete, we can consider "general goodness" features like this.

### `rebind`
> It will be nice to change the current rebind parameters from [dest, src] to [src, dest] since its more intuitive that the other way around. The current signature is rebind[dest_type, src_type](src_val)

The current way works better with parameter inference, because you can call it with `rebind[dest_type](src_val)` and have src_type inferred from the argument.

### `lambda` syntax
Loosely held opinion, Mojo clearly needs to support:

Nested functions (currently wired up, but have a few issues given lifetimes are not here yet). I'd like @parameter to go away on the nested functions eventually too.
Existing Python lambda syntax, which is sugar, we need to support type annotations here.

Lower priority, but I think we're likely to explore:

Possibly implement more flexible/general/ergonomic light-weight closures like Scala3 => syntax

User defined statement blocks, e.g.:

```python
parallel_loop(42):
stuff()
```

User defined statements are a nice way to shift more language syntax into the library, but are just syntactic sugar and will require a little more infra to get wired up. For example, I would like "return" in that context to return from the enclosing function (not from the lambda), and things like break to work for loop-like constructs. This is quite possible to wire up, but will require a bit of design work.

It still bugs me how "return" works the wrong way and break doesn't work in a "closure taking control flow" function in Swift. We can do better.

### Curly Braces
C, C++, Java, Swift etc curly brace languages are typically run through formatting tools now to get indented, so you end up with indentation and curly braces, why not get rid of the clutter and have a more beautiful thing? Some languages allow you to do both which adds a complicated design space that you don't need with Python style indentation.

- [2023-06-02 Lex Fridman Interview 13:23](https://youtu.be/pdJQ8iVTwj8?t=803)

There are practical reasons why brackets will not work and why significant whitespace is crucial to the parser: lazy body parsing. Mojo's parser can trivially skip over the body of structs, functions, etc. because it can use the expected indentation to find the end of the indentation block.

> After more discussion
This suggestion cuts directly against or goals for Mojo, which is to be a member of the Python family. Thank you for your suggestions, but our goal isn't to design a new language from first principles (been there done that 😄), it is to lift an existing ecosystem. We are also not adding general syntactic sugar, we are focused on core systems programming features that Python lacks.



### `type` builtin
The issue with adding the type builtin to Mojo is that we don't have a runtime type representation yet. I.e. in Python, type returns a type instance that can be used like a class.

### Generic `AnyType` 

This is mostly just a placeholder for now.  This has known problems and will need to be reworked when we get traits/typeclasses/protocols filled in.  Do you have a specific interest/concern in mind?
One problem with AnyType is that we will need to decide if it is implicitly copyable/movable, if that is trivial, etc.  There are lots of properties we'll want to be able to express elegantly; none of this has been designed, but there is a lot of prior art in rust/swift/haskell/etc.

- [2023-05-30 Discord Reply](https://discord.com/channels/1087530497313357884/1113029339500511233/1113149935773298698)

### StringRef from LLVM
Yep that's where it came from. It is directly related to string_view in C++, the LLVM data structures predate the C++ STL growing all these things. The idea of a `pointer + extend without ownership` is more general than a `reference to a specific owning data structure` because it type erases the concrete storage type. For example, an LLVM StringRef can point into C array, an std::vector, or one of the zoo of other specialized storage types llvm has - it can even point to a scalar on the stack.

Per the comments above, I think actually calling this sort of type `ArrayRef` and `StringRef` in mojo would be super confusing if we have `ref` as a different concept. Python generally uses the word "Slice" for these things, and I think that would be great to use for these.

- [2023-06-12 GitHub Chris Lattner](https://github.com/modularml/mojo/discussions/338#discussioncomment-6145782)

### `borrowed` keyword
I don't have strong opinions, but I have some concern about general programmers (i.e., those without Rust experience) and the word "borrow". It is a word that can be explained and has good meaning in the rust lexicon, but doesn't connote referencing something, and doesn't even appear in the rust language (they use the & sigil instead). This isn't to say that "borrow" or "borrowed" is bad, but it does have some challenges.

- [2023-06-12 GitHub Chris Lattner](https://github.com/modularml/mojo/discussions/338#discussioncomment-6145791)

## Python
The best place for a summary about how Mojo interacts with the current Python ecosystem is in the official [Why Mojo?](https://docs.modular.com/mojo/why-mojo.html#a-member-of-the-python-family).

### Compatibility
The end goal of Mojo is to be a proper superset of Python. That's not what Mojo is today, but that's what it is designed to become and that is what we're working towards.

All Mojo code is compiled by the Mojo compiler, including code that happens to be syntactically identical to Python. The CPython implementation comes in when you import a CPython module into an object. That is exactly a CPython object with exactly the same runtime representation, and uses the CPython interpreter to implement support for it, by using the PyCall and PyAddRef etc. APIs under the hood.

Also, we don't see Mojo as different than Python. Mojo is a member of the Python family just like PyPy, IronPython and many others are members of the family, we're very happy to be able to work directly with the smart folk who have built Python 3 into such a beautiful thing.

We will support all of the complicated Python implementation details, but it will not be the default implementation for Mojo `struct` and `fn`. There will be different levels of dynamism, on one hand we will have the full Python descriptor hashtable dynamism and on the other hand we will have regular virtual classes with vtables.

There are many theoretical features we could add to Python to make it better in various ways, but we're resisting the urge. We want Mojo to be a good member of the Python community, and the systems programming features and compatibility features need a lot continued development.

As the core mojo language evolves, we expect more pure-mojo code to be used in practice, and less compatibility-cpython code. This will happen progressively over time, for example Swift was adopted first by apps, rewrites of core infra happened asynchronously where there was value to doing so.

Our immediate focus is on accelerators and ML kernels etc, we'll scale up to C++ use cases, and then to the full Python enchilada, this will take time, but certainly not 10 years 😉

Now you can't ignore C extensions, MLIR and compilers can do more than one thing and so we can talk to other ABIs and handle other layout constraints. We haven't built a proper API to talk to CPython extensions directly from Mojo subsystem, but when we do, it will have a GIL because C extensions require it.

- [2023-05-09 Discord Tim Davis](https://discord.com/channels/1087530497313357884/1105324004513959978/1105340866148708432)
- [2023-05-04 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103401693238013952/1103403116109516832)
- [2023-05-17 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1108140099012673626/1108190672139329536)
- [2023-06-02 Lex Fridman Interview 1:37:56](https://youtu.be/pdJQ8iVTwj8?t=5874)
- [Mojo using Python: Mandelbrot Example](https://docs.modular.com/mojo/notebooks/Mandelbrot.html)

### Python using Mojo code
We learnt a bunch of tricks along the way converting an entire community of programmers from Objective-C to Swift, we built a lot of machinery to deeply integrate with the Objective-C runtime, we're doing the same thing with Python. When a new library gets built in Mojo people should be able to use it from Python. We need to vend Python interfaces to the Mojo types, that's what we did in Swift and it worked great, it's a huge challenge to implement for the compiler people, but it benefits millions of users and really helps adoption.

- [2023-06-02 Lex Fridman Interview 1:53:29](https://youtu.be/pdJQ8iVTwj8?t=6809)

### Speedup moving from CPython to Mojo
Interpreters have an extra layer of bytecode that they have to read and interpret, and it makes them slow from this perspective. Converting your code to Mojo does gets a 2-10x speedup out of the gate without doing anything fancy, we haven't put any effort into optimizing untyped code yet.

In Python everything's an object, the memory layout of all objects is the same, so you're always passing around a pointer to the data which has overhead from allocation and reference counting, so you can move that out of the heap and into registers and that's another 10x speedup. 

Modern CPU's allow you to do Single Instruction Multiple Data (SIMD) to run the same operation on a vector of data which Python doesn't expose, Mojo builds it into the language and this can lead to more huge speedups. 

Python also has the Global Interpret Lock (GIL) due to reference counting and other implementation details, in Mojo you can take direct advantage of threads. 

There's even more performance improvements via things like memory hierarchy, autotuning to use the optimal vector size on your target, Mojo allows you to take advantage of all these powerful things that have been built into hardware over time.

If you care about performance you can incrementally move Python to Mojo and you adopt new features for performance, but only if you care about performance! If you don't, hack on and do so without caring, and all is well.

- [2023-05-17 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1108140099012673626/1108190672139329536)
- [2023-06-02 Youtube Chris lattner](https://youtu.be/pdJQ8iVTwj8?t=1521)

### Untyped Mojo Improvements over Python
The easy answers are that the compiler eliminates a ton of overhead compared to the interpreter even if the individual operations are the same, and our dynamic object representation is a variant on the stack for simple things like numbers instead of a heap box, which is a huge win. We aren't doing any interesting static or dynamic analysis like V8 or PyPy etc yet, but we can obviously layer those things into the system as it matures.

- [2023-06-14 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1118249387915751538)

### Runtime specialization
Right now the JIT just provides compilation, not runtime specialization or adaptive compilation. We can add that, but our goal isn’t to make dynamic code static with runtime information, it's to allow people to express static code as static.

- [2023-05-09 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1105494308091600997)

### Performance Cost for CPython library calls
I don’t expect major concerns here. Notably we don’t need to be compatible with the Python C API, so many challenges are defined away by that. A major challenge with Python is that it only has one static type, which has no explicit spelling, and is therefore explicit, and refers to a CPython runtime object. This is why, for example, all integers and floating point values must be boxed into a python object value. Mojo solves that by having more than one static type, so it can reason about the fact that `int` and `Int` are very different animals at runtime, even through they are efficiently convertible between them.

- [2023-05-09 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1105494308091600997)


### CPython Major Updates
Just like when the C or C++ committee adds a new feature to their languages, Clang fast follows. Mojo will follow the same model.

- [2023-05-03 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103190423033356348/1103190904031944735)

### Integer Overflow on `object` (Mojo untyped object)
It needs to eventually provide full Python semantics, so we'll need `object` to contain a `PythonObject` in its variant. We could overflow from inline `int` to Python object on demand.

- [2023-06-04 Github Chris Lattner](https://github.com/modularml/mojo/issues/328#issuecomment-1579468329)


### Global Interpreter Lock (GIL)
Like most other languages, Mojo just doesn't have a GIL 🙂. Mojo is a completely new language, and is built with all new compiler and runtime technologies underneath it. It isn't beholden to existing design decisions in Python, but we've learned a lot from Python and want to be a good member of the Python community

However imported Python modules run the same way that CPython does, and you have to move it to Mojo to get the performance and deployability advantages that Mojo brings.

- [2023-05-09 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103067225600049243/1103067483939807302)
- [2023-05-03 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103006101261267004/1103006421240528956)

### Existing Python libraries
Yes, all existing Python libraries run in Mojo through the builtin CPython interpreter.

- [Mojo Programming Manual Python Integration](https://docs.modular.com/mojo/programming-manual.html#python-integration)

### Classes
You can import python packages and use their classes, you just can't define your own in Mojo yet.

- [2023-05-05](https://discord.com/channels/1087530497313357884/1098713601386233997/1103837984391954442)

### `object` type in Mojo
It's a struct that wraps a pointer to a CPython object

- [2023-05-11](https://discord.com/channels/1087530497313357884/1106110477228048546/1106132610410893362)

### String to PythonObject
Right now you can turn a `StringRef` or a `StringLiteral` into a `PythonObject`. To get a `PythonObject` from a `String`, you'd need to turn the `String` into a `StringRef`. This is available through some underscored methods, but it's currently unsafe due to some lifetime issues. Let me see if I can add a direct conversion path, though it will take a week to make its way to the playground.

A direct conversion should be included in the next Playground release.

- [2023-06-08 Discord Alex Kirchhoff](https://discord.com/channels/1087530497313357884/1116063443200520334/1116066258664828949)


### Type Erasure for Python Support
This currently doesn't work as it does in Python due to `a` inferring the `int` type and raising an error when changing type:
```python
a = 9
print(a)
a = "Hello"
print(a)
```

I agree we need to decide what the model is. This __must__ work, at least in a def, for python compatibility. `def`s currently allow implicit declaration, but infer the type from the first assignment. The above implies that implicitly declared variables in a def should default to having object type (which type erases the concrete type and will allow the above).

I think this is the right/unavoidable thing to do, but I have two concerns:

We don't really have the language features in place to implement object correctly (notably need the basics of classes), so I'd like to avoid switching to this model until we can make it work right.

This push us to define/create the "type erasure of structs to object" model so that user defined struct types can be used here. We may or may not want to do this, it isn't clear to me. There is a lot of precedent in this in the Swift world where Swift classes can be typed erased to "AnyObject" (aka id in ObjC) and that type allow dynamic dispatch in various ways. See eg https://github.com/apple/swift-evolution/blob/main/proposals/0116-id-as-any.md

These are super nuanced issues and I'd like to get more experience with the core language before touching into this. There is a big difference between bringing up something simple and building it really great.

### Python keyword compatibility
For now, we need to get Mojo from 0.1 to at least 0.7 (conceptually, we have no specific versioning planned), at which point we'll understand more of what we're dealing with, and have broader developed relationships with the python community.

Also, my understanding is that Python3 generally doesn't take hard keywords for various compatibility reasons, even things like "case" are a soft keyword. If that is true, then we may be fine.

### Bounds Checking
We have to implement array bound checking for our array/slice types, we just haven't solidified them due to missing features (notably traits)

### Migration
Mojo is aiming to be a full superset of Python, the world went through a very long painful migration from Python 2 to Python 3, I don't want people to have to go through that if they want to move to Mojo, they shouldn't have to rewrite all their code.

- [2023-06-02 Lex Fridman Interview 35:25](https://youtu.be/pdJQ8iVTwj8?t=2125)

## Tooling
### CLI
There is a CLI to do all the stuff you'd expect, but we're not ready to release that yet.

### Formatter
We have a fork of Black that supports Mojo that we use in-house. I imagine that in due time we'll be releasing this or something like it, or contributing support to upstream Black if they want to add Mojo support.

### VSCode and LSPs
Yep, we fully support this. Our VSCode experience is pretty great and many of us live on it, we just haven't been able to expose it on day 1. Stay tuned.

We care a huge amount about tooling, and will definitely be investing a lot here, the team member that built the Mojo LSP has built many LSP implementations including MLIR.

### LSP implementation reuse
It's kind of tricky because the implementation of LSP is generally heavily tied to the language itself, the frontend, and all of the intricacies there. Having implemented ~5 LSPs now, I have found that the most reuse you get is around the protocol and surrounding utilities/setup. The implementation is almost always different (given that each language has a different frontend setup), but the way you implement things wants a lot of the same underlying bits. Other than that the only real reuse I've gotten between frontends is sharing methodology on how to actually implement the different features, like code completion/hover/etc. Having a good reference is extremely useful, given that implementing some features can be really complex if you don't know what you're doing.

## Implementation details

### Init uninitialized objects in `fn`
This is effectively how the Mojo compiler works internally, and we fudge a couple of things for sake of simplicity of model. For example, the `self` member of a `__del__` destructor is a reference, but it is "magic" in that it is required to be live-in and uninit-out. The self for a memory-only `__init__` has the opposite polarity, being uninit on entry and init on exit.

- [2023-07-04 Github Chris Lattner](https://github.com/modularml/mojo/issues/372#issuecomment-1619181242)

### Multiple Moves with `^`
The `^` operator kills a lifetime or invokes the stealing moveinit, producing a new owned RValue, so `^^^` is just repeatedly moving 🙂. It is probably a noop in the implementation because we do move elision, I haven't checked though.

- [2023-07-04 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1125596235882041464)

### Autoderef
The weirder thing to me about the rust approach with `autoderef` is how it handles smart pointers etc. The safe default is to start without `autoderef` and we can see what that does for ergonomics of the resultant libraries. Any time there has to be a stumper "quiz" about a language feature, it is a sign there is something wrong 😀. In Rust, allowing impl traits on borrows themselves is "interesting". I'm not sure about why that was chosen vs just allowing nominal types to implement traits, but there is probably a good reason.

- [2023-07-05 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1125597373956116492/1125832654584029204)

### Destructors
This is intentional. Mojo uses an "ASAP" deletion policy which deallocates values much earlier than other languages.  [Please see this section of the documentation for more information and rationale](https://docs.modular.com/mojo/programming-manual.html#behavior-of-destructors)

I'm sure this isn't actually completely novel, but I'm not aware of another language that does this. I'd love to learn more if other folks are aware of one that does.

This is all compile time analysis, not runtime

In terms of danger, it's not "dangerous", but it requires the ability to reason about logically "inner pointers". There are several ways to do this, but one of the most important way is based on the lifetime model. Borrows to inner values extend the lifetime of the underlying object in exactly the same way. The lifetime model is halfway figured out right now, I'm very confident it will be awesome, but we need to get it all built to really understand the details.

### C++ and Mojo use at Modular
There isn’t a simple answer here, it depends a lot on details.  For example, the kernel library is all written in Mojo, because C++ is not expressive enough to do what we need. No auto tuning, capable but ungainly meta programming system, doesn’t talk to mlir.

For other parts of our stack, we need some missing features, the most important in the short term are lifetimes and traits/protocols. When those come in, we will be a lot more unblocked and can evaluate what makes sense to move over.

Rewrites can be beneficial beyond the technical capabilities of the system btw.  It is a good step to take what you’ve learned in v1 and reconsider in v2.  Many tales of “we rewrote our system in X and got big benefits” are due to the new thing being architected better than the old thing.

But to your meta point, yes, I fully expect Mojo to be >> C++ for our usecases across the stack.  It will take a bit of time, but I would really like to stop writing c++ some day 🙂

### Global Variables
Global variables were added to the language but they have not been wired into the REPL environment yet. The REPL environment layers extra features on the language to provide redefinition and top-level variables, and using global variables to enable the code you wrote has not occurred yet. Sorry for the confusion!

- [2023-07-14 Github Mogball](https://github.com/modularml/mojo/discussions/448#discussioncomment-6443661)


### Boolean on SIMD types
The way to do this is by explicitly calling the bool method later:
```mojo
struct MyPair:
var first: Float32
var second: Float32

fn __lt__(self, rhs: MyPair) -> Bool:
    return (
        self.first < rhs.first
        or (self.first == rhs.first and self.second < rhs.second)
    ).__bool__()
```

We could add `SIMD[DType.bool, 1]` as an initializer to the `Bool` type, but cannot do that currently because `Bool` is a builtin type while `SIMD` is not. We need to think about this and have a library-based solution.

- [2023-06-07 Github Abdul Dakkak](https://github.com/modularml/mojo/issues/335)

### `String` supporting UTF-8
We want to enhance the `String` type to support UTF-8 encoding before starting work on file system.

- [2023-06-07 Github Abdul Dakkak](https://github.com/modularml/mojo/issues/306#issuecomment-1579268808)


### Mutable and explicit types when iterating over collections
This was noted as a known `sharp edge` in the [roadmap & sharp edges](https://docs.modular.com/mojo/roadmap.html) document. The behaviour here is definitely subject to change, maybe syntax like `for var i in range(3)` but I don't have a strong opinion.

- [2023-06-07 Github Jeff Niu](https://github.com/modularml/mojo/issues/331#issuecomment-1579122472)

### String UInt8 implementation
It makes sense to use `UInt8` instead of `Int8`, although users should not be working directly with the bytes within a string 😀. Also, we try to match C semantics here which uses `char *` for strings. There is a plan to perform optimizations on strings for example small string optimizations, so you should never depend on its layout.

- [2023-07-02 Github Abdul Dakkak](https://github.com/modularml/mojo/issues/420#issuecomment-1615472005)

### Sorting Algorithm discovered by AlphaDev
Sure, that algorithm could definitely be used inside the Mojo sort algorithm.  What they found is something you'd put into a standard library, e.g. they put it into the libc++ c++ standard library, eventually it could go into the Mojo stdlib.

- [2023-06-12 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103420074372644916/1117497920678285332)

### Loop Unrolling
These are two loop decorators to tell the compiler to unroll a loop, see [wikipedia loop unrolling](https://en.wikipedia.org/wiki/Loop_unrolling). This doesn't impact the functionality of the loops, but potentially can help for better performance since it opens possibility for further compiler optimizations.

Fully unroll the loop's 10 iterations into 10 `do_something` calls and remove the for-loop:
```mojo
@unroll 
for i in range(10):
  do_something(i)
```

Unroll every 2 iterations and loop over 5 times:
```mojo
@unroll(2)
for i in range (10):
  do_something(i)
```
This decorator can be attached to while statement too.

Note that currently the compiler can only unroll a loop:

- Its lower bound, upper bound and induction variable step every iteration are compile time constants
- There is no early exits in the loop body that makes the loop trip count dynamic during runtime.

Otherwise, Compilation fails if a loop is decorated with `@unroll`

Here is a brief description of these two decorators in [Mojo changelog on 2023-07-26](https://docs.modular.com/mojo/changelog.html#july-2023).

[Functional.unroll](https://docs.modular.com/mojo/MojoStdlib/Functional.html#unroll) performs the same loop unrolling functionality as library functions. There are a few differences between using library function of unroll and decorator `@unroll`` are:

- Library function call requires the induction variable to be a parameter while the decorator uses the induction variable as a dynamic variable.
- Library function call unroll the loop so that the program the compiler starts to compile is with unrolled code. The can potentially increase the amount of code to compile depends on the amount to unroll.
- Decorator unrolling happens at later stage of compilation which prevents program explosion too early.

-[2023-07-28 Github Weiwei Chen](https://github.com/modularml/mojo/discussions/482#discussioncomment-6581104)

### Python PEP 703 - Optional Global Interpreter Lock
It should be strictly compatible with Mojo's use of CPython and I think it is a good move for the Python ecosystem in general. I'm seeing a lot of folks that seem to be declaring success early, my read of PEP703 is that there is still a lot of work to do to figure things out and land things. The [Python core team summary](https://discuss.python.org/t/a-steering-council-notice-about-pep-703-making-the-global-interpreter-lock-optional-in-cpython/30474) is really great and I highly recommend reading it. It seems like the transition will take a few years. I'm personally very curious how heavy users of CPython internals (e.g. TensorFlow and PyTorch) will handle the transition - the changes are pretty profound, breaking core C APIs like `PyList_GetItem`.

Also my read of the code in the implementation seems that they may need to iterate a bit. One of the core operations in the critical path for performance is `_Py_ThreadId` and my read of it is that it will break code that uses thread local storage for other things by directly scribbling into it in a [very low-level way](https://github.com/colesbury/nogil/blob/f7e45d6bfbbd48c8d5cf851c116b73b85add9fc6/Include/object.h#L428-L455)

That said, there are a ton of crazy smart people working on this and everyone seems highly motivated. Overall, it's a great step forward for the ecosystem in any case in my opinion.

- [2023-07-31 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1135312969664843846/1135332933805285457)

## Comparisons
[Why we chose to write a new language](https://docs.modular.com/mojo/why-mojo.html)
### Julia
I think Julia is a great language with a lovely community, but it's a different angle to Mojo, our goal is to take something great in Python and make it even better, so programmers don't have to learn an entirely new language. It is aligned with the Python community to solve [specific problems outlined here](https://docs.modular.com/mojo/why-mojo.html)

Mojo also has a bunch of technical advancements compared to Julia by virtue of it being a much newer development and being able to learn from it (and Swift and Rust, and C++ and many many other languages). Including things like ownership and no GC. We also think there is room for a new language that is easier to deploy, scales down to small envelopes, works directly with the full Python ecosystem, is designed for ML and for MLIR from first principles, etc.

Julia is far more mature and advanced in many ways. Many folks have and will continue to push Julia forward and we wish them the best, it is a lovely ecosystem and language. There is room for more than one thing! 😃

- [2023-05-02 Hackernews Chris Lattner](https://news.ycombinator.com/item?id=35790367)
- [2023-06-02 Lex Fridman Interview 2:06:25](https://youtu.be/pdJQ8iVTwj8?t=7583)

### Typescript
TypeScript is very popular, a lot of people use it and it fits right into the JavaScript ecosystem, Mojo has a similar relationship to Python where it's a superset. All the Python packages work in Mojo which is really important to us, we don't want to break the Python community. 

There's a big difference though, Python already allows you to add types like TypeScript, but they're just for tools to identify bugs and obvious mistakes in your code, those types aren't used to improve runtime performance. Mojo takes it to the next step, we often see 10x-20x performance improvements just by adding a few type annotations.

In the traditional world of Python if you run into performance problems, or if you need access to low level features you have to build a hybrid package of half C/C++ and half Python. In Mojo you can continue writing dynamically typed code, and you can also use lower-level syntax and put more effort into performance, instead of having to switch to a completely different language where the debugger no longer works on both sides.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=747)

### Rust
I don't think that mojo has any burden to prove novelty vs rust.  We're happy to adopt good ideas from Rust as with all other existing languages. Graydon himself was very happy for Rust to pull good ideas when he started it, and wasn't ashamed to admit it.  Mojo is similar.

I also don't see Rust and Mojo in competition, while I'm hoping that Mojo can learn from and improve vs Rust in various areas, they're clearly servicing different segments of the world. Yes there is some crossover, but Rust is far more mature than Mojo and Rust is continuously improving as well. If you'd like to continue using Rust, go for it 😀.

If you're interested in language nerdery, then yes, there are ways in which Mojo can provide better performance than Rust. There are two categories:

1. There are very low level implementation details (e.g. borrow by default instead of move, moves not implying memcpy etc) that can affect idiomatic use of the language at scale. As others say, it will be difficult to know how these work out until Mojo is more complete and there are more at-scale applications like your caching system. Mojo's trait system in particular is missing, and it's hard to write much realistic generic code without that! 

2. Mojo open new frontiers for GPUs and other accelerators. We can all have different opinions about what the "end of moore's" law means for computing, but if computers keep getting weirder, and if that matters for important workloads that you care about, then Mojo will be interesting because it can talk to them in ways that other languages weren't really built for.

That said if you care about Fibonacci on X86 cpus, both Rust and Mojo (and Clang and many many others) are all zero cost languages that boil down to LLVM. As such, any advantage claimed on such a workload will be more about accidental implementation details than anything else and could be easily fixed.

- [2023-06-25 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1122302305438539826/1122372150146383906)

### Codon
Codon is a cool project, but fundamentally different and doesn't meet the objectives outlined on our "why use mojo?" page. Codon (like PyPy and many other existing projects) are in the line of projects that try to use "sufficiently smart" [JITs and other compiler techniques to make python faster](https://docs.modular.com/mojo/why-mojo.html#related-work-other-approaches-to-improve-python)

That is not our goal. Our goal isn't a somewhat faster Python, our goal is full performance on heterogenous hardware, and deployment to things that Python and C++ can't do. There is some overlap in goals of course, but Mojo is far more ambitious (and a much larger engineering investment) than something like Codon.

There are numerous other technical things, for example Codon changes the semantics of integers in Python, so it isn't actually a compatible superset like Mojo is.

### Vale
(Chris Lattner) I'm a bit familiar with Vale, also friends with the Val folks (DaveA etc) and am also familiar with the Pony and various other languages. They're all super cool.

### JAX
We love JAX and PyTorch and TensorFlow and all the other APIs with all their beauty and warts. Modular doesn't have a training API, but it could be interesting for the community to explore that as Mojo matures over time

### IREE
I'm not sure, while I know many folks that work on IREE but I haven't used it myself. My understanding is that it is research focused and doesn't provide (e.g.) full compatibility with all tensorflow and pytorch models. It also seems difficult to extend unless you yourself are a compiler engineer. It is also 4+ years old and is Google led, so it is hard to predict where it will go and when. 

The Modular stack is production quality, run by an independent company and has extremely different internal design premises and is focusing on ensuring our customers and users succeed in real world deployments. It is designed for extensibility by non-compiler-engineers writing Python and Mojo 🔥 code, and is designed for an open ecosystem of operators and numerics.

I'm sure there are dozens of other differences, but we are more focused on building an amazing thing than we are about other systems.

### Dex
Dex is really cool, but I haven't paid attention to their development recently so I can't gie a good comparison.

Generally speaking though, Mojo isn't providing a "sufficiently smart compiler" that magically transforms your code in unpredictable ways. Instead of provides a simple and predictable programming model that is super hack able and extensible.

### TVM
TVM is a nice system, as is XLA, Halide, NVFuser, and many many others. We're not claiming to have invented parallel foreach loop. If TVM works for you, then that's great!

Mojo and the Modular stack have a number of technical improvements that go far beyond TVM, and we certainly appreciate the research that it has contributed over many years. We've learned a lot from it and many other existing systems.

### Triton
[There are some comments on EDSLs like triton here](https://docs.modular.com/mojo/why-mojo.html#related-work-other-approaches-to-improve-python)

But one big difference is that Mojo is a full language, includes a debugger and full tool suite, etc.

Triton is more of a specialized programming model for one (important) kind of accelerator, and is not even fully general/expressive for what GPUs can do

Honestly, I'm not an expert in Triton, nor with the issues you're mentioning. I'm not sure what happened there.

### ONNX Runtime
we run benchmarks against ONNX Runtime, and in our tests, the Modular AI Engine is almost always faster than it. We may add these numbers to the public dashboard at https://performance.modular.com/ in the future.

- [2023-08-14 Alex Kirchhoff](https://discord.com/channels/1087530497313357884/1140700862524690632/1140733786414399608)

### CPython compilers
Correct, we put no effort into trying to make CPython go faster - other folks are doing that, and we compose on top of it. If you want the benefits of mojo you move your code into the mojo world. We're prioritizing "simple and predictable" programming models


### General
Part of this decision to write a new language stems from the Swift4TensorFlow experience, which had a few lessons informing the decision to launch a new language rather than building on top of an existing one (which is what Swift4TF attempted to do)

1. You have to get the fundamentals right. Trying to build on top of something that wasn't designed at its core to do what you need it to do is going to lead to substandard solutions.
2. The ML community really loves Python. Mojo is trying very hard to preserve most (but not all) of the Python programming model, with modern takes and advancements on the core ideas of the language -- Python has a ton of great ideas from a PL perspective, but suffers from being decades old

As for "why not fork an existing thing?", well like it's written in our rationale doc, we didn't set out to build a new programming language. We also have to move fast, and taking on existing systems has a cost versus building something ourselves that has to be evaluated


## Interpreter, JIT and AOT
### JIT
We use JIT compilation for on-demand generation of code, but don't do any "de-virtualization or specialization" tricks that dynamic languages use to get performance. Instead we honor dynamism and give programmers the ability to express static things if they want it. This provides a simple and predictable programming model which scales.

### AOT vs JIT
We support and use both, but it is important for our deployment and accelerator goals to enable AOT compilation instead of requiring JIT for everything.

We have an interpreter (part of the parametric comptime metaprogramming system), a JIT (used by the LLDB/REPL/Workbook flow and used by on-demand kernel fusion) and AOT compiler (used by the mojo CLI)

BTW, in case you didn't know, we're not afraid of building cool hardtech things here. Compilers are cool 😉

Our JIT is also used for adaptive compilation - search performed at compile time

### Speed
JIT performance is generally the same as AOT performance.
It does take time to compile code, but once you do that, you get generally the same code.

## Compilation

### Alias Analysis
It does a simple intraprocedural `bitvector(!)` dataflow analysis to implement all this. It uses local field sensitive pointer provenance for recursively nested fields.

It isn't whole program like [Steensgaard's](https://en.wikipedia.org/wiki/Steensgaard%27s_algorithm) or [Andersen's](https://en.wikipedia.org/wiki/Pointer_analysis) analysis. It is flow sensitive, is field sensitive, and it is very simple / predictable, because you need that to get good error messages, although our messages could still be improved.

As of today, Mojo has perfect understanding of pointers, but with the introduction of lifetimes, it will get may-alias relationships and use a union-find algo like steens under the covers as part of the implementation.

Lifetime and ownership tracking isn't an optimization and isn't performed at the LLVM level, it is performed as part of the mojo compiler frontend itself.

Optimizations are generally disabled at -O0 and aren't guaranteed.  Lifetime analysis is precise, guaranteed and not subject to differences in analysis precision. You wouldn't want the order or placement of destructor calls to depend on the compiler version you use.

Mojo generators happen in [SSA](https://en.wikipedia.org/wiki/Static_single-assignment_form) form, we haven't enabled full imperative reflection over the MLIR representation, but would like to build towards that. This is the "ultimate python decorator at compile time" after all

- [2023-06-09 Discord Reply](https://discord.com/channels/1087530497313357884/1116158407322386553/1116462378222100541)
- [2023-06-02 Discord Reply](https://discord.com/channels/1087530497313357884/1113898580885917786/1113914827988013147)

### MLIR Dialect for Unique Requirements
I worked on Google TPUs (which have several public architecture papers), I'm familiar with difficult to program accelerators w funky requirements 🙂.

One of the major ideas in Mojo wrt MLIR and hardware is to expose "compiler engineering" to library developers instead of having to hack the compiler. That said, we have great ambitions and plans, and I don't want to get us over our skiis. We need to get lifetimes and traits (and numerous other smaller features) [explained in the roadmap](https://docs.modular.com/mojo/roadmap.html) done before we can go out and play. The architecture is in place though. 

- [2023-06-02](https://discord.com/channels/1087530497313357884/1113898580885917786/1113915440587079680)

### Triton Compiler Tech
Hi njs, GPUs are very important to our work obviously, and we'll have something more to share about that later this year.
Zooming out though, your point about "Triton had to build a compiler in order to express a new programming model" is really a key observation. One of our goals is to enable building programming models like this `as a library` using the metaprogramming features in the language.

Folks shouldn't have to design an entirely new compiler/EDSL to achieve such a thing

- [2023-06-02 Discord Reply](https://discord.com/channels/1087530497313357884/1098713601386233997/threads/1113898580885917786)

### Producing binaries
Mojo is built directly on top of existing compiler technologies like LLVM, which means you can produce object files, libraries, and executables (via the CLI). The Mojo Playground environment is different, however, since it uses our JIT.

Good deployability is a core part of Mojo's language design e.g. [our matmul implementation is ~100kb](https://www.modular.com/blog/the-worlds-fastest-unified-matrix-multiplication)

### Compile to Shared Library
Yes, it can be compiled as a shared library, no problem. We're not prioritizing this right now, but we'll enable this at some point

### Binary Size
For Mojo, it depends on what you do - doing simple math is a couple kilobytes for final binary, doing something "heavy" like printing hello world pushes into 240K or so. We can definitely do better in hello world though, a bunch of stuff isn't getting stripped.

### Compilation speed
Your point about LLVM compile time is great one. Mojo is architected from the beginning for fast compile times, including deeply integrated caching and distributed compilation. LLVM "isn't slow" if you don't keep asking it to do the same thing over and over again.

- [2023-05-02 Hackernews Chris Lattner](https://news.ycombinator.com/item?id=35790367#35791498)

### What makes Rust/C++ compilation slow?
1. Type system. If you go with a [constraint based Hindly Milner](https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system) type system and then add things like overloading etc, you quickly get into exponential behavior. Swift has been fighting this for years now to tamp down the worst cases. This isn't good; don't do that.

2. Mid-level compilation model. "Zero cost abstraction" languages including C++ (but also more recent ones like Swift and Rust and now Mojo) rely in massive inlining and abstraction elimination to get "zero cost" behavior. LLVM can do inlining and simplification and all the other stuff, but it is a very low level of abstraction - generating a TON of IR and then asking LLVM to delete it for you is very slow, and shows up in the profile as "llvm is slow" because you're creating all the llvm ir nodes ("LLVM") and then asking llvm optimization passes to delete them for you. It is far better to not generate it in the first place.

3. Code generation: Reasonable codegen is O(N^2) and worse in core algorithms like register allocation and scheduling. This is unavoidable if you want high quality of results (though of course, llvm is also far from perfect). LLVM is also very old and single threaded. If you don't do anything to address these issues, you'll be bottlenecked in this phase.

- [2023-05-04 Hackernews Chris Lattner](https://news.ycombinator.com/item?id=35809658#35811426)

### Building for different hardware
We're working hard to get Mojo built out and available to more people and in more ways, so we haven't documented everything like this (stay tuned for more over time of course). The short answer is that the 'mojo' command line tool includes a bunch of things (including AOT compilation) but defaults to "run this like a script" mode using a JIT.

I can't comment yet on any of those specific hw strategies, but our approach is to build from the bottom up.

Building on other people's libraries (imo) has the problem of providing a great "happy path" that works in the cases they have optimized at the expense of the general case. We're willing to do the hard work to make things "just work" in the general case. Yes, this is hard tech and a really difficult problem to solve given the complexity of hte hardware accelerators and other things we're grappling with, but we think it is worthwhile to solve these hard problems for the ecosystem

Check out our (multiple) blog posts talking about this philosophy

One thing I'd say though is that you can't just do this with a PL approach, you need a whole stack ML solution to do this. This is the only way to solve the heterogenous compute problem that you're referencing

### Technology Mojo Builds on
Mojo builds on a lot of technologies where the research has been done and implemented such as MLIR, which is an evolution of LLVM that has enabled a new generation of compiler technologies. MLIR is now widely utilized across the entire industry for AI accelerators, we built it at Google and then open sourced it, and it's now part of LLVM. LLVM is an umbrella of technologies that includes MLIR, the Clang compiler for C/C++, and the fundamental building blocks like code generation for an x86 processor, so we build directly on top of that as well. This is the core of how we make the hardware go really fast.

- [2023-06-21 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=336)

### How is it faster than Python
That's the trick with Mojo, our goal is not to make dynamic python magically fast. Yes, we are quite a bit faster at dynamic code (because we have compiler instead of an interpreter) but that isn't by relying on a 'sufficiently smart' compiler to remove the dynamism, it is just because "compilers" instead of "interpreters".

The reason Mojo is way way faster than Python is because it give programmers control over static behavior and makes it super easy to adopt incrementally where it makes sense. The key payoff of this is that the compilation process is quite simple, there are no JITs required, you get predictable and controllable performance, and you still get dynamism where you ask for it.

Mojo doesn't aim to magically make Python code faster with no work, although it does accidentally do that a little, it gives you control so you can care about performance where you want to.

The Modular inference engine was constructed entirely on top of Mojo, and now is the fastest inference engine for TensorFlow and PyTorch models by maximizing the potential of hardware.

- [2023-05-04 Hackernews Chris Lattner](https://news.ycombinator.com/item?id=35809658#35811170)
- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=453)

### Build System
Mojo shifts the discussion on that a bit. A lot of value prop of build systems end up being about caching and distribution, which mojo provides natively.

None of that really matters for Mojo, but it is still quite important to have package managers and manage when and where compilation happens though... this is something of a gravel road that is not fully paved. We need to invest more in this in the future.

Various existing languages have problems with "LLVM compilation time", particularly when they claim zero abstraction costs and then expect LLVM to provide that for them. Mojo deftly defines away both through some cool MLIR things and also because it knows about caching.

### Package Manager
A lot of people have very big pain points with Python packages, it becomes a huge disaster when code is split between Python and building C code, Mojo solves that part of the problem directly. One of the things we can do with the community, is we'll have an opportunity to reevaluate packaging, we have an entirely new compiler stack so maybe we can innovate in this area.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=2196)
- [2023-06-02 Lex Fridman Interview 2:31:47](https://youtu.be/pdJQ8iVTwj8?t=9107)

### libc dependency 
Yes, support for low-dependence zig-like deployment scenarios is important to us and Mojo architecturally supports it, but we haven't put much effort into making that great yet. It's more of a gravel road than a paved road at this point 🙂

### WASM
Our first downloadable deliverable won't support WASM. This is a super interesting target for sure, but we're prioritizing getting things out with a first release, rather than blocking until we solve all the problems 🙂.

The Mojo stack is perfectly set up to do this. It doesn't use garbage collection, supports very small installed binaries etc. It'll be great, we just need to make a bit more progress.

- [2023-07-05 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1125837200748199988/1125837669964972125)

### WebGPU
Also have not put energy into that yet, but this is the starting point, not the ending point 🙂

### C ABI
We haven't designed this currently, but have a bunch of experience with native C/C++ interop from Swift using imported Clang modules. We're surely learn a lot from that experience when we get here.

We'll do something similar to the swift/clang integration, so it will use clang to parse the C/c++ headers, but it will use the same ABI so it will link to code built by gcc/msvc or whatever else you're using

### C++ Interop
We'd love that too, in fact that's largely what Modular is doing internally for our AI engine. All the kernels are written in Mojo, but a bunch of other stuff is in C++. We'll dissolve away more and more of the C++ over time as Mojo is built out. In any case, it is very important to us for Mojo to support fully hybrid systems.

### MLIR code with unknown dialects
The mojo compiler has a number of internal dialects, including `pop` and `kgen`, but they aren't documented yet. They are very much internal implementation details of the compiler and change all the time. I'd recommend sticking with the llvm and other dialects that are more stable.

### Compile Time Optimizations
Mojo's compiler is not going to be magic. If you write matmul as a triply nested for loop, you will get a triply nested for loop on all hardwares (barring LLVM optimizations).

The general idea is that Mojo's compiler is not going to perform some magic to optimize the code you are generating, but the language provides all the facilities to write that magic in a portable way as just Mojo code. Today, that magic is bundled into a handful of higher-order functions, like parallelize and vectorize_unroll, and as time continues, Mojo will ship with more "batteries" that mean most developers won't have to worry about SIMD, unrolling, etc. You just need to slap a few decorators on your functions/loops and call a function.

### Compiler Guidance
Mojo already gives a couple warnings that suggest better things to do, such as using `let` instead of `var` where possible. That said, the compiler isn't good at pointing out larger design pattern changes, for this I think we'll have LLM based tools outside the compiler itself. The UI is much better for explaining things in that context.

- [2023-06-05 GitHub Chris Lattner](https://github.com/modularml/mojo/discussions/323#discussioncomment-6084627)

## Lifetimes, ownership, borrow checking
### Ownership System
Mojo also has a more advanced ownership system than Rust or Swift, which is also pretty cool if you're into such things. Check out the programmer's manual here for more info: https://docs.modular.com/mojo/

It's related to work done in the Rust, Swift, C++ and many other communities, it's a body of work that's been developing over many years. Mojo takes the best ideas and remixes them so you get the power of the Rust ownership model, but you don't have to deal with it when you don't want to, which is a major help in usability and teaching.

- [2023-06-02 Lex Fridman Interview 53:33](https://youtu.be/pdJQ8iVTwj8?t=3213)

### Lifetime Parallelism Support
Our lifetime support isn't finished yet but will be in the next month or so, that is a cornerstone of that. Here is something I worked on in a former life that brought data race safety to swift, we will use some of the same approaches [but will also be very different in other ways](https://gist.github.com/lattner/31ed37682ef1576b16bca1432ea9f782)

Mojo doesn't have a publicly exposed lifetime system, so it can't express everything that we want it to today. It will soon though, [in the meantime you can express things with `inout` which is shared mutable]( https://docs.modular.com/mojo/programming-manual.html#argument-passing-control-and-memory-ownership)

### Values implicitly copied in `fn` that requires ownership of that type
You get an error if your value is not copyable. Keep in mind that owned can/should be used in a lot of places as a performance optimization, e.g. the arguments to a "memberwise init". For non-copyable types this is required for correctness to handle ownership correctly, and for copyable types it allows you to avoid the copies if you're careful.

Like in Rust, you should not make your type implicitly copyable if that operation is expensive. If you want to control all copies and force ownership on the users of your type, you should instead implement an explicit x.copy() method which will make everything explicit in the code.

In Mojo, that concept of unique ownership is orthogonal to copyability, which is something that a number of other languages (e.g. Swift) got conflated. 

Having implicit moves is super confusing to many programmers, and makes the error messages way more difficult to explain back when something goes wrong.

### Rust-like syntax for lifetimes
Yes, this is in the roadway coming soon, this is actually one of the next major features that will land.

### Value semantics
Mojo doesn't force, but enables the use of value semantics. This allows you to pass objects like collections and strings into a function, and it doesn't copy any data unless you mutate it. This is the best of both worlds, where the original object won't be modified if you mutate it inside a function, but it also won't copy the data leading to a performance hit if it doesn't need to. The language allows the type author to express this behaviour without forcing it into all cases.

- [2023-06-02 Lex Fridman Interview 48:28](https://youtu.be/pdJQ8iVTwj8?t=2908)

### First Class Lifetimes
I'm optimistic the Mojo lifetime solution will be a nice step forward in both usability and expressivity vs rust, and first class lifetimes are very nice for inner pointers etc.

Mojo references are currently second class exactly as [Graydon advocates](https://graydon2.dreamwidth.org/307291.html).  We're experimenting with lifetimes, but if they spiral in complexity we can always eliminate them as a concept and stay with the current design.

- [2023-06-14 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1118249300405780541)

## General

### Modular monetization 
The engine itself can stand alone and you can use the engine as a drop-in replacement for running TensorFlow and PyTorch models in production. And so TensorFlow is quite good at production, but we're showing 3-5x better performance on, for example Intel CPUs, AMD CPUs or an ARM-based Graviton server in AWS. That's a massive cost savings and it's also a massive latency improvement, so many of our customers love that because then they can turn around and make their models bigger, which is a huge deal for them.

One of the things also that our customers love is that Google and Meta don't actually support TensorFlow or PyTorch, people forget that these are not products, these are open source projects and more like hobbies for the megacorps. So what we're essentially offering is a supported and performance optimized version of TensorFlow and PyTorch, the enterprises we talked to that care about their costs often they want somebody that they can call. It's analogous to running your own mail server, very few companies do that, so why do we do it with AI infrastructure.

Currently it's because there's no choice, there's nobody to reach out to who can actually can do this. The technology platform at Meta and Google has diverged a lot from what the rest of the industry uses, they both have their own chips and specific use cases, so they're not focused on the traditional CPU, GPU and public cloud use case. Because it's a product for us we can actually support it, invest a huge amount of energy into it, and it's why we have such phenomenal results as well. 

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=2498)

### Docs Internationalization
We have no plans to translate our content at this time or in the near future. Our products and documentation are still in their infancy and there's a long way to go before curated translation becomes a priority.

- [2023-06-30 Github Scott Main](https://github.com/modularml/mojo/issues/163#issuecomment-1613642961)

### Three World Problem
Python has a dependence on C/C++ for performance and hardware-focused tasks, Mojo directly addresses the `three world problem` of Python, C/C++, and accelerator languages required for CPUs, GPUs, TPUs etc.

- [2023-06-21 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=143)

### Debugging Complicated Problems 
What happens when you need to deploy a model through Core ML or one of the many other hardware interfaces, and the results don't work. Well now you need to know not just PyTorch, not just your model, not just Core ML, but also the translator, compiler and all these other things. You keep digging and you find out it's handling the edge padding on a convolution slightly differently. All of these tools were supposed to be making it easy aren't reliable, it's a leaky abstraction where if something goes wrong you have to understand all of this complexity.

And so this is what causes it to take three months to deploy a model, leaders ask why it's taking so long but they don't realize that the tool set, this fundamental technology that all this stuff is built on top of, it's not up to high standards. No C programmer would tolerate AI tools of this quality, it's just crazy.

But again, this is just the maturity of the AI technology space, and by solving that problem we should see way more inclusion and the kinds of companies that are able to work with AI, and that'll have a big impact on the world.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=2340)

### Energy Efficiency
We have not done any analysis about energy efficiency, my guess is that Mojo would be in the top 2 or 3, since Mojo does not do anything fancy behind your back. We do need to study this however.

- [2023-06-26 GitHub Abdul](https://github.com/modularml/mojo/discussions/302?notification_referrer_id=NT_kwDOB-auX7Q2NjI5NTQwODg4OjEzMjU1ODQzMQ)

### Top level code in REPL and Jupyter 
The default right now is in a bit of a weird place, Mojo top-level code behaves differently than anything else. It is "strict" by default, however the problem right now is that top-level Mojo code is neither "static" in the `fn` sense or "dynamic" in the `def` sense. The goal is to make it behave like an imperative body of code.

- [2023-07-20 Github Jeff Niu](https://github.com/modularml/mojo/discussions/411#discussioncomment-6491987)


### Logo and brand community usage
We definitely want the community to be able to use the Mojo logo and name. We should get a proper web page up that describes this.

We're mostly getting the details sorted out. My current understanding: we want people to be free to use the word Mojo and Mojo🔥, and using the Mojo🔥 logo is fine. The things we need to protect are: 

1. Don't represent that you are speaking on behalf of modular
2. Don't use the "Modular M" with the notch taken out without permission.

It is fine to use Mojo or Mojo🔥 with a normal M.

We've also seen a lot of the troubles of other communities, and want to ensure that the Mojo🔥 community has a clear understanding of our trademark rights, and the relevant community usage from the beginning.

The spirit of what we want to achieve is essentially to have a "Community Logo" and a "Official Logo" that enables a flexible use for the community, but also provides us with an ability to have "Official Use" when needed. There will be subtle differences (i.e. the Notch in the M, the style of the Fire icon etc) but enabling our incredible community to use the logo is definitely our goal.

- [2023-06-18 GitHub Chris Lattner](https://github.com/modularml/mojo/discussions/389#discussioncomment-6206675)
- [2023-06-24 GitHub Tim Davis](https://github.com/modularml/mojo/discussions/389#discussioncomment-6264254)

### Self Hosting
It will take us quite some time to get there, but yes I would like the Mojo parser to some day be written in Mojo. I would also like to see the CPython interpreter rewritten in Mojo, but have no plans to do so. One can dream 😉

- [2023-06-14 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103006101261267004/1118233873738903704)

### OS Kernel Development
Yeah just to clarify, when modular-ites use the word `kernel` they typically mean high performance numeric kernel which may be targeted at an accelerator or GPU or CPU etc. Secondary meanings are `OS kernel` or `Jupyter kernel`, because the word is overloaded.

Mojo is a general purpose language and can be used to replace C use cases like Rust does etc, but that isn't where we're focusing initial development. That doesn't mean we're excluding it, just that the libraries etc aren't the focus for us to build. We hope the community will be interested in filling that in and building out the use cases in time though.

- [2023-06-02 Github Issue](https://github.com/modularml/mojo/discussions/302#discussioncomment-6065569)

### Paid Licenses like MATLAB
[Plz see the faq](https://docs.modular.com/mojo/faq.html#distribution)

Broadly speaking, we see Mojo as a technology, not a product. We have AI based products, and mojo is something that is very important to those products, but it also stands alone for other uses. Mojo is still young and building the right thing for the long term is the priority for us right now.

- [2023-06-02 Discord Reply](https://discord.com/channels/1087530497313357884/1103420074372644916/1113937251576057948)

### Standard Library Completeness
We provide integers, floats, buffers, tensors and other things you'd expect in an ML context, honestly we need to keep designing, redesigning, and working with the community to build that out and make it better, it's not our strength right now. But the power of putting it in the library means we can have teams of experts that aren't compiler engineers that can help us design, refine, and drive this forward.

- [2023-06-02 Lex Fridman Interview 42:02](https://youtu.be/pdJQ8iVTwj8?t=2522)

### JSON Parser
JSON is super important, but right now we are tracking more basic things, e.g. getting core data structures in place. Higher level libraries like this should likely be part of the broader package ecosystem, and we need packages before we plan that 😃.

- [2023-07-29 Github Chris Lattner](https://github.com/modularml/mojo/issues/478#issuecomment-1654623649)

### Rewriting Libraries 
In the case of modular and why we built Mojo, our business objective is go make ML really awesome, we care about the matrix multiplications and the convolutions and the core operations that people spend all their time on in AI. And so we rewrote all of that stuff in Mojo, this isn't like rewriting Matplotlib, this is like rewriting Intel MKL, or the CUDA implementation of these CUDA kernels equivalent. That's where we've put our energy into
because that's what enables unlocking of the hardware, performance, and usability.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=3061)

### Standard Library Philosophy (batteries included etc.)
Short answer: there isn't one, yet. You are right that we should develop one, however.

- [2023-05-31 Github Discussion](https://github.com/modularml/mojo/discussions/92#discussioncomment-6042101)

### Investing in Modular
There is currently no way to publicly invest in Modular I'm sorry.

### File extension 🔥
Some of us are crazy, but also "crazy enough" to believe that the world can handle unicode a this point. Filename.mojo is really important and will always also work, but for those progressive enough to accept the new things, we offer a delightful alternative that looks great in your IDE and even on the command line with tab completion. 🔥

### AI term clarification
Mojo is a general purpose programming language in the Python family, so nothing about it (as a language) needs to be "AI". We are prioritizing its development to solve specific AI use-cases around extensibility, programmability, and hackability.

AI systems are currently split between Python/C++/CUDA which we'd like to solve. That said, as you point out, Mojo is completely general and is more of a "programming language to help the world cope with the end of moore's law"; it is just that AI use cases are the ones struggling the most with this right now.

### Mojo Financial
Thank you for the kind words! As explained in the launch video, we see mojo as a technology, not a product. We are a company and need to make money, but will do so based on products. We aren't sharing all the details on that right now, but you can follow our web page and newsletters etc for updates.

In terms of "betting on Mojo" right now, we are more focused on building Mojo to be the "right thing" rather that getting "hypergrowth" (something i've learned the hard way comes with down sides), but we'll open things up progressively over time as it matures. We would like to see Mojo go far and wide and are keenly aware of the need for OSS for adoption.

### What do we call Mojo users?
I'm fond of mojician 🪄

- [2023-05-29 Github Issue](https://github.com/modularml/mojo/discussions/276#discussioncomment-6023971)

### Current State
Mojo is very useful but only if you're a super low level programmer right now, and we're working our way up the stack. Mojo is currently like a `0.1`, and in a year from now it will be way more useful to a wider variety of people, but we decided to launch it early so we can build it with the community. We have a [roadmap that's transparent about the current state](https://docs.modular.com/mojo/roadmap.html) we're optimizing for building the right thing the right way. There is a dynamic where everyone wants it yesterday, but I still think it's the right thing.

- [2023-06-02 Lex Fridman Interview 42:42](https://youtu.be/pdJQ8iVTwj8?t=2562)

### Solving Complexity
A tensor is like an abstraction around a gigantic parralelizable data set, using frameworks like PyTorch and Tensorflow you can also represent the operations over those data sets, which you can then map onto parralelizable cores or machines. This has an enabled an explosion in AI and accelerators, but also an explosion in complexity.

Researchers are smart in various domains like calculus but they don't want to know anything about the hardware or C++, so they train the model and then you have teams who are specialized in deploying the model which might have to split out onto various machines so the complexity explodes, making changes takes weeks or months because all these teams with different expertise need to coordinate which is always a huge problem.

Why is it so difficult that it takes a team of 45 people to deploy a model when it's so easy to train? If you dig into this, every layer is problematic. PyTorch and Tensorflow weren't really designed for this complicated world we have today, they were designed for when models could be trained and fit onto a single GPU. Tensorflow can scale to many machines, but most researchers are using PyTorch which doesn't have those capabilities.

The main thing that Modular is fighting against is all this complexity:
- Hardware accelerators and software stacks to interact with the hardware 
- Modeling constantly changing with new research and huge amounts of diversity
- Serving technology like zero copy networking, asyncio etc. that hasn't made it into machine learning

These things have been built up over many years in their own silos and there hasn't been a first principles rethink, Modular has an amazing team to create a unified platform that solves this issue because we've worked on a lot of these silos including Tensorflow, TPUs, PyTorch Core, ONNXRuntime, Apple accelerators etc.

Our joking mission statement is to "Save the world from terrible AI software", so we need a syntax, and we wouldn't have to build the programming language if it already existed, if Python was already good enough we would have just used it, we're not doing very large scale expensive engineering projects for the sake of it, it's to solve a problem.

In the early days of PyTorch and Tensorflow things were basically CPU and CUDA, so for a dense layer with matrix multiplication you could kick off a CUDA kernel on GPU, or use something like Intel MKL for CPU. Now you have an explosion of hardware on one end with thousands of different types of hardware, and explosion of development in AI models on the other end with thousands of different operators. From giant TPU stacks to CPU's on mobile devices, whenever someone releases new hardware they need teams of people rewriting the compiler and kernel technology, which keeps out the little competitors. There is only a handful of people compiler experts out there which excludes a tonne of people. Mojo and the Modular stack brings programmability back into this world, allowing more general programmers to extend the stack without having to go hack the compiler itself. This opens it up to researchers and hardware innovators and people who know things that compiler people don't know.

- [2023-06-02 Lex Fridman Interview 58:04](https://youtu.be/pdJQ8iVTwj8?t=3484)
- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=1861)

### Hardware Complexity
Hardware is getting very complicated, part of my thesis is that it's going to get a lot more complicated, part of what's exciting about what we're building is the universal platform to support the world as we get more exotic hardware, and they don't have to rewrite their code every time a new device comes out.

- [2023-06-02 Lex Fridman Interview 2:16:57](https://youtu.be/pdJQ8iVTwj8?t=8217)


### First Principles
There have been a number of languages that have attempted to speed up Python, with Mojo we're trying to understand what the limit of the hardware and physics is, and how to express that in software. Typically that ends up being a memory problem, you can do a lot of math inside these accelerators, but you get bottlenecked sending data back and forth to memory as the training size gets large. Typically engineers that are really familiar with the hardware and specific models would optimize for a single use case, but these models are getting so large that details can't fit in one humans head, so we need to generalize. What the Modular stack allows is someone to use it for a new problem and it'll generally work quite well.

We're not working forwards from making Python a little bit better, we're working backwards from the limits of physics.

- [2023-06-02 Lex Fridman Interview 1:26:50](https://youtu.be/pdJQ8iVTwj8?t=5210)

### Python creator [Guido van Rossums's](https://en.wikipedia.org/wiki/Guido_van_Rossum) thoughts
We talked before Mojo launched, he found it very interesting. I have a tonne of respect for Guido in how he steered such a gigantic community towards what it is today. It was really important to get his eyes and feedback on Mojo, what he's most concerned about is how to avoid fragmenting the community. It's really important we're a good member of the community, we think Guido is interested in the path out of the reasons why Python is slow. Python can suddenly go all the places it's never been able to go before, so it can have even more impact on the world.

- [2023-06-02 Lex Fridman Interview 1:50:11](https://youtu.be/pdJQ8iVTwj8?t=6611)

### Unifying Theory
If you look at companies like OpenAI building huge ML models, they're innovating in the data collection and model architecture side, but they're spending a lot of time writing CUDA kernels. How much faster could all that progress go if they weren't hand writing all those CUDA kernels. There are projects trying to solve subsets of this problem but it's fragmenting the space, Mojo provides a `Unifying Theory` to stop this problem slowing people down.

- [2023-06-02 Lex Fridman Interview 1:59:31](https://youtu.be/pdJQ8iVTwj8?t=7171)

### Adoption
If the software is useful The thing that will most help adoption is you don't have to rewrite all your Python code, you can learn a new trick, and grow your knowledge that way. You can start with the world you know, and progressively learn and adopt new things where it makes sense.

- [2023-06-02 Lex Fridman Interview 2:14:58](https://youtu.be/pdJQ8iVTwj8?t=7834)

### Renaming Mojo to Python++
Just to set expectations here, we don't plan to rename Mojo - we quite like the name 😀. I agree with you that Python++ is a useful working model to think about some of Mojo's goals though!

- [2023-07-18 Github Chris Lattner](https://github.com/modularml/mojo/discussions/389#discussioncomment-6474134)

## Open Source
- [From the FAQ](https://docs.modular.com/mojo/faq.html#will-mojo-be-open-sourced)

### Running Locally
A lot of the feedback we've received is that people want to run it locally, so we're working on that right now, we just want to make sure we do it right. Should be in the next `O(few months)` as of 2023-06-06.

- [2023-06-02 Lex Fridman Interview 2:21:56](https://youtu.be/pdJQ8iVTwj8?t=8516)
- [2023-06-06 Github Chris Lattner](https://github.com/modularml/mojo/discussions/327#discussioncomment-6095594)


### Releasing Source Code
When we launched Swift, we had worked on it for four years in secrecy, we launched at a big event saying developers would be able to deploy code using Swift to the app store in 3 months. We had way more bugs than we expected, it wasn't actually production quality, and it was extremely stressful and embarrassing. Pushing major versions became super painful and stressful for the engineering team, and the community was very grumpy about it, there was a lot of technical debt in the compiler. I don't want to do that again, we're setting expectations saying don't use this for production yet, we'll get there but lets do it in the right way. We want to build the worlds best thing, if we do it right and it lifts the industry it doesn't matter if it takes an extra two months. Doing it right and not being overwhelmed with technical debt is absolutely the right thing to do.

[2023-06-02 Lex Fridman Interview 2:22:04](https://youtu.be/pdJQ8iVTwj8?t=8524)

### Community
On community, this dovetails with our open source plan.  We're getting a bit crushed under lots of different kinds of interest right now, but I'd love to open up more code, enable pull requests etc, that's mostly blocked on logistical work and that we're being crushed in various ways. We have a Mojo developer advocate role open that will help us sort that out.

### Community Stress
We're tapping into some deep long held pressures in the Python, AI and hardware worlds so people want us to move faster! We decided to release early because in my experience you get something way better when you build in the open and work with the community.

- [2023-06-02 Lex Fridman Interview 43:57](https://youtu.be/pdJQ8iVTwj8?t=2637)

### Date to open source
I would tell you if I knew 🙂. Our priority is to build the "right thing" not build a demo and get stuck with the wrong thing. My wild guess is that the language will be very usable for a lot of things in 18 months, but don't hold me to that.

It WILL be open-sourced, because Modular on its own isn't big enough to build the whole ecosystem
Unlike Apple and Swift.

- [2023-05-05 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713601386233997/1103858767331872850)
- [2023-05-09 Discord ](https://discord.com/channels/1087530497313357884/1098713601386233997/1105168399258107925)

### Opening the MLIR design docs
Our hands are pretty full at this point, and I don't think the general ML community would care much. That's something more that we'd talk at an LLVM event about or something. BTW, there is one next week.

### Could you write your own frontend to Mojo
Hey, great question! We aren't ready to talk more about the implementation details of the language yet, but the open-source dialects available in Mojo are the LLVM dialect and index dialect. The latter was upstreamed by Modular to MLIR

Yep, Mojo has a bunch of dialects internally, but they aren't intended for use by other languages. While it could be done theoretically, it isn't a goal, and we wouldn't want to slow down Mojo development by taking on new dependencies.

### Becoming a `Mojo Champion` mod on Discord
We reached out to individuals we identified ourselves this time. In the future as the server scales, if we look to add more, we will probably send out an application form that folks can fill out and we'll review on a rolling basis. 

[2023-06-09 Discord Andrew](https://discord.com/channels/1087530497313357884/1116515673611448352/1116528356603736084)

### Linear algebra in standard library
We need to figure it out, but I'd prefer to keep the stdlib pretty conventional and focused on "normal" library types like integers, strings, dictionaries, pushing things like tensors and matmul out to a linear algebra package (e.g. see Numpy not being built in).  That said, I do think something like that could/should be included in the normal distro.

The Modular Engine will be different, and I expect/hope it to always be the best state of the art implementation of this stuff, but it can do so without trying to hold back other efforts!

- [2023-08-08 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1138051611936178228/1138176785087987773)

### Standard Library `Tensor`
The `Tensor` type is new but is also very much a work in progress. We added it because a lot of example notebooks are using very low level programming (effectively malloc+free) and need a simple owned buffer type. The initial idea is that "array like" names would work with arbitrary element types (e.g. you can put a 🐴 or 🐶 object in an array) but that we wanted a more "numerics sounding" collection that would be parameterized on DType.

Mojo is still missing a bunch of type systems features (e.g. traits etc) that will massively impact the shape and structure of the standard library, and as those come in, we'll want to significantly rethink previous decisions.  Despite that, we don't want to completely hold back progress on things until all those features are available - we decided it is better to prototype some things, get experience, and be willing to reinvent / replace things over time.

- [2023-08-08 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1138051611936178228/1138156214983860264)

### Why not build Mojo on top of Swift?
I'm also a fan of Swift. The major issue with it is that it isn't a member of the Python family. I'm confused why you think that Mojo isn't inspired by Swift, because Mojo certainly is. That said, you're right that building a new thing takes longer than leveraging an existing thing. The reason we're taking this approach is that we're optimizing for quality of result (we want to build the world's best thing) not time to market. I would consider it success if you come to love Mojo more than Swift some day 😄
- [2023-08-07 Github Chris Lattner](https://github.com/modularml/mojo/discussions/485#discussioncomment-6647832)

## Hardware and accelerators
### GPUs
We'll be sharing GPU numbers soon, I am pretty sure it will blow you away, but today is just our initial launch day. ML isn't one thing, and we are pretty excited about the full expanse of heterogenous compute.

GPUs are super important but ML is not just matmuls, it's also about preprocessing, data loading, networking, and many other things. We've decided to solve the general problem first, because we know we can specialize that. Many existing systems have started from specialized solutions and failed to generalize.

GPU numbers are not far away, and benefit directly from everything we've shown so far. You'll need to use your imagination or extrapolate or imagine until we publish our next step, but we're not messing around here. Our goal is to announce things that are solid and production quality, not claim demo or research-quality results. The ML industry has had enough of that for one or two generations.

- [2023-05-03 Discord Chris lattner](https://discord.com/channels/1087530497313357884/1103154673814351924/1103182306052669462)

### Pytorch on Different hardware
We outperform PyTorch across a large range of hardware (Intel, AMD, ARM etc) [see performance dashboard](https://www.modular.com/engine#performance) and swap around the Instance Types.

### Quantization
We support quantization and it will support many other HW types like edge deployments

### Supporting Hardware Accelerators
We can only say that we're working on accelerators and that is core to the mission, but can't talk about that until we're ready. This is a very complicated question, software is one of the hardest parts of AI hardware, and is one of the big problems Modular is solving. We'll be sharing more about it soon, but you can read more [on our web page here](https://www.modular.com/hardware), also check out some more [technical content here](https://docs.modular.com/mojo/programming-manual.html#parameterization-compile-time-metaprogramming)

- [2023-05-03 Discord Tim Davis](https://discord.com/channels/1087530497313357884/1103109867830525962/1103113756243918898)
- [2023-05-05 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1098713575259910224/1103854837738770495)
- [2023-06-09 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103050029620535327/1103051748899311646)

### MLIR to unlock exotic hardware
AI isn't just about a GPU, even though so much thinking around AI technology is focused on that, the Modular team spent years working Google TPUs, they're highly specialized for AI workloads and scale to exaflops of compute, they're also internally really weird.

Mojo is built on top of MLIR which We built back at Google, now it's being used by basically the who's who of all the hardware industry. LLVM talks to CPUs and some GPUs, but it's never been successful at targeting AI accelerators and video optimization engines, and all the other weird hardware that exists in the world. That's the role that MLIR provides, Mojo fully exposes MLIR and all the nerdery that goes into compiler technology, and gives it to library developers.

It's important that you can talk to TPUs or other exotic hardware in their native language, which in the case of a TPU is a 128x128 tile, being able to expose that out in the language is really quite important. It's more than just CPUs and GPUs, we've built it to have really long legs so it can bring us into the future.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=1231)

### Interaction with MLIR
Modular uses many of its own dialects internally, but the only mainline MLIR dialects we use are LLVM and Index. Nothing else was suitable, not even SCF which has tons of ties into arithmetic etc. so we built an entirely new stack.

We use LLVM level dialects, and leverage LLVM for the targets it supports. We already use this to talk directly to both the Apple and Intel AMX instructions for example (identically named but different things) which provide block matrix operations.

For other accelerators, it depends on whether you have a traditional program counter and programmability or not.

- [2023-05-03 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103002276190224464/1103003562407108623)
- [2023-05-03 Discord Chris Lattner](https://discord.com/channels/1087530497313357884/1103058370405072941/1103068324490916001)
- [Public MLIR example](https://docs.modular.com/mojo/notebooks/BoolMLIR.html)
- [High Level Hardware Outline](https://www.modular.com/hardware)

### MLIR Syntax
MLIR integration hasn't been polished or designed to be pretty - we've focused primarily on making it fully capable and unblocking our needs. The idea for it is that only MLIR experts would be using this, but then they'd be wrapping user-facing Pythonic types and methods around them, like `OurBool` wraps `i1`. that said, we can definitely improve this in various ways, we just can't do so at the loss of fidelity and expressiveness.

- [2023-05-15 Github Chris Lattner](https://github.com/modularml/mojo/discussions/154#discussioncomment-5904861)

### Creating new MLIR dialects
This is also something we're likely to look into in the far future, but isn't a priority right now. Also, as mojo opens up more, it would be great for community members to poke at this.

- [2023-05-15 Github Chris Lattner](https://github.com/modularml/mojo/discussions/154#discussioncomment-5904870)


### Optimization via MLIR
Mojo is a gateway to the whole MLIR ecosystem. It is entirely plausible that the matmul implementation for a particular piece of hardware just calls a few MLIR operations.

### Macos and Ios
It would be very interesting to explore Mojo -> Swift and Mojo -> iOS interop but we have no plans for that in the immediate future, something to explore over time maybe.

iOS/Mac/etc as an AI platform is very interesting to us though.

I took a peak at the metal MLIR dialect. The ops lower to external library calls, which means one could access the metal API entirely through dlopen + function calls. No MLIR needed, strictly speaking. 

We do a lot of development on macs (and also linux, windows)

### ARM
Graviton is ARM architecture, check out performance.modular.com or our recent blog post about matrix multiplication

### Using CPU and GPU simultaneously
For that you need the Modular ai framework: you need graph level xforms and heterogenous compute for that. Mojo is one component of that stack that helps author the kernels and make them more portable, but the modular engine provides the "OS" for your heterogenous computer.

### IOT
yes, definitely, we want Mojo to go everywhere, and deploying to small devices is part of our design. One step at a time though 😀

### Other cloud providers and Mojo
SambaNova's chip is, from my understanding, what's called a Coarse-grain reconfigurable architecture (CGRA), which is a super parallel and has almost nothing to do with CPUs.
Graphcores are apparently lots of things that look like CPUs, but their memories are weird and different, and the way they communicate is very structured. What our technology stack enables companies like SambaNova is a way to implement a compiler for their chip. They're the experts on their chip, they understand how it works, Modular can provide something to plug into so that they get all the benefits of TensorFlow and PyTorch.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=1475)


### Hardware Vendors
One of the challenges with hardware accelerators is that the tools provided by non-dominant players often prove difficult to use, especially with regard to compatibility. For instance, Apple's Core ML which interacts with neural accelerators, isn't compatible with all models. This often results in complications when attempting to integrate models onto Apple devices.

These issues are recognized by numerous leaders at software companies integrating AI into their products, they see firsthand the long deployment times and the need for large, specialized, and expensive teams. This is largely due to the discrepancy between the tools used for hardware deployment and those used for AI model training. Companies have to build an entire technology stack from the bottom up, there's very little code reuse across hardware. And it's very difficult to track the speed of AI, PyTorch moves fast and you need a very dedicated and responsive team.

The compiler and technology problems to make the hardware work are really difficult, and so there are a lot of really smart people working on this, but if you're always focused on getting the next ship out the door, you can't take a step back and look at this whole technology stack. That's the leap that modular is driving forward.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=1540)

###  CUDA
The AI industry owes a huge debt of gratitude to CUDA, if you go back to the AlexNet moment it was a confluence of ImageNet, datasets and the fact that GPUs enabled an amount of compute. People forget that CUDA enabled researchers to get a machine learning model running on a GPU, which the hardware was definitely not designed for back in the day. Now AI has taken over and it's different, but the initial breakthrough was really in a large part thanks to CUDA. A lot of technology has been built on top of CUDA and it's very powerful, flexible, and hackable and that's great,
but it's put us into a mode where one vendor has this dominant position and it's very difficult if you're a hardware vendor to be able to play in this ecosystem.

There's the XLA compiler that Modular staff worked on at Google, and there are new compilers every day being announced by different companies where they're making make ML go fast, for example on GPUs.
The problem with that is that they've lost one of the things that made CUDA really powerful, which is the programmability.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=1674)



## Modular Inference Engine
[Official FAQ](https://docs.modular.com/engine/faq.html#do-we-really-need-yet-another-inference-engine)

### General
Modular's building what we called a unified AI engine, people are familiar with PyTorch and TensorFlow and these machine learning frameworks that provide APIs, underneath the covers there's a lot of technology for getting things onto a CPU and GPU through things like CUDA. And so our engine fits at that level of the stack, the cool thing about it particularly when you're deploying, is that it talks to a lot of different hardware.

It also talks to both TensorFlow and PyTorch, so when you're taking a model from research like a nice PyTorch model off Hugging Face, and you want to deploy this thing. We don't actually want all of PyTorch in a production Docker container, you want a low dependency efficient way to serve the model. The process of going from PyTorch and into deployment is what the modular technology stack can help with.

- [2023-06-20 YouTube Chris Lattner](https://youtu.be/-8TbsCUuwQQ?t=1391)

### Frameworks
It’s a unified engine that enables multi-framework support, many users aren’t just using PyTorch (TensorFlow, JAX etc)

It integrates natively with Mojo 🔥 for a completely new high performance programming model that enables many things outside of just pure model execution performance.

### Runtime
Our runtime is designed to be modular. It scales down very well, supports heterogenous configs, and scales up to distributed settings in a pretty cool way, we're excited to share more about this over time.


## Mojo Chatbot
Ask a question to get back a quick response based on the answers above, using ChatGPT 3.5

<iframe
src="https://mojodojo.streamlit.app/?embed=true"
  height="450"
  style="width:100%;border:none;"
>
</iframe>

<CommentService />

