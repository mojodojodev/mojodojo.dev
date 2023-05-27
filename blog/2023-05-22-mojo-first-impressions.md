---
title: Mojo First Impressions 
author: Mojo Dojo
author_site: https://mojodojo.dev
author_image: https://mojodojo.dev/hero.png
excerpt: A user perspective from the first few weeks of Mojo's release
feed: true
head:
  - - meta
    - name: twitter:card
      content: summary
    - name: twitter:site
      content: mojodojodev
---

# Mojo First Impressions
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
Mojo incorporates the best features of various languages:

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

Everything currently implemented is orthogonal, and not just a mixed bag of modern features. The big question mark is the implementation of `traits` a.k.a `protocols` and a syntax to express `lifetimes` which are both currently in the works.

### Current State
My only criticism on the launch would be some of the marketing suggesting that Mojo is currently a superset of Python, to paraphrase Warren Buffet:

> You can hold a `rock concert`, and that's okay. You can perform a `symphony`, and that's okay. But don't hold a `rock concert` and advertise it as a `symphony`.

Mojo is currently a `rock concert` for system programmers that don't mind getting their hands dirty, with a clear vision and path towards becoming a `symphony` and superset of Python.

If you don't mind getting your hands dirty check out these resources:

- [Sign up for the playground](https://www.modular.com/get-started)
- [Read the FAQ](https://docs.modular.com/mojo/faq.html)
- [Read the manual](https://docs.modular.com/mojo/programming-manual.html)
- [This week in Mojo](https://mojodojo.dev/this_week_in_mojo.html)
- [Mojo team answers](https://mojodojo.dev/mojo_team_answers.html)
- [Join the Discord](https://www.discord.gg/modular)
