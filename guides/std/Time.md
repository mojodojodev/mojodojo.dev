---
title: Time
categories: Time
usage: Measure elapsed time and make a thread sleep
---
# Time


```mojo
from Time import now, sleep, time_function
```

## now
Gets the current nanoseconds using the systems monotonic clock, which is generally the time elapsed since the machine was booted, but will vary behaviour by platform for states like `sleep` etc.


```mojo
print(now())
```

    276729993584072


## sleep
Make a thread sleep for the duration in seconds


```mojo
let tic = now()
sleep(.001)
let toc = now() - tic

print("slept for", toc, "nanoseconds")
```

    slept for 1062234 nanoseconds


## time_function
Pass in a nested `fn` a.k.a `closure` that takes no arguments and returns `None` as a parameter, e.g. to time a function named `sleep1ms`:


```mojo
fn sleep1ms():
    sleep(.001)

fn measure():
    fn closure() -> None:
        sleep1ms()

    let nanos = time_function[closure]()
    print("sleeper took", nanos, "nanoseconds to run")

measure()
```

    sleeper took 1060233 nanoseconds to run


<CommentService />
