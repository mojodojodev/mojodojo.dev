---
title: Benchmark
categories: Benchmark
usage: Pass in a closure that returns None as a parameter to benchmark its speed in nanoseconds
---
# Benchmark
## Import


```mojo
from Benchmark import Benchmark
```

## General Usage

Loop through each number up to `n` and calculate the total in the fibonacci sequence:


```mojo
alias n = 35 
```

Define the recursive version first:


```mojo
fn fib(n: Int) -> Int:
    if n <= 1:
       return n 
    else:
       return fib(n-1) + fib(n-2)
```

To benchmark it, create a nested `fn` that takes no arguments and doesn't return anything, then pass it in as a parameter:


```mojo
fn bench():
    fn closure():
        for i in range(n):
            _ = fib(i)

    let nanoseconds = Benchmark().run[closure]()
    print("Nanoseconds:", nanoseconds)
    print("Seconds:", Float64(nanoseconds) / 1e9)

bench()
```

    Nanoseconds: 50322420
    Seconds: 0.05032242


Define iterative version for comparison:


```mojo
fn fib_iterative(n: Int) -> Int:
    var count = 0
    var n1 = 0
    var n2 = 1

    while count < n:
       let nth = n1 + n2
       n1 = n2
       n2 = nth
       count += 1
    return n1

fn bench_iterative():
    fn iterative_closure():
        for i in range(n):
            _ = fib_iterative(i)

    let iterative = Benchmark().run[iterative_closure]()
    print("Nanoseconds iterative:", iterative)

bench_iterative()
```

    Nanoseconds iterative: 0


Notice that the compiler has optimized away everything, LLVM can change an iterative loop to a constant value if all the inputs are known at compile time through `constant folding`, or if the value isn't actually used for anything with `Dead Code Elimination` both of which could be occurring here.

There is a lot going on under the hood, and so you should always test your assumptions with benchmarks, especially if you're adding complexity because you _think_ it will improve performance, [which often isn't the case](https://vimeo.com/649009599).

## Max iters
Set max iterations and a 1s max total duration


```mojo
from Time import sleep

fn bench_args():
    fn sleeper():
        print("sleeping 300,000ns")
        sleep(3e-4)
    
    print("0 warmup iters, 4 max iters, 0ns min time, 1_000_000_000ns max time")
    let nanoseconds = Benchmark(0, 5, 0, 1_000_000_000).run[sleeper]()
    print("average time", nanoseconds)

bench_args()
```

    0 warmup iters, 4 max iters, 0ns min time, 1_000_000_000ns max time
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    average time 363769


Note there is some extra logic inside `Benchmark` to help improve accuracy, so here it actually runs 6 iterations

## Max Duration
Limit the max running time, so it will never run over 0.001 seconds and will not hit the max iters of 5:


```mojo
fn bench_args_2():
    fn sleeper():
        print("sleeping 300,000ns")
        sleep(3e-4)
    
    print("\n0 warmup iters, 5 max iters, 0 min time, 1_000_000ns max time")
    let nanoseconds = Benchmark(0, 5, 0, 1_000_000).run[sleeper]()
    print("average time", nanoseconds)

bench_args_2()
```

    
    0 warmup iters, 5 max iters, 0 min time, 1_000_000ns max time
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    average time 364582


## Min Duration
Try with a minimum of 3 million nanoseconds, so it ignores the max iterations and runs 5 normal runs:


```mojo
fn bench_args():
    fn sleeper():
        print("sleeping 300,000ns")
        sleep(3e-4)

    let nanoseconds = Benchmark(0, 2, 1_500_000, 1_000_000_000).run[sleeper]()
    print("average time", nanoseconds)

bench_args()
```

    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    average time 366545


## Warmup
You should always have some warmup iterations, there is some extra logic for more accurate results so it won't run exactly what you specify:


```mojo
fn bench_args():
    fn sleeper():
        print("sleeping 300,000ns")
        sleep(3e-4)

    let nanoseconds = Benchmark(1, 2, 0, 1_000_000_000).run[sleeper]()
    print("average time", nanoseconds)

bench_args()
```

    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    average time 364094


<CommentService />
