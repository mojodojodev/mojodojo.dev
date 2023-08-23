---
title: Mojo First Impressions 
author: Mojo Dojo
author_site: https://mojodojo.dev
author_image: https://mojodojo.dev/hero.png
excerpt: A user perspective from the first few weeks of Mojo's release
date: 2023-05-22
feed: true
head:
  - [meta, { name: twitter:card , content: summary }]
  - [meta, { name: twitter:site , content: '@mojodojodev' }]
  - [meta, { name: twitter:title , content: Mojo First Impressions }]
  - [meta, { name: twitter:description , content: "A user perspective from the first few weeks of Mojo's release" }]
  - [meta, { name: twitter:image , content: "https://mojodojo.dev/hero.png" }]
---

# Mojo First Impressions

### My Journey
I'm an engineer that has fallen into optimizing Machine Learning (ML) performance by converting Python to Rust, I really enjoy the work because it's so much more challenging than any other programming I've done, but the ML engineers struggle using Rust and so can no longer contribute to the code I was tasked with converting. In my spare time I've been working on a high level Rust ML inference library to try and ease this problem, but the unsafe code, type system complexity, and compiling the dependent C++ libraries for different hardware is a huge pain. 

I first saw the Mojo launch announcement on hackernews which stated that `Chris Lattner` was involved, and so I started reading [Why Mojo](https://docs.modular.com/mojo/why-mojo.html) where they explicitly called out my exact problems, once I got to the end of the [programming manual](https://docs.modular.com/mojo/programming-manual.html) and watched [Jeremy Howard's launch demo](https://www.youtube.com/watch?v=6GvB5lZJqcE) I was completely sold and so bought the [mojodojo.dev](https://mojodojo.dev) domain.

### Launch
I managed to get into the Mojo playground on launch day which was the 3rd of May, it was quickly apparent that this was a very young language with missing features, but there was an overwhelming surge of interest from people in the same position as me. The decision to launch early with missing features may seem counter-intuitive, but understanding what your users actually want can only be achieved through the tangible feedback that a product launch provides.

The team behind Mojo is a collection of highly skilled developers with extensive experience in language design, compilers and ML. They're responsible for much of the technology that is currently running our models in production today, and they're building a product that answers their own intricate needs. But Mojo extends its appeal to a wider audience including system programmers who aren't `compiler nerds` (a term of endearment 😀), and Python developers interested in learning how to optimize at a lower level.

### The first couple weeks
The speed at which the Mojo team is able to rectify the most common grievances is impressive. In Mojo there is a `PythonObject` that represents a pointer to a value from `CPython` interpreted code, the most common complaint was not being able to print the values from these objects, as well as other unimplemented `dunder` (double underscore) methods such as `__truediv__` for the `\` operator. The Mojo team established a [GitHub repository for raising issues](https://github.com/modularml/mojo/) and feature requests. Once an engineer was assigned it took just a few days for [all of the requested dunder methods to be implemented](https://docs.modular.com/mojo/MojoPython/PythonObject.html). Launching early gives you valuable feedback about what your core audience actually wants, and builds confidence as you fix the main pain points.

The growing Mojo community has a positive and helpful attitude, with numerous community members emerging that are enthusiastically answering questions and solving compiler errors. The Mojo team also responds to community content with enthusiasm, I've seen multiple people start engaging with answering questions after a nice message from someone on the Mojo team about their blog post.

Syntax debates have already begun of course! But they've be met with a surprising level of maturity, for example the `inout` keyword for a mutable reference makes a lot of sense when you've used it for a while but it's quite novel at first, there was much debate at first but once [Chris asked for a bikeshedding pause](https://github.com/modularml/mojo/issues/7#issuecomment-1551821543) it actually happened! [See bike-shedding](https://en.wikipedia.org/wiki/Law_of_triviality). I believe this comes from a respect in Chris Lattner's expertise, having led large open source projects building ubiquitous languages, compilers and infrastructure including Clang, LLVM, MLIR and Swift. Many languages have no final point of authority, or a lack of trust from the community, and so the bikeshedding never ends. The few negative sentiments I've seen have had a response that they hope the user returns once the language is more mature.

### Language Features
Exploring the language further I feel that Mojo incorporates the best features of various languages:

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
- Enables creating functions like `autotune` and `search` to optimize for various hardware at compile time using the core language

Everything currently implemented is orthogonal, and not just a mixed bag of modern features. The big question mark is the implementation of `traits` also known as `protocols`, and a syntax to express `lifetimes` which is currently in the works.

### Current State
My only criticism on the launch would be some of the marketing suggesting that Mojo is currently a superset of Python, to paraphrase Warren Buffet:

> You can hold a `rock concert`, and that's okay. You can perform a `symphony`, and that's okay. But don't hold a `rock concert` and advertise it as a `symphony`.

Mojo is currently a `rock concert` for system programmers that don't mind getting their hands dirty, with a clear vision and path towards becoming a `symphony` and superset of Python.

If you don't mind getting your hands dirty check out these resources:

#### Official
- [Sign up for the playground](https://www.modular.com/get-started)
- [Read the FAQ](https://docs.modular.com/mojo/faq.html)
- [Read the manual](https://docs.modular.com/mojo/programming-manual.html)
- [Join the Discord](https://www.discord.gg/modular)

#### Unofficial
- [Mojo Guides](/guides/)
- [This week in Mojo](/this_week_in_mojo/)
- [Mojo team answers](/mojo_team_answers)
- [Is Mojo for Me?](/is_mojo_for_me)

<CommentService />
