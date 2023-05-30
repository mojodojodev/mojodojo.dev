---
title: Benchmark
categories: Benchmark
usage: Pass in a closure that returns None as a parameter to benchmark its speed in nanoseconds
---
# Benchmark


```mojo
from Benchmark import Benchmark
```

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

    let recursive = Benchmark().run[closure]()
    print("Nanoseconds:", recursive)
    print("Seconds:", F64(recursive) / 1e9)

bench()
```

    Nanoseconds: 49788877
    Seconds: 0.049788877000000002


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

`Benchmark` has a few different arguments, make a simple benchmark to see what they all do:


```mojo
from Time import sleep

fn bench_args():
    fn sleeper():
        print("sleeping 300,000ns")
        sleep(3e-4)
    
    print("0 warmup iters, 5 max iters, 0 min time, 1_000_000_000ns max time")
    var nanoseconds = Benchmark(0, 5, 0, 100_000_000).run[sleeper]()
    print("average time", nanoseconds)

    # Limit the max running time, so it never goes over 1 second
    print("\n0 warmup iters, 5 max iters, 0 min time, 1_000_000ns max time")
    nanoseconds = Benchmark(0, 5, 0, 1_000_000).run[sleeper]()
    print("average time", nanoseconds)

bench_args()
```

    0 warmup iters, 5 max iters, 0 min time, 100_000_000ns max time
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    average time 359957
    
    0 warmup iters, 5 max iters, 0 min time, 1_000_000ns max time
    sleeping 300,000ns
    sleeping 300,000ns
    sleeping 300,000ns
    average time 359248


Take note above, the target max iters was 5, it printed 6 iterations as there is a little extra logic inside `Benchmark.run`.

On the second run we set the max to 1,000,000ns so it only has time to run 3 iterations before it finishes.

Try one more with a warmup, and set the minimum to 3 million nanoseconds, which will mean it ignores the max iterations and runs 1 warmup and 9 normal runs:


```mojo
fn bench_args():
    fn sleeper():
        print("sleeping 300,000ns")
        sleep(3e-4)

    let nanoseconds = Benchmark(1, 2, 3_000_000, 1_000_000_000).run[sleeper]()
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
    sleeping 300,000ns
    sleeping 300,000ns
    average time 360254

