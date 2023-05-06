## Parametric algorithms
Yes, Mojo provides guaranteed specialization of parametric algorihtms like Julia/Rust/C++.

## C++ Interop
We'd love that too, in fact that's largely what Modular is doing internally for our AI engine.  All the kernels are written in Mojo, but a bunch of other stuff is in C++.  We'll dissolve away more and more of the C++ over time as Mojo is built out.
In any case, it is very important to us for Mojo to support fully hybrid systems.

## VSCode and LSPs
Works great in VSCode and has nice LSP support. We aren't exposing that quite yet, but will as things settle down a bit

Yep, we fully support this.  Our VSCode experience is pretty great and many of us live on it, we just haven't been able to expose it on day 1.  Stay tuned.

how is the. type speed compared to my mac

## Language comparisons
[Why we chose to write a new language](https://docs.modular.com/mojo/why-mojo.html)

### General
Part of this decision stems from the Swift4TensorFlow experience, which had a few lessons informing the decision to launch a new language rather than building on top of an existing one (which is what Swift4TF attempted to do)

1. You have to get the fundamentals right. Trying to build on top of something that wasn't designed at its core to do what you need it to do is going to lead to substandard solutions.
2. The ML community really loves Python. Mojo is trying very hard to preserve most (but not all) of the Python programming model, with modern takes and advancements on the core ideas of the language -- Python has a ton of great ideas from a PL perspective, but suffers from being decades old

As for "why not fork an existing thing?", well like it's written in our rationale doc, we didn't set out to build a new programming language

We had a system to solve a few problems we were having, and developing a programming language on top of that just seemed like the natural next step for it

We also have to move fast, and taking on existing systems has a cost versus building something ourselves that has to be evaluated

### CPython Compilers
Correct, we put no effort into trying to make CPython go faster - other folks are doing that, and we compose on top of it.  If you want the benefits of mojo you move your code into the mojo world.  We're prioritizing "simple and predictable" programming models

### Julia
It's hard to give a short description of differences between two major languages like Julia and Mojo.  compilation model, default array indexing, language syntax are all different.  Julia is a wonderful language and we wish it the best, but Mojo is a very different thing.  Please check out the docs for more

### Codon
Codon is a cool project, but fundamentally different and doesn't meet the objectives outlined on our "why mojo?" page.  Codon (like PyPy and many other existing projects) are in the line of projects that try to use "sufficiently smart" JITs and other compiler techniques to make python faster: https://docs.modular.com/mojo/why-mojo.html#related-work-other-approaches-to-improve-python

That is not our goal.  Our goal isn't a somewhat faster Python, our goal is full performance on heterogenous hardware, and deployment to things that Python and C++ can't do.  There is some overlap in goals of course, but Mojo is far more ambitious (and a much larger engineering investment) than something like Codon.

There are numerous other technical things, for example Codon changes the semantics of integers in Python, so it isn't actually a compatible superset like Mojo is.

### Vale
(Chris Latner) I'm a bit familiar with Vale, also friends with the Val folks (DaveA etc) and am also familiar with the Pony and various other languages. They're all super cool.

### JAX
We love JAX and PyTorch and TensorFlow and all the other APIs with all their beauty and warts.  Modular doesn't have a training API, but it could be interesting for the community to explore that as Mojo matures over time

### IREE
I'm not sure, while I know many folks that work on IREE but I haven't used it myself.  My understanding is that it is research focused and doesn't provide (e.g.) full compatibility with all tensorflow and pytorch models.  It also seems difficult to extend unless you yourself are a compiler engineer. It is also 4+ years old and is Google led, so it is hard to predict where it will go and when. 

The Modular stack is production quality, run by an independent company and has extremely different internal design premises and is focusing on ensuring our customers and users succeed in real world deployments. It is designed for extensibility by non-compiler-engineers writing Python and Mojo 🔥 code, and is designed for an open ecosystem of operators and numerics.

I'm sure there are dozens of other differences, but we are more focused on building an amazing thing than we are about other systems.

### Dex
Dex is really cool, but I haven't paid attention to their development recently so I can't gie a good comparison.

Generally speaking though, Mojo isn't providing a "sufficiently smart compiler" that magically transforms your code in unpredictable ways. Instead of provides a simple and predictable programming model that is super hack able and extensible.

### TVM
TVM is a nice system, as is XLA, Halide, NVFuser, and many many others. We're not claiming to have invented parallel foreach loop. If TVM works for you, then that's great!

Mojo and the Modular stack have a number of technical improvements that go far beyond TVM, and we certainly appreciate the research that it has contributed over many years.  We've learned a lot from it and many other existing systems.

### Triton
There are some comments on EDSLs like triton here: https://docs.modular.com/mojo/why-mojo.html#related-work-other-approaches-to-improve-python

But one big difference is that Mojo is a full language, includes a debugger and full toolsuite, etc.

Triton is more of a specialized programming model for one (important) kind of accelerator, and is not even fully general/expressive for what GPUs can do

Honestly, I'm not an expert in Triton, nor with the issues you're mentioning.  I'm not sure what happened there.

## WASM
We haven't prioritized that, but it is a strong goal for sure.

## WebGPU
Also have not put energy into that yet, but this is the starting point, not the ending point 🙂

## Concurrency / Async / Parallelism
We support for async/await syntax in python and have a high performance runtime that enables parallelism.  The Matmul notebook online shows some simple examples

We haven't described the runtime side of this, but Mojo is built on a high performance heterogenous runtime with very lightweight tasks and full asynchrony at its core. The Modular engine is all about high performance heterogenous accelerated compute after all.

We haven't built out all the concurrency features in Mojo yet, but do have the basics re: async/await etc that Python has.

We'll need to build this out over time, if you're not familiar with it, you might find the Swift actor and structured concurrency systems to be interesting.  It is a production language today that has solved a bunch of these problems already, and while there are a few mistakes made, it has lots of good ideas that are not widely known.

You can read about the swift prior art here:
https://gist.github.com/lattner/31ed37682ef1576b16bca1432ea9f782

We have a super strong story here, check out the launch demo and matmul notebook, Jeremy shows a simple example there.  We also fully support async/await like Python etc.


## How strongly typed is Mojo on a scale of `Python` to `Rust`
It's a false dichotomy in my opinion based on how those systems work.  Mojo already supports great integration with Python and has a more powerful ownership system than Rust (but lifetimes are not finished yet, so that isnt' comparable yet): 

https://docs.modular.com/mojo/programming-manual.html#argument-passing-control-and-memory-ownership

Much of the root of the dichotomy comes from fairly opinionated perspectives on "manual control over everything is the 'right' and therefore 'only' way to do things", which forces you into super rigorous programming mode.  Our view is a bit more pragmatic: dynamic is good, static is good, use the right tool for the job.

## Creating new operators support
We can definitely add that in time, but in the immediate future we're focused on /not/ adding gratuitous syntactic sugar.  We're focused on building out the core model and getting the fundamentals right.

E.g. even changing def __add__( to def +( would be trivial to do, but sends us down the route of building syntax sugar, which is hugely distracting.  It's better to stay focused.

## Metaprogramming and Compile Time
One of the cool things that Mojo provides is an extremely powerful parametric metaprogramming system (see the language design doc for a brief intro) which allows extending the compiler itself in mojo, so you can invent your own combinators. This is very important, because different accelerators have different cool features and we are not looking for a watered down programming model.

This isn't fully documented yet, and there are a few missing pieces we want to wrap up before doing so, but this provides a pretty different programming model than existing systems.

One way to say this is that Mojo is taking a lot of the power out of the compiler and putting it into libraries, allowing Mojo developers to radically extend the language.  Python already has this but does so with super dynamic reflective metaprogramming, so this is an old idea done in a new way

## CPython Compatibility
### Classes
You can import python packages and use their classes, you just can't define your own in Mojo yet.

### Adding features and syntactic sugar
There are a gagillion (technical term there) theoretical features we could add to Python to make it better in various ways, but we're resisting the urge. We want Mojo to be a good member of the Python community, and the systems programming features and compatibility features need a lot continued development.

Syntactic sugar is fun and can be exciting, but it is also dangerous, and I'd personally prefer we avoid it completely unless it is extremely highly motivated by the core use case (accelerators, systems programming etc) that Python doesn't already service.

Yes, as the core mojo language evolves, we expect more pure-mojo code to be used in practice, and less compatibility-cpython code.  This will happen progressively over time, one analogy of this can be seen in the Swift community: in that case, Swift was adopted first by apps and "rewrites of core infra" happened asynchronously where there was value to doing so.

As we explain in the launch video, our immediate focus is on accelerators and ML kernels etc, we'll scale up to C++ use cases, and then to the full python enchilada, this will take time, but certainly not 10 years 😉

All Mojo code is compiled by the mojo compiler, including code that happens to be syntactically identical (by design) to Python
The CPython implementation comes in when you import a CPython module into an object.  That is exactly a CPython object with exactly the same runtime representation, and uses the CPython interpreter to implement support for it.

(using the PyCall and PyAddRef etc apis under the hood)

Plz check out this for an example: https://docs.modular.com/mojo/notebooks/Mandelbrot.html

Just like when the c or c++ committee adds a new feature to their languages, Clang fast follows.  Same model.

Also, we don't see Mojo as different than Python.  Mojo is a member of the Python family just like PyPy, IronPython and many others are members of the family.

we're very happy to be able to now work directly with the smart folk who have built Python 3 into such a beautiful thing.

### Complex types
I have literally the same experience about slow and overly complex type systems and too much sugar as you're pointing out. I've learned a lot from it, and the conclusion is "don't do it again". You can see a specific comment about this at the end of this section: https://docs.modular.com/mojo/notebooks/HelloMojo.html#overloaded-functions-methods

It's also interesting that Rust et al made similar (but also different) mistakes and have compile time issues scaling. Mojo has a ton of core compiler improvements as well addressing the "LLVM is slow" sorts of issues that "zero abstraction" languages have when expecting LLVM to do all the work for them.

## Compiler Speed
### What makes Rust / Swift / C++ slow?
1. Type system. If you go with a constraint based hindly milner (https://en.wikipedia.org/wiki/Hindley%E2%80%93Milner_type_sy...) type system and then add things like overloading etc, you quickly get into exponential behavior. Swift has been fighting this for years now to tamp down the worst cases. This isn't good; don't do that.

2. Mid-level compilation model. "Zero cost abstraction" languages including C++ (but also more recent ones like Swift and Rust and now Mojo) rely in massive inlining and abstraction elimination to get "zero cost" behavior. LLVM can do inlining and simplification and all the other stuff, but it is a very low level of abstraction - generating a TON of IR and then asking LLVM to delete it for you is very slow, and shows up in the profile as "llvm is slow" because you're creating all the llvm ir nodes ("LLVM") and then asking llvm optimization passes to delete them for you. It is far better to not generate it in the first place.

3. Code generation: Reasonable codegen is O(N^2) and worse in core algorithms like register allocation and scheduling. This is unavoidable if you want high quality of results (though of course, llvm is also far from perfect). LLVM is also very old and single threaded. If you don't do anything to address these issues, you'll be bottlenecked in this phase.

## Language Features
### Overloading Return Type
Mojo doesn’t support overloading solely on result type, and doesn’t use result type or contextual type information for type inference, keeping things simple, fast, and predictable. Mojo will never produce an “expression too complex” error, because its type-checker is simple and fast by definition. ```

### Nim uniform function call
We're willing to extend Python when it is highly motivated (e.g. the struct keyword) but avoid syntactic sugar.

We'll have to evaluate it when we get there (probably 2-3 months) but an alternative to the nim approach is to supprot "extensions" along the lines of what Swift did: https://docs.swift.org/swift-book/documentation/the-swift-programming-language/extensions

They solve the same problem without making "two ways to do things" and dovetails better into generics.

## Syntax 
### self keyword
Dropping the `self` keyword would diverge from Python a lot.  it would also break orthogonality in the language.  Swift suffers from a ton of extra keywords by not making self be explicit.  It is better to just keep things consistent and explicit (also precedented in rust etc)

### `self&` for borrowed
We're likely to change the reference syntax to inout: https://github.com/modularml/mojo/issues/7

the rationale is to get it away from the prefix * and ** sigils used for variadics. I agree with you though that it takes some getting used to. An alternate approach would be to dump the & sigil and switch to a keyword like inout. That would be more expressive and align better with borrowed and owned.

### Owned and consumed
They're the same thing. Consume is the word we're currently using for the operator, owned is the argument convention. We may need to iterate on terminology a bit more.

### ^ consume postfix operator
Because it composes properly with chained expressions: `x.foo().bar().baz^.do_thing()` vs something like `(move x.foo().bar().baz).do_thing()`

## ML Framework integration Pytorch/Tensorflow etc.
We don't have any current language features to enable this in the works, but I'm very familiar with the work on tape based and SCT (Source Code Transformation) approaches for AD (automatic differentiation), I believe our metaprogramming features will be useful to explore that when we get to wanting to build it.  Tape based approaches will "just work" of course, because they dont' need language support.

We also talk to all the existing python apis, including things like nn.module that use this, so those also "just work".  I'm not sure if that's the question though

There's a whole body of work called "differentiable programming" that I'm a nerd about :), but we don't have immediate plans to work on this.  I'm sure we'll intersect with that work in the future.

I can't prove this today, but my intuition is that we will be able to automatically produce backward versions of kernels from the forward version.  This has already been done by a number of other projects in other systems, eg https://enzyme.mit.edu/ and we have strictly more information than those systems do.

## Mojo Financial
Thank you for the kind words!   As explained in the launch video, we see mojo as a technology, not a product.  We are a company and need to make money, but will do so based on products.  We aren't sharing all the details on that right now, but you can follow our web page and newletters etc for updates.
In terms of "betting on Mojo" right now, we are more focused on building Mojo to be the "right thing" rather that getting "hypergrowth" (something i've learned the hard way comes with down sides),  but we'll open things up progressively over time as it matures.  We would like to see Mojo go far and wide and are keenly aware of the need for OSS for adoption.

## AI term clarification
Mojo is a general purpose programming langauge in the Python family, so nothing about it (as a language) needs to be "AI".  We are prioritizing its development to solve specific AI use-cases around extensibility, programmability, and hackability.

AI systems are currently split between Python/C++/CUDA which we'd like to solve.  That said, as you point out, Mojo is completely general and is more of a "programming language to help the world cope with the end of moore's law"; it is just that AI use cases are the ones struggling the most with this right now.

## libc dependency 
Yes, support for low-dependence zig-like deployment scenarios is important to us and Mojo architecturally supports it, but we haven't put much effort into making that great yet.  It's more of a gravel road than a paved road at this point 🙂

## JIT
We use JIT compilation for on-demand generation of code, but don't do any "devirtualization or specialization" tricks that dynamic languages use to get performance.  Instead we honor dynamism and give programmers the ability to express static things if they want it. This provides a simple and predictable programming model which scales.

### Speed
JIT performance is generally the same as AOT performance.
It does take time to compile code, but once you do that, you get generally the same code.

## Parallelism  
MPI is a C api IIRC so you can use it from Mojo in principle, but we haven't tried or put any effort into that.  Parallelism and distribution are not "optional" in the new world of compute, and we'd rather provide first class support for solving these age old problems.

## Availability outside of playground
Mojo is only available through the playground at this time. That will change over time but I can't give a timeline at this point. As to your latter question, the playground does not have any AI accelerators or GPUs attached at this time.

## Sockets
We haven't invested in building anything here, but you can use all the existing Python libraries in the meantime.  We also expect (as a community) to build out a bunch of mojo native libraries over time

## Lifetimes and borrow checking
### Parallelism  
Our lifetime support isn't finished yet but will be in the next month or so, that is a cornerstone of that.  Here is something I worked on in a former life that brought data race safety to swift, we will use some of the same approaches (but will also be very different in other ways) https://gist.github.com/lattner/31ed37682ef1576b16bca1432ea9f782

We have a design and it is partially implemented, but not fully baked. I hope we can share more about this in the next month or two

Mojo doesn't have a publicly exposed lifetime system, so it can't express everything that we want it to today. It will soon though, in the meantime you can express things with `&` which is shared mutable

https://docs.modular.com/mojo/programming-manual.html#argument-passing-control-and-memory-ownership

### Values implicitly copied in `fn` that requires ownership of that type
You get an error if your value is not copyable.  Keep in mind that owned can/should be used in a lot of places as a performance optimization, e.g. the arguments to a "memberwise init".  For non-copyable types this is required for correctness to handle ownership correctly, and for copyable types it allows you to avoid the copies if you're careful.

Like in Rust, you should not make your type implicitly copyable if that operation is expensive. If you want to control all copies and force ownership on the users of your type, you should instead implement an explicit x.copy() method which will make everything explicit in the code.

In Mojo, that concept of unique ownership is orthogonal to copyability, which is something that a number of other languages (e.g. Swift) got conflated. 

Having implicit moves is super confusing to many programmers, and makes the error messages way more difficult to explain back when something goes wrong.

### Rust-like syntax for lifetimes
Yes, this is in the roadway
coming soon, this is actually one of the next major features that will land

## si32/ui32 vs i32/u32
Less ambiguity, but this isn't a closely held belief, we can change it if there is a reason to. WDYT @Abdul ?

## Investing in Modular
On investment, no there isn't, I'm sorry.

## Error handling
We support the existing Python raise/try syntax, and also support with blocks etc.

We will also support an optional + result type as well for the usecases that benefit from it, e.g. functional patterns, we are missing some support in the generics system to do that right now, but that will get filled in in the next couple months

## Error Message
We still have a way to go in various departments (high quality error messages are super important) but we're off to a good start for such an early language.

## Compilation
### Building for different hardware
We're working hard to get Mojo built out and available to more people and in more ways, so we haven't documented everything like this (stay tuned for more over time of course).  The short answer is that the 'mojo' command line tool includes a bunch of things (including AOT compilation) but defaults to "run this like a script" mode using a JIT.

I can't comment yet on any of those specific hw strategies, but our approach is to build from the bottom up.

Building on other people's libraries (imo) has the problem of providing a great "happy path" that works in the cases they have optimized at the expense of the general case.  We're willing to do the hard work to make things "just work" in the general case.  Yes, this is hard tech and a really difficult problem to solve given the complexity of hte hardware accelerators and other things we're grappling with, but we think it is worthwhile to solve these hard problems for the ecosystem

Check out our (multiple) blog posts talking about this philosophy

One thing I'd say though is that you can't just do this with a PL approach, you need a whole stack ML solution to do this.  This is the only way to solve the heterogenous compute problem that you're referencing

## Interpreter and JIT 
We support and use both, but it is important for our deployment and accelerator goals to enable AOT compilation instead of requiring JIT for everything.

We have an interpreter (part of the parametric comptime metaprogramming system), a JIT (used by the LLDB/REPL/Workbook flow and used by on-demand kernel fusion) and AOT compiler (used by the mojo CLI)

BTW, in case you didn't know, we're not afraid of building cool hardtech things here. Compilers are cool 😉

Our JIT is also used for adaptive compilation - search performed at compile time

## Build System
Mojo shifts the discussion on that a bit.  A lot of value prop of build systems end up being about caching and distribution, which mojo provides natively.

None of that really matters for Mojo, but it is still quite important to have package managers and manage when and where compilation happens though... this is something of a gravel road that is not fully paved.  We need to invest more in this in the future.

Various existing languages have problems with "LLVM compilation time", particularly when they claim zero abstraction costs and then expect LLVM to provide that for them. Mojo deftly defines away both through some cool MLIR things and also because it knows about caching.

## Package manager
We don't have specific package manager plans and I am not an expert on the existing python ecosystem (other folks on our team know much more about it than me).  It would be great if we can avoid inventing something, and fit into existing systems, but if we need to innovate here to get somethign great then we will.


## GPUs
We'll be sharing GPU numbers soon, I am pretty sure it will blow you away, but today is just our initial launch day. ML isn't one thing, and we are pretty excited about the full expanse of heterogenous compute.  We'll be sharing more soon.

GPUs are super important (hopefully I don't need to convince you!) but ML is not just matmuls.  ML is also about preprocessing, data loading, networking, and many other things.  We've decided to solve the general problem first, because we know we can specialize that.  Many existing systems have started from specialized solutions and failed to generalize.

GPU numbers are not far away, and benefit directly from everything we've shown so far.  You'll need to use your imagination or extrapolate or imagine until we publish our next step, but we're not messing around here.  Our goal is to announce things that are solid and production quality, not claim demo- or research-quality results.  The ML industry has had enough of that for one or two generations.

## File extension 🔥
Some of us are crazy, but also "crazy enough" to believe that the world can handle unicode a this point. Filename.mojo is really important and will always also work, but for those progressive enough to accept the new things, we offer a delightful alternative that looks great in your IDE and even on the command line with tab completion. 🔥

## Ray Tracer
Question: If you can expose tensor core instructions, why not expose ray tracing instructions when you support GPUs? Then this would solve major fragmentation problems in HPC.

Chris Lattner: I'd looooove that ❤️‍🔥

## Binaries
### Producing binary
Yes. Mojo is built directly on top of existing compiler technologies like LLVM, which means you can produce object files, libraries, and executables (via the CLI). The Mojo Playground environment is different, however, since it uses our JIT.

Yes. Good deployability is a core part of Mojo's language design. E.g. our matmul implementation is ~100kb (blogpost here https://www.modular.com/blog/the-worlds-fastest-unified-matrix-multiplication)

### Binary Size
For Mojo, it depends on what you do - doing simple math is a couple kilobytes for final binary, doing something "heavy" like printing hello world pushes into 240K or so.  I think we can do better though...

We can definitely do better in hello world. A bunch of stuff isn't getting stripped due to... Reasons :/

## MLIR (Multi-Level Intermediate Representation)

### Integration with MLIR
Check out the public docs: https://docs.modular.com/mojo/notebooks/BoolMLIR.html

### Interaction with MLIR types
Modular uses many of its own dialects internally, but the only mainline MLIR dialects we use are LLVM and Index.  Nothing else was suitable (not even SCF; which has tons of ties into arith etc), so we built an entirely new stack.

We use LLVM level dialects, and leverage LLVM for the targets it supports.

## Open Source
### Date to open source
I would tell you if I knew :-).  Our priority is to build the "right thing" not build a demo and get stuck with the wrong thing.  My wild guess is that the language will be very usable for a lot of things in 18 months, but don't hold me to that.

### Opening the MLIR design docs
Our hands are pretty full at this point, and I don't think the general ML community would care much. That's something more that we'd talk at an LLVM event about or something. BTW, there is one next week.

### Could you write your own frontend to Mojo
Hey, great question! We aren't ready to talk more about the implementation details of the language yet, but the open-source dialects available in Mojo are the LLVM dialect and index dialect. The latter was upstreamed by Modular to MLIR

Yep, Mojo has a bunch of dialects internally, but they aren't intended for use by other languages.  While it could be done theoretically, it isn't a goal, and we wouldn't want to slow down Mojo development by taking on new dependencies.

## C ABI
We haven't designed this currently, but have a bunch of experience with native C/C++ interop from Swift using imported Clang modules.  We're surely learn a lot from that experience when we get here.

We'll do something similar to the swift/clang integration, so it will use clang to parse the C/c++ headers, but it will use the same ABI so it will link to code built by gcc/msvc or whatever else you're using

## Optimizing for accelerators and hardware
### General
We'll be sharing more about this soon (it has been quite a bit to get just to today) but you can read a bit about it on our web page here: https://www.modular.com/hardware

Also check out some more technical content here:
https://docs.modular.com/mojo/programming-manual.html#parameterization-compile-time-meta-programming

### Adding a new Hardware Accelerator
Totally depends on the arch, and the compiler system for the target hw that is a very complicated question.

Similarly, that is an insanely complicated question.  Software is one of the hardest parts of AI HW.  This is one of the big problems modular is solving.  If you are interested, please check 'hardware' in get started. 

### Community Contributions
Yes, community is super important to us, we definitely can't do everything ourselves!

### MLIR and LLVM
Mojo can talk directly to MLIR and LLVM abstractions.  A toy example of that is shown in the Bool notebook here: https://docs.modular.com/mojo/notebooks/BoolMLIR.html

We already use this to talk directly to both the Apple and Intel AMX instructions for example (which are identically named, but different things) which provide block matrix operations.  We'll be sharing more about that soon.

For other accelerators, it depends on whether you have a traditional program counter + programmability or not.  We talk a bit about this at a high level on our Hardware page: https://www.modular.com/hardware

### Macos and Ios
It would be very interesting to explore Mojo -> Swift and Mojo -> iOS interop but we have no plans for that in the immediate future, something to explore over time maybe.

iOS/Mac/etc as an AI platform is very interesting to us though.

I took a peak at the metal MLIR dialect. The ops lower to external library calls, which means one could access the metal API entirely through dlopen + function calls. No MLIR needed, strictly speaking. 

We do a lot of development on macs (and also linux, windows)

### ARM
Graviton is ARM architecture, check out performance.modular.com or our recent blog post about matrix multiplication

### Using CPU and GPU simultaneously
For that you need the Modular ai framework: you need graph level xforms and heterogenous compute for that.  Mojo is one component of that stack that helps author the kernels and make them more portable, but the modular engine provides the "OS" for your heterogenous computer.

## Modular Inference Engine
### Implementation details
We haven't shared much about how our inference engine works internally yet.

### Runtime
Our runtime is designed to be ... modular.  It scales down very well, supports heterogenous configs, and scales up to distributed settings in a pretty cool way.  We're excited to share more about this over time for sure

## CPython GIL (Global Interpreter Lock)
Like most other languages, Mojo just doesn't have a GIL.  🙂
Mojo is a completely new language, and is built with all new compiler and runtime technologies underneath it.  It isn't beholden to existing design decisions in Python, but we've learned a lot from Python and want to be a good member of the Python community

Yes, code run with CPython runs the same way that CPython does (for both better and worse) you have to move it to Mojo to get the performance and deployability advantages that Mojo brings.  It is still amazingly useful!

## Mutability (let and var)
### Performance benefits
let and var are just about safety/scoping etc. They are also helpful when using advanced types and move semantics, but even then not required. More info here: https://docs.modular.com/mojo/programming-manual.html#let-and-var-declarations

## General Purpose Language or AI/ML specific
We're not locking into anything, but everything needs a starting point! There is an exciting journey ahead with many steps along the way
