# Mojo Team Answers
Collected from [Discord](https://discord.com/invite/modular), [Hackernews](https://news.ycombinator.com) and [Github](https://github.com/modularml/mojo/issues)

## Language Features
### General
There are many theoretical features we could add to Python to make it better in various ways, but we're resisting the urge. We want Mojo to be a good member of the Python community, and the systems programming features and compatibility features need a lot continued development.

Syntactic sugar is fun and can be exciting, but it is also dangerous, and I'd personally prefer we avoid it completely unless it is extremely highly motivated by the core use case (accelerators, systems programming etc) that Python doesn't already service.

Yes, as the core mojo language evolves, we expect more pure-mojo code to be used in practice, and less compatibility-cpython code. This will happen progressively over time, one analogy of this can be seen in the Swift community: in that case, Swift was adopted first by apps and "rewrites of core infra" happened asynchronously where there was value to doing so.

As we explain in the launch video, our immediate focus is on accelerators and ML kernels etc, we'll scale up to C++ use cases, and then to the full python enchilada, this will take time, but certainly not 10 years 😉

### Parametric algorithms
Yes, Mojo provides guaranteed specialization of parametric algorithms like Julia/Rust/C++.

### Overloading Return Type
Mojo doesn’t support overloading solely on result type, and doesn’t use result type or contextual type information for type inference, keeping things simple, fast, and predictable. Mojo will never produce an “expression too complex” error, because its type-checker is simple and fast by definition.

### Creating new operators
We can definitely add that in time, but in the immediate future we're focused on /not/ adding gratuitous syntactic sugar. We're focused on building out the core model and getting the fundamentals right.

E.g. even changing def __add__( to def +( would be trivial to do, but sends us down the route of building syntax sugar, which is hugely distracting. It's better to stay focused.

### Algebraic data types
I'm a fan of optional and other algebraic data types, you don't need to convince me. It's in our roadmap doc! :-) OTOH, Swift has way too much special purpose sugar which I'd prefer to reduce this time around, there are ways to have the best of both worlds - ergonomic and extensible.

### Mutability (let and var)
let and var are just about safety/scoping etc. They are also helpful when using advanced types and move semantics, but even then not required. [More info here](https://docs.modular.com/mojo/programming-manual.html#let-and-var-declarations)

### Cyclic Imports
Yes, Python packages perform cyclic imports and we had to support that. We will share information about our compilation model soon

### Enums
We like Swift enums so Mojo enums will probably become more feature complete over time. Enums are a different thing entirely to types, but they're basically just aliases for compile-time values.

### Pointers
Mojo has an unsafe `Pointer` struct vended by the standard library for folks who know what the they are doing.

### Unsafe code
Mojo is (should be) safe by default, and if you want to go low-level or hacky, Mojo provides powerful tools for that as well.

I think that Swift got it basically right in this case.  I don't think that a rust-style 'unsafe' block is (in aggregate) a win.  Rust (in my opinion) ended up building a lots of distrust and negative feeling around 'unsafe', even though effectively all safe apis (e.g. Array) are built on top of unsafe apis (e.g. UnsafePointer)
Swift's approach was to make it clear in the API when something was unsafe (e.g. name the thing UnsafePointer, not Pointer) which I think is important, but don't define an effect that needs to get propagated around and managed by the user.

I'm also not entirely familiar with the Rust decisions around unsafe + borrow checker.  We are making pretty different tradeoffs in the borrow checker, and it is possible they expose a lot more UB than we will.  We'll see though, need to build things out more.

The unsafe block /changes the semantics of code that is also valid in a safe block/ which we will not be doing.

Rust has more UB than C in unsafe because it always assume pointers do not alias. [Here's an example of a talk on it](https://youtu.be/DG-VLezRkYQ)

### Error handling
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

We're not impressed with how the swift `marked propagation` stuff worked out. The `try` thing (besides being the wrong keyword) was super verbose for things that required lots of failable calls, e.g. encoders and decoders and it isn't clear that the ambiguity we were afraid of was actually a thing.  We'll certainly explore that in the future, but for now we should try to just keep things simple and bring up the stack end to end imo.

### Error Messages
We do really like Rust's error messages, even the way that they're output with super slick ASCII art arrows, we want Mojo to have clear error messages and Rust's are definitely great in this respect, but we may not have the same super slick ASCII art.

### Sockets
We haven't invested in building anything here, but you can use all the existing Python libraries in the meantime. We also expect (as a community) to build out a bunch of mojo native libraries over time

### Complex types
We have experienced slow and overly complex type systems and too much sugar as you're pointing out. We've learned a lot from it, and the conclusion is "don't do it again". [You can see a specific comment about this at the end of this section](https://docs.modular.com/mojo/notebooks/HelloMojo.html#overloaded-functions-methods)

It's also interesting that Rust et al made similar (but also different) mistakes and have compile time issues scaling. Mojo has a ton of core compiler improvements as well addressing the "LLVM is slow" sorts of issues that "zero abstraction" languages have when expecting LLVM to do all the work for them.

### Ray Tracer
Question: If you can expose tensor core instructions, why not expose ray tracing instructions when you support GPUs? Then this would solve major fragmentation problems in HPC.

Chris Lattner: I'd looooove that ❤️‍🔥

### Automatic Differentiation
We don't have any current language features to enable this in the works, but I'm very familiar with the work on tape based and SCT (Source Code Transformation) approaches for AD (automatic differentiation), I believe our metaprogramming features will be useful to explore that when we get to wanting to build it. Tape based approaches will "just work" of course, because they don't need language support.

We also talk to all the existing python apis, including things like nn.module that use this, so those also "just work". I'm not sure if that's the question though

There's a whole body of work called "differentiable programming" that I'm a nerd about 😀, but we don't have immediate plans to work on this. I'm sure we'll intersect with that work in the future.

I can't prove this today, but my intuition is that we will be able to automatically produce backward versions of kernels from the forward version. [This has already been done by a number of other projects in other systems](https://enzyme.mit.edu/) and we have strictly more information than those systems do.

### Metaprogramming and comptime
One of the cool things that Mojo provides is an extremely powerful parametric metaprogramming system (see the language design doc for a brief intro) which allows extending the compiler itself in mojo, so you can invent your own combinators. This is very important, because different accelerators have different cool features and we are not looking for a watered down programming model.

This isn't fully documented yet, and there are a few missing pieces we want to wrap up before doing so, but this provides a pretty different programming model than existing systems.

One way to say this is that Mojo is taking a lot of the power out of the compiler and putting it into libraries, allowing Mojo developers to radically extend the language. Python already has this but does so with super dynamic reflective metaprogramming, so this is an old idea done in a new way

### Compile Time Function Results
Yes, you can do this in two ways: first any normal function may be used at compile time.  No need to duplicate all math that works on ints between comptime and not, and no need to explicitly label everything as being constexpr capable

Second, runtime functions are also able to have “parameter results” [documented in the manual here](https://docs.modular.com/mojo/programming-manual.html#autotuning-adaptive-compilation), but it is mainly useful when returning parameterized capabilities from run time functions that are selected through auto tuning. This is an exotic power user feature, not the sort of thing I’d expect most mojo programmers to want to care about

### Dynamic and Static typing
(question was on a scale of Python to Rust)

It's a false dichotomy in my opinion based on how those systems work. Mojo already supports great integration with Python and has a more powerful ownership system than Rust [but lifetimes are not finished yet, so that isn't comparable yet](https://docs.modular.com/mojo/programming-manual.html#argument-passing-control-and-memory-ownership)

Much of the root of the dichotomy comes from fairly opinionated perspectives on "manual control over everything is the 'right' and therefore 'only' way to do things", which forces you into super rigorous programming mode. Our view is a bit more pragmatic: dynamic is good, static is good, use the right tool for the job.

### Concurrency, Async, Parallelism
We support for async/await syntax in python and have a high performance runtime that enables parallelism. The Matmul notebook online shows some simple examples

We haven't described the runtime side of this, but Mojo is built on a high performance heterogenous runtime with very lightweight tasks and full asynchrony at its core. The Modular engine is all about high performance heterogenous accelerated compute after all.

We haven't built out all the concurrency features in Mojo yet, but do have the basics re: async/await etc that Python has.

We'll need to build this out over time, if you're not familiar with it, you might find the Swift actor and structured concurrency systems to be interesting. It is a production language today that has solved a bunch of these problems already, and while there are a few mistakes made, it has lots of good ideas that are not widely known.

[You can read about the swift prior art here](https://gist.github.com/lattner/31ed37682ef1576b16bca1432ea9f782)

We have a super strong story here, check out the launch demo and matmul notebook, Jeremy shows a simple example there. We also fully support async/await like Python etc.

### Ternary operator
Python has a conditional (often called ternary) operator, so Mojo, as a superset of Python, will have the same functionality with the same syntax: x if y else z (similar to y ? x : z in other languages) 

### Nim uniform function call
We'll have to evaluate it when we get there (probably 2-3 months) but an alternative to the nim approach is to supported "extensions" [along the lines of what Swift did](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions)

They solve the same problem without making "two ways to do things" and dovetails better into generics.

## Standard Python

### Compatibility
All Mojo code is compiled by the mojo compiler, including code that happens to be syntactically identical (by design) to Python. The CPython implementation comes in when you import a CPython module into an object. That is exactly a CPython object with exactly the same runtime representation, and uses the CPython interpreter to implement support for it.

(using the PyCall and PyAddRef etc apis under the hood)

[Plz check out this for an example](https://docs.modular.com/mojo/notebooks/Mandelbrot.html)

Just like when the c or c++ committee adds a new feature to their languages, Clang fast follows. Same model.

Also, we don't see Mojo as different than Python. Mojo is a member of the Python family just like PyPy, IronPython and many others are members of the family.

we're very happy to be able to now work directly with the smart folk who have built Python 3 into such a beautiful thing.

### Moving vanilla Python to Mojo
My expectation is maybe something like 5-10x faster, but not 5000x faster. It's still very early and we haven't put any effort into optimizing untyped code, but we're already seeing mojo run untyped code 8x-ish faster than cpython. Just because we have a compiler instead of an interpreter.  We're not doing anything fancy.

### Global Interpreter Lock (GIL)
Like most other languages, Mojo just doesn't have a GIL. 🙂
Mojo is a completely new language, and is built with all new compiler and runtime technologies underneath it. It isn't beholden to existing design decisions in Python, but we've learned a lot from Python and want to be a good member of the Python community

Yes, code run with CPython runs the same way that CPython does (for both better and worse) you have to move it to Mojo to get the performance and deployability advantages that Mojo brings. It is still amazingly useful!

### Compatibility
We will implement all of that weird Python stuff
But it will not be the default implementation for Mojo classes and types. There will be different levels of dynamism
On one hand we will have the full Python descriptor hashtable dynamism like you described and on the other hand we will have regular virtual classes with vtables

### Existing Libraries
Yep, they already just work, Check the website or the demo in the launch video from Jeremy Howard. [Also potentially interesting](https://docs.modular.com/mojo/programming-manual.html#python-integration)

### Classes
You can import python packages and use their classes, you just can't define your own in Mojo yet.

## Tooling
### CLI
There is a CLI to do all the stuff you'd expect, but we're not ready to release that yet.

### Formatter
We have a fork of Black that supports Mojo that we use in-house. I imagine that in due time we'll be releasing this or something like it, or contributing support to upstream Black if they want to add Mojo support.

### VSCode and LSPs
Yep, we fully support this. Our VSCode experience is pretty great and many of us live on it, we just haven't been able to expose it on day 1. Stay tuned.

We care a huge amount about tooling, and will definitely be investing a lot here, the team member that built the Mojo LSP also built the MLIR LSP.

## Implementation Details
### C++ and Mojo use at Modular
There isn’t a simple answer here, it depends a lot on details.  For example, the kernel library is all written in Mojo, because C++ is not expressive enough to do what we need. No auto tuning, capable but ungainly meta programming system, doesn’t talk to mlir.

For other parts of our stack, we need some missing features, the most important in the short term are lifetimes and traits/protocols. When those come in, we will be a lot more unblocked and can evaluate what makes sense to move over.

Rewrites can be beneficial beyond the technical capabilities of the system btw.  It is a good step to take what you’ve learned in v1 and reconsider in v2.  Many tales of “we rewrote our system in X and got big benefits” are due to the new thing being architected better than the old thing.

But to your meta point, yes, I fully expect Mojo to be >> C++ for our usecases across the stack.  It will take a bit of time, but I would really like to stop writing c++ some day 🙂

## Language comparisons
[Why we chose to write a new language](https://docs.modular.com/mojo/why-mojo.html)
### Julia
There are a bunch of questions about Julia, so I'll do my best to give a short answer to a very long and complicated topic. Up front, Julia is a wonderful language and a wonderful community, I am a super fan.
That said, Mojo is a completely different thing. It is aligned with the Python community to solve [specific problems outlined here](https://docs.modular.com/mojo/why-mojo.html)

Mojo also has a bunch of technical advancements compared to Julia by virtue of it being a much newer development and being able to learn from it (and Swift and Rust, and C++ and many many other languages). Including things like ownership and no GC. We also think there is room for a new language that is easier to deploy, scales down to small envelopes, works directly with the full Python ecosystem, is designed for ML and for MLIR from first principles, etc.

Julia is far more mature and advanced in many ways. Many folks have and will continue to push Julia forward and we wish them the best, it is a lovely ecosystem and language. There is room for more than one thing! :)

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

### CPython Compilers
Correct, we put no effort into trying to make CPython go faster - other folks are doing that, and we compose on top of it. If you want the benefits of mojo you move your code into the mojo world. We're prioritizing "simple and predictable" programming models


### General
Part of this decision to write a new language stems from the Swift4TensorFlow experience, which had a few lessons informing the decision to launch a new language rather than building on top of an existing one (which is what Swift4TF attempted to do)

1. You have to get the fundamentals right. Trying to build on top of something that wasn't designed at its core to do what you need it to do is going to lead to substandard solutions.
2. The ML community really loves Python. Mojo is trying very hard to preserve most (but not all) of the Python programming model, with modern takes and advancements on the core ideas of the language -- Python has a ton of great ideas from a PL perspective, but suffers from being decades old

As for "why not fork an existing thing?", well like it's written in our rationale doc, we didn't set out to build a new programming language. We also have to move fast, and taking on existing systems has a cost versus building something ourselves that has to be evaluated

## Syntax 
### self keyword
Dropping the `self` keyword would diverge from Python a lot. it would also break orthogonality in the language. Swift suffers from a ton of extra keywords by not making self be explicit. It is better to just keep things consistent and explicit (also precedent in rust etc)

### `self&` for borrowed
[We're likely to change the reference syntax to inout](https://github.com/modularml/mojo/issues/7)

the rationale is to get it away from the prefix * and ** sigils used for variadics. I agree with you though that it takes some getting used to. An alternate approach would be to dump the & sigil and switch to a keyword like inout. That would be more expressive and align better with borrowed and owned.

### Owned and consumed
They're the same thing. Consume is the word we're currently using for the operator, owned is the argument convention. We may need to iterate on terminology a bit more.

### ^ consume postfix operator
Because it composes properly with chained expressions: `x.foo().bar().baz^.do_thing()` vs something like `(move x.foo().bar().baz).do_thing()`

### Int
Int is like intptr_t which is 64-bit on a 64-bit machine, 32-bit on a 32-bit machine

### si32/ui32 vs i32/u32
Less ambiguity, but this isn't a closely held belief, we can change it if there is a reason to. WDYT @Abdul ?


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
### Producing binaries
Mojo is built directly on top of existing compiler technologies like LLVM, which means you can produce object files, libraries, and executables (via the CLI). The Mojo Playground environment is different, however, since it uses our JIT.

Good deployability is a core part of Mojo's language design e.g. [our matmul implementation is ~100kb](https://www.modular.com/blog/the-worlds-fastest-unified-matrix-multiplication)

### Binary Size
For Mojo, it depends on what you do - doing simple math is a couple kilobytes for final binary, doing something "heavy" like printing hello world pushes into 240K or so. We can definitely do better in hello world though, a bunch of stuff isn't getting stripped.

### Compilation speed
Your point about LLVM compile time is great one. Mojo is architected from the beginning for fast compile times, including deeply integrated caching and distributed compilation. LLVM "isn't slow" if you don't keep asking it to do the same thing over and over again.

### What makes Rust/C++ compilation slow?
1. Type system. If you go with a [constraint based Hindly Milner](https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_system) type system and then add things like overloading etc, you quickly get into exponential behavior. Swift has been fighting this for years now to tamp down the worst cases. This isn't good; don't do that.

2. Mid-level compilation model. "Zero cost abstraction" languages including C++ (but also more recent ones like Swift and Rust and now Mojo) rely in massive inlining and abstraction elimination to get "zero cost" behavior. LLVM can do inlining and simplification and all the other stuff, but it is a very low level of abstraction - generating a TON of IR and then asking LLVM to delete it for you is very slow, and shows up in the profile as "llvm is slow" because you're creating all the llvm ir nodes ("LLVM") and then asking llvm optimization passes to delete them for you. It is far better to not generate it in the first place.

3. Code generation: Reasonable codegen is O(N^2) and worse in core algorithms like register allocation and scheduling. This is unavoidable if you want high quality of results (though of course, llvm is also far from perfect). LLVM is also very old and single threaded. If you don't do anything to address these issues, you'll be bottlenecked in this phase.

### Building for different hardware
We're working hard to get Mojo built out and available to more people and in more ways, so we haven't documented everything like this (stay tuned for more over time of course). The short answer is that the 'mojo' command line tool includes a bunch of things (including AOT compilation) but defaults to "run this like a script" mode using a JIT.

I can't comment yet on any of those specific hw strategies, but our approach is to build from the bottom up.

Building on other people's libraries (imo) has the problem of providing a great "happy path" that works in the cases they have optimized at the expense of the general case. We're willing to do the hard work to make things "just work" in the general case. Yes, this is hard tech and a really difficult problem to solve given the complexity of hte hardware accelerators and other things we're grappling with, but we think it is worthwhile to solve these hard problems for the ecosystem

Check out our (multiple) blog posts talking about this philosophy

One thing I'd say though is that you can't just do this with a PL approach, you need a whole stack ML solution to do this. This is the only way to solve the heterogenous compute problem that you're referencing

### How is it faster than Python
That's the trick with Mojo, our goal is not to make dynamic python magically fast. Yes, we are quite a bit faster at dynamic code (because we have compiler instead of an interpreter) but that isn't by relying on a 'sufficiently smart' compiler to remove the dynamism, it is just because "compilers" instead of "interpreters".

The reason Mojo is way way faster than Python is because it give programmers control over static behavior and makes it super easy to adopt incrementally where it makes sense. The key payoff of this is that the compilation process is quite simple, there are no JITs required, you get predictable and controllable performance, and you still get dynamism where you ask for it.

Mojo doesn't aim to magically make Python code faster with no work (though it does accidentally do that a little bit), Mojo gives you control so you can care about performance where you want to. 80/20 rule and all that.


### Build System
Mojo shifts the discussion on that a bit. A lot of value prop of build systems end up being about caching and distribution, which mojo provides natively.

None of that really matters for Mojo, but it is still quite important to have package managers and manage when and where compilation happens though... this is something of a gravel road that is not fully paved. We need to invest more in this in the future.

Various existing languages have problems with "LLVM compilation time", particularly when they claim zero abstraction costs and then expect LLVM to provide that for them. Mojo deftly defines away both through some cool MLIR things and also because it knows about caching.

### Package manager
We don't have specific package manager plans and I am not an expert on the existing python ecosystem (other folks on our team know much more about it than me). It would be great if we can avoid inventing something, and fit into existing systems, but if we need to innovate here to get something great then we will.

### libc dependency 
Yes, support for low-dependence zig-like deployment scenarios is important to us and Mojo architecturally supports it, but we haven't put much effort into making that great yet. It's more of a gravel road than a paved road at this point 🙂

### WASM
We haven't prioritized that, but it is a strong goal for sure.

### WebGPU
Also have not put energy into that yet, but this is the starting point, not the ending point 🙂

### C ABI
We haven't designed this currently, but have a bunch of experience with native C/C++ interop from Swift using imported Clang modules. We're surely learn a lot from that experience when we get here.

We'll do something similar to the swift/clang integration, so it will use clang to parse the C/c++ headers, but it will use the same ABI so it will link to code built by gcc/msvc or whatever else you're using

### C++ Interop
We'd love that too, in fact that's largely what Modular is doing internally for our AI engine. All the kernels are written in Mojo, but a bunch of other stuff is in C++. We'll dissolve away more and more of the C++ over time as Mojo is built out. In any case, it is very important to us for Mojo to support fully hybrid systems.


## Lifetimes, ownership, borrow checking
### Ownership System
Mojo also has a more advanced ownership system than Rust or Swift, which is also pretty cool if you're into such things. Check out the programmer's manual here for more info: https://docs.modular.com/mojo/

### Lifetime Parallelism Support
Our lifetime support isn't finished yet but will be in the next month or so, that is a cornerstone of that. Here is something I worked on in a former life that brought data race safety to swift, we will use some of the same approaches [but will also be very different in other ways](https://gist.github.com/lattner/31ed37682ef1576b16bca1432ea9f782)

We have a design and it is partially implemented, but not fully baked. I hope we can share more about this in the next month or two

Mojo doesn't have a publicly exposed lifetime system, so it can't express everything that we want it to today. It will soon though, [in the meantime you can express things with `&` which is shared mutable]( https://docs.modular.com/mojo/programming-manual.html#argument-passing-control-and-memory-ownership)

### Values implicitly copied in `fn` that requires ownership of that type
You get an error if your value is not copyable. Keep in mind that owned can/should be used in a lot of places as a performance optimization, e.g. the arguments to a "memberwise init". For non-copyable types this is required for correctness to handle ownership correctly, and for copyable types it allows you to avoid the copies if you're careful.

Like in Rust, you should not make your type implicitly copyable if that operation is expensive. If you want to control all copies and force ownership on the users of your type, you should instead implement an explicit x.copy() method which will make everything explicit in the code.

In Mojo, that concept of unique ownership is orthogonal to copyability, which is something that a number of other languages (e.g. Swift) got conflated. 

Having implicit moves is super confusing to many programmers, and makes the error messages way more difficult to explain back when something goes wrong.

### Rust-like syntax for lifetimes
Yes, this is in the roadway
coming soon, this is actually one of the next major features that will land

## General
### Investing in Modular
On investment, no there isn't, I'm sorry.

### File extension 🔥
Some of us are crazy, but also "crazy enough" to believe that the world can handle unicode a this point. Filename.mojo is really important and will always also work, but for those progressive enough to accept the new things, we offer a delightful alternative that looks great in your IDE and even on the command line with tab completion. 🔥

### AI term clarification
Mojo is a general purpose programming language in the Python family, so nothing about it (as a language) needs to be "AI". We are prioritizing its development to solve specific AI use-cases around extensibility, programmability, and hackability.

AI systems are currently split between Python/C++/CUDA which we'd like to solve. That said, as you point out, Mojo is completely general and is more of a "programming language to help the world cope with the end of moore's law"; it is just that AI use cases are the ones struggling the most with this right now.

### Mojo Financial
Thank you for the kind words! As explained in the launch video, we see mojo as a technology, not a product. We are a company and need to make money, but will do so based on products. We aren't sharing all the details on that right now, but you can follow our web page and newsletters etc for updates.

In terms of "betting on Mojo" right now, we are more focused on building Mojo to be the "right thing" rather that getting "hypergrowth" (something i've learned the hard way comes with down sides), but we'll open things up progressively over time as it matures. We would like to see Mojo go far and wide and are keenly aware of the need for OSS for adoption.


## Open Source
[From the FAQ](https://docs.modular.com/mojo/faq.html#will-mojo-be-open-sourced)

### Date to open source
I would tell you if I knew 🙂. Our priority is to build the "right thing" not build a demo and get stuck with the wrong thing. My wild guess is that the language will be very usable for a lot of things in 18 months, but don't hold me to that.

It WILL be open-sourced, because Modular on its own isn't big enough to build the whole ecosystem
Unlike Apple and Swift

### Opening the MLIR design docs
Our hands are pretty full at this point, and I don't think the general ML community would care much. That's something more that we'd talk at an LLVM event about or something. BTW, there is one next week.

### Could you write your own frontend to Mojo
Hey, great question! We aren't ready to talk more about the implementation details of the language yet, but the open-source dialects available in Mojo are the LLVM dialect and index dialect. The latter was upstreamed by Modular to MLIR

Yep, Mojo has a bunch of dialects internally, but they aren't intended for use by other languages. While it could be done theoretically, it isn't a goal, and we wouldn't want to slow down Mojo development by taking on new dependencies.

## Hardware and Accelerators
### General
We'll be sharing more about this soon (it has been quite a bit to get just to today) [but you can read a bit about it on our web page here](https://www.modular.com/hardware)

[Also check out some more technical content here](https://docs.modular.com/mojo/programming-manual.html#parameterization-compile-time-meta-programming)

### GPUs
We'll be sharing GPU numbers soon, I am pretty sure it will blow you away, but today is just our initial launch day. ML isn't one thing, and we are pretty excited about the full expanse of heterogenous compute. We'll be sharing more soon.

GPUs are super important (hopefully I don't need to convince you!) but ML is not just matmuls. ML is also about preprocessing, data loading, networking, and many other things. We've decided to solve the general problem first, because we know we can specialize that. Many existing systems have started from specialized solutions and failed to generalize.

GPU numbers are not far away, and benefit directly from everything we've shown so far. You'll need to use your imagination or extrapolate or imagine until we publish our next step, but we're not messing around here. Our goal is to announce things that are solid and production quality, not claim demo- or research-quality results. The ML industry has had enough of that for one or two generations.

### Adding a new Hardware Accelerator
Totally depends on the arch, and the compiler system for the target hw that is a very complicated question.

Similarly, that is an insanely complicated question. Software is one of the hardest parts of AI HW. This is one of the big problems modular is solving. If you are interested, please check 'hardware' in get started. 

### Community Contributions
Yes, community is super important to us, we definitely can't do everything ourselves!

### Integration with MLIR
[Check out the public docs](https://docs.modular.com/mojo/notebooks/BoolMLIR.html)

### Interaction with MLIR types
Modular uses many of its own dialects internally, but the only mainline MLIR dialects we use are LLVM and Index. Nothing else was suitable (not even SCF; which has tons of ties into arith etc), so we built an entirely new stack.

We use LLVM level dialects, and leverage LLVM for the targets it supports.

### MLIR and LLVM
Mojo can talk directly to MLIR and LLVM abstractions. [A toy example of that is shown in the Bool notebook here](https://docs.modular.com/mojo/notebooks/BoolMLIR.html)

We already use this to talk directly to both the Apple and Intel AMX instructions for example (which are identically named, but different things) which provide block matrix operations. We'll be sharing more about that soon.

For other accelerators, it depends on whether you have a traditional program counter + programmability or not. We talk a bit about this at a [high level on our Hardware page](https://www.modular.com/hardware)

### Macos and Ios
It would be very interesting to explore Mojo -> Swift and Mojo -> iOS interop but we have no plans for that in the immediate future, something to explore over time maybe.

iOS/Mac/etc as an AI platform is very interesting to us though.

I took a peak at the metal MLIR dialect. The ops lower to external library calls, which means one could access the metal API entirely through dlopen + function calls. No MLIR needed, strictly speaking. 

We do a lot of development on macs (and also linux, windows)

### ARM
Graviton is ARM architecture, check out performance.modular.com or our recent blog post about matrix multiplication

### Using CPU and GPU simultaneously
For that you need the Modular ai framework: you need graph level xforms and heterogenous compute for that. Mojo is one component of that stack that helps author the kernels and make them more portable, but the modular engine provides the "OS" for your heterogenous computer.

## Modular Inference Engine
[Official FAQ](https://docs.modular.com/engine/faq.html#do-we-really-need-yet-another-inference-engine)

### Implementation details
We haven't shared much about how our inference engine works internally yet.

### Runtime
Our runtime is designed to be modular. It scales down very well, supports heterogenous configs, and scales up to distributed settings in a pretty cool way, we're excited to share more about this over time.
