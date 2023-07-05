---
title: Why Use Mojo? 
author: Mojo Dojo
author_site: https://mojodojo.dev
author_image: https://mojodojo.dev/hero.png
excerpt: Why I'm excited about Mojo 
date: 2023-05-08
feed: true
---

# Why Use Mojo?
The Mojo toolchain is not yet available, [but you can signup](https://www.modular.com/get-started) to get early preview access to a Mojo notebook.

Check [the official why mojo page](https://docs.modular.com/mojo/why-mojo.html) for insights into the Modular team's reasoning for creating Mojo, this is the personal perspective of an engineer specializing in optimizing machine learning (ML) inference.

## Intro
Mojo has been designed to address Python's limitations by adding proven language features, enabling performance enhancement at a low level. Developed by Chris Lattner and his experienced team, Mojo aims to be a fully compatible Python superset. Lattner is recognized amongst many other things for creating Low-Level Virtual Machine (LLVM), a prevalent compiler infrastructure that optimizes code performance across numerous hardware and platforms. LLVM is utilized by the majority of high-performance languages, including C/C++, Rust, Zig, and Swift.

## Lessons Learned
Over the years, LLVM has seen extensive development, with a vast number of contributors ranging from individual hackers to major corporations. In the process of creating a modern programming language today, developers typically write code that is lowered to LLVM, as achieving similar performance across all existing hardware independently would be a monumental task. Consequently, the announcement of Chris Lattner launching a language that addresses Python's complex ecosystem and performance issues has generated considerable enthusiasm. This excitement stems not only from his prior success in resolving similar challenges, but also from his humble leadership style that fosters collaboration between hackers and corporate entities. Lattner acknowledges the lessons learned from past mistakes with the Swift language and demonstrates a appreciation for modern language features by improving upon them in Mojo, such as Rust's lifetimes and Zig's comptime.

## Current Optimization Solution
The ML ecosystem has experienced significant growth in complexity, with the C++ library ONNXRuntime emerging as the quickest route to hardware optimization. However, this library presents substantial challenges due to its 20 distinct execution providers and the need to build it from source via the infamously tricky CMake build system to optimize for various hardware. Selecting the appropriate Linux distribution and dependency versions based on the target platform and hardware can be an arduous task, with certain hardware necessitating the use of a specific tag or commit when building the library that ONNXRuntime links to.

## Mojo Benefits
Mojo enables fast development via an Interpreter and Just-in-Time (JIT) compilation or can compile to a single binary through Multi-Level Intermediate Representation (MLIR), another project initiated by Chris Lattner for TensorFlow, to enable hardware optimization during compilation. Resembling LLVM, MLIR incorporates additional benefits for ML and extensibility to other domains, and MLIR is now a part of the LLVM project.

Mojo enables optimizations through language-level exposure of types, such as SIMD (Single Instruction, Multiple Data), which allows modern hardware to perform the same operation on blocks of data simultaneously. This capability is particularly valuable in ML, leading to substantial performance improvements. Delving into a current Python library making use of linear algebra such as Numpy reveals C, Fortran, and Assembly at the core optimizing for different hardware. [Observe a demonstration by Jeremy Howard](https://www.youtube.com/watch?v=6GvB5lZJqcE) as he simplifies thousands of lines of intricate, hardware-specific code into a few concise lines of Mojo.

Mojo's current appeal lies not in its capabilities for training models, which will likely be developed in the future, but rather in its ability to improve the optimization process for inference at a lower level. This eliminates the need for modern engineers to delve into programming languages such as C/C++, Fortran, or Assembly, which can be a major barrier.

## Summary
Engineers can leverage a minimalist superset of Python for low-level optimization while enabling high-level programmers to work with their code using familiar Python syntax, eliminating the need to depend on old, complex libraries for optimization across various hardware platforms. Currently, to enhance performance, engineers often convert Python to C/C++ or Rust, but this approach hinders ML engineers' ability to experiment with inference code. Mojo's appeal stems from its ability to provide optimal performance across diverse hardware platforms without the frustration of grappling with languages like C/C++, Fortran, Assembly, CUDA and CMake, all while offering code that is accessible to ML engineers primarily focused on reducing model loss. As a result, both parties can collaborate and experiment with the same inference code, increasing the likelihood that this approach will emerge as the optimal solution to overcome current challenges in ML.

<CommentService />
