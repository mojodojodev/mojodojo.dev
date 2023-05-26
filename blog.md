# Blog
## Mojo First Impressions - 2023-05-22
### Launching Early
Mojo officially launched on the 3rd of May, igniting an overwhelming surge of interest by directly addressing real problems that many developers encounter when optimizing code related to Machine Learning (ML) inference. The decision to launch early with missing features may seem counter-intuitive, but it follows the Silicon Valley ethos that understanding what your customer really wants, can only be achieved through the tangible feedback that a product launch provides, so you should launch early!

### Team Experience
The team behind Mojo is a collection of highly skilled developers with extensive experience in language design, compilers and ML. They're responsible for much of the technology that is currently running our models in production today, and they're building a product that answers their own intricate needs. But Mojo extends its appeal to a wider audience including system programmers who aren't "compiler nerds", and Python developers interested in learning how to optimize at a lower level.

### Missing Features
The launch has given the team feedback on what the average programmer wants most, and the speed at which they're able to implement these requests is impressive. In Mojo there is a `PythonObject` that represents a pointer to a value from `CPython` interpreted code, the most common complaint was not being able to print the values from these objects, as well as other unimplemented `dunder` (double underscore) methods such as `__truediv__` for the `\` operator. The Mojo team established a [GitHub repository for raising issues](https://github.com/modularml/mojo/) which is now bustling with activity. In a `PythonObject` related thread, a note from Chris confirmed an engineer was addressing the problem, and just a few days later, [all of the requested dunder methods were implemented](https://docs.modular.com/mojo/MojoPython/PythonObject.html). This is the power of launching early, you're building out in the open allowing your users to witness firsthand the team's proficiency, building trust and enthusiasm as you ship features and fix bugs, while giving you valuable feedback about what your core audience actually wants.

### Community
The growing Mojo community has a positive and helpful attitude, with numerous community members emerging that are enthusiastically answering questions and solving compiler errors. Each time a blog post or video is shared the Mojo team respond to it with enthusiasm, which engages the creator as they become more involved with the community. 

Syntax debates have already begun, which have surprisingly been met with a high level of maturity, once a decision is made the [bike-shedding](https://en.wikipedia.org/wiki/Law_of_triviality) has ceased. This is facilitated by the community trust in Chris Lattner's expertise, having led large open source projects building ubiquitous languages, compilers and infrastructure including Clang, LLVM, MLIR and Swift. Many languages have no final point of authority, or a lack of trust from the community, and so the bike-shedding never ends. This confidence from the Mojo team also extends to responses to negative sentiments, they're not met with defensiveness but with gratitude for the interest, and a hope that they return once the language is more mature.

### Language Features
My takeaway experimenting with Mojo has been that it incorporates my favorite features from my favorite languages:

- English readability of Python
- Memory Safety of Rust
- Hardware level control of C
- Zero cost abstractions of C++
- Metaprogramming and generics simplicity of Zig
- Parallelization simplicity of Go

In several aspects, Mojo surpasses the aforementioned languages:

- Incorporation of `SIMD` at the language level for enhanced hardware control
- Simpler memory management model than Rust with more control through a lack of implicit `move`
- Ability to use any existing runtime function at compile time without annotation
- Special builtins like `autotune` and `search` to optimize for various hardware at compile time

Everything that is currently implemented is orthogonal, and not just a mixed bag of modern features. The big question mark is the implementation of `traits` a.k.a `protocols`, a syntax to express `lifetimes`, and in general what the toolchain will be like.


### Current State
My only criticism on the launch would be some of the marketing suggesting that Mojo is currently a superset of Python, to paraphrase Warren Buffet:

> You can hold a `rock concert`, and that's okay. You can perform a `symphony`, and that's okay. But don't hold a `rock concert` and advertise it as a `symphony`.

Mojo is currently a `rock concert` for system programmers that don't mind getting their hands dirty, with a clear vision and path towards becoming a `symphony` for all programmers.

Check out some of the below resources if you don't mind getting your hands dirty!

- [Sign up for the playground](https://www.modular.com/get-started)
- [Read the FAQ](https://docs.modular.com/mojo/faq.html)
- [Read the manual](https://docs.modular.com/mojo/programming-manual.html)
- [This week in Mojo](https://mojodojo.dev/this_week_in_mojo.html)
- [Mojo team answers](https://mojodojo.dev/mojo_team_answers.html)
- [Join the Discord](https://www.discord.gg/modular)


## Why Use Mojo? - 2023-05-08

The Mojo toolchain is not yet available, [but you can signup](https://www.modular.com/get-started) to get early preview access to a Mojo notebook.

Check [the official why mojo page](https://docs.modular.com/mojo/why-mojo.html) for insights into the Modular team's reasoning for creating Mojo, this is the personal perspective of an engineer specializing in optimizing machine learning (ML) inference.

### Intro
Mojo has been designed to address Python's limitations by adding proven language features, enabling performance enhancement at a low level. Developed by Chris Lattner and his experienced team, Mojo aims to be a fully compatible Python superset. Lattner is recognized amongst many other things for creating Low-Level Virtual Machine (LLVM), a prevalent compiler infrastructure that optimizes code performance across numerous hardware and platforms. LLVM is utilized by the majority of high-performance languages, including C/C++, Rust, Zig, and Swift.

### Lessons Learned
Over the years, LLVM has seen extensive development, with a vast number of contributors ranging from individual hackers to major corporations. In the process of creating a modern programming language today, developers typically write code that is lowered to LLVM, as achieving similar performance across all existing hardware independently would be a monumental task. Consequently, the announcement of Chris Lattner launching a language that addresses Python's complex ecosystem and performance issues has generated considerable enthusiasm. This excitement stems not only from his prior success in resolving similar challenges, but also from his humble leadership style that fosters collaboration between hackers and corporate entities. Lattner acknowledges the lessons learned from past mistakes with the Swift language and demonstrates a appreciation for modern language features by improving upon them in Mojo, such as Rust's lifetimes and Zig's comptime.

### Current Optimization Solution
The ML ecosystem has experienced significant growth in complexity, with the C++ library ONNXRuntime emerging as the quickest route to hardware optimization. However, this library presents substantial challenges due to its 20 distinct execution providers and the need to build it from source via the infamously tricky CMake build system to optimize for various hardware. Selecting the appropriate Linux distribution and dependency versions based on the target platform and hardware can be an arduous task, with certain hardware necessitating the use of a specific tag or commit when building the library that ONNXRuntime links to.

### Mojo Benefits
Mojo enables fast development via an Interpreter and Just-in-Time (JIT) compilation or can compile to a single binary through Multi-Level Intermediate Representation (MLIR), another project initiated by Chris Lattner for TensorFlow, to enable hardware optimization during compilation. Resembling LLVM, MLIR incorporates additional benefits for ML and extensibility to other domains, and MLIR is now a part of the LLVM project.

Mojo enables optimizations through language-level exposure of types, such as SIMD (Single Instruction, Multiple Data), which allows modern hardware to perform the same operation on blocks of data simultaneously. This capability is particularly valuable in ML, leading to substantial performance improvements. Delving into a current Python library making use of linear algebra such as Numpy reveals C, Fortran, and Assembly at the core optimizing for different hardware. [Observe a demonstration by Jeremy Howard](https://www.youtube.com/watch?v=6GvB5lZJqcE) as he simplifies thousands of lines of intricate, hardware-specific code into a few concise lines of Mojo.

Mojo's current appeal lies not in its capabilities for training models, which will likely be developed in the future, but rather in its ability to improve the optimization process for inference at a lower level. This eliminates the need for modern engineers to delve into programming languages such as C/C++, Fortran, or Assembly, which can be a major barrier.

### Summary
Engineers can leverage a minimalist superset of Python for low-level optimization while enabling high-level programmers to work with their code using familiar Python syntax, eliminating the need to depend on old, complex libraries for optimization across various hardware platforms. Currently, to enhance performance, engineers often convert Python to C/C++ or Rust, but this approach hinders ML engineers' ability to experiment with inference code. Mojo's appeal stems from its ability to provide optimal performance across diverse hardware platforms without the frustration of grappling with languages like C/C++, Fortran, Assembly, CUDA and CMake, all while offering code that is accessible to ML engineers primarily focused on reducing model loss. As a result, both parties can collaborate and experiment with the same inference code, increasing the likelihood that this approach will emerge as the optimal solution to overcome current challenges in ML.
