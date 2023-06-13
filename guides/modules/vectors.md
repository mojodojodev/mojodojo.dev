---
title: Vector
categories: Vector
usage: DynamicVector, InlinedFixedVector, and UnsafeFixedVector for managing vectors in Mojo
---

Contributed by [Alex1957](https://github.com/Alex19578)

## Vector

The `Vector` module provides three classes for managing vectors in Mojo: `DynamicVector`, `InlinedFixedVector`, and `UnsafeFixedVector`. These classes offer different functionalities and are suitable for various use cases. Let's explore each of them in detail.

# DynamicVector

The `DynamicVector` class provides a dynamic-size vector implementation. It allows you to add, access, update, and remove elements from the vector. Here's an example of how to use `DynamicVector`:

```mojo
from Vector import DynamicVector

var vect = DynamicVector[Int](8)

print(vect.__len__())  # Output: 0
```

#### Adding Elements
To add elements to the vector, you can use the `push_back` method:
```mojo
vect.push_back(1)
vect.push_back(2)
vect.push_back(3)
vect.push_back(4)
vect.push_back(5)
```

#### Accessing Elements
You can access elements from the vector using the `__getitem__` method:
```mojo
print(vect.__getitem__(1))  # Output: 2
```

#### Updating Elements
To update elements in the vector, you can use the `__setitem__` method:
```mojo
vect.__setitem__(1, 10)
print(vect.__getitem__(1))  # Output: 10
```

#### Copying Vector
You can create a copy of the vector using the `__copyinit__` method:
```mojo
var vect_copy = vect.__copyinit__(vect)
```

#### Clearing Vector
To remove all elements from the vector, you can use the `clear` method:
```mojo
vect.clear()
print(vect.__len__())  # Output: 0
```

#### Vector Length
You can retrieve the length of the vector using the `__len__` method:
```mojo
print(vect.__len__())  # Output: 5
```

# InlinedFixedVector

The `InlinedFixedVector` class provides a fixed-size vector implementation where small vectors are stored inline for better performance. It offers similar functionalities as `DynamicVector`, but with a fixed maximum capacity. Here's an example of how to use `InlinedFixedVector`:

```mojo
from Vector import InlinedFixedVector

var vect = InlinedFixedVector[5, Int](10)
```

#### Initialization
To initialize an `InlinedFixedVector`, you need to specify the maximum capacity within square brackets.

#### Adding Elements
To add elements to the vector, you can use the `append` method:
```mojo
vect.append(1)
vect.append(2)
vect.append(3)
vect.append(4)
vect.append(5)
```

#### Accessing Elements
You can access elements from the vector using the `__getitem__` method:
```mojo
print(vect.__getitem__(1))  # Output: 2
```

#### Updating Elements
To update elements in the vector, you can use the `__setitem__` method:
```mojo
vect.__setitem__(1, 10)
print(vect.__getitem__(1))  # Output: 10
```

#### Copying Vector
You can create a copy of the vector using the `__copyinit__` method:
```mojo
var vect_copy = vect.__copyinit__(vect)
```

#### Clearing Vector
To remove all elements from the vector, you can use the `clear` method:
```mojo
vect.clear()
print(vect.__len__())  # Output: 0
```

#### Vector Length
You can retrieve

 the length of the vector using the `__len__` method:
```mojo
print(vect.__len__())  # Output: 5
```

# UnsafeFixedVector

The `UnsafeFixedVector` class provides a fixed-size vector implementation with no bounds checking, making it faster but potentially unsafe if used incorrectly. Here's an example of how to use `UnsafeFixedVector`:

```mojo
from Vector import UnsafeFixedVector

var vect = UnsafeFixedVector[Int](10)
```

#### Initialization
To initialize an `UnsafeFixedVector`, you don't need to specify the maximum capacity.

#### Adding Elements
To add elements to the vector, you can use the `append` method:
```mojo
vect.append(1)
vect.append(2)
vect.append(3)
vect.append(4)
vect.append(5)
```

#### Accessing Elements
You can access elements from the vector using the `__getitem__` method:
```mojo
print(vect.__getitem__(1))  # Output: 2
```

#### Updating Elements
To update elements in the vector, you can use the `__setitem__` method:
```mojo
vect.__setitem__(1, 10)
print(vect.__getitem__(1))  # Output: 10
```

#### Copying Vector
You can create a copy of the vector using the `__copyinit__` method:
```mojo
var vect_copy = vect.__copyinit__(vect)
```

#### Clearing Vector
To remove all elements from the vector, you can use the `clear` method:
```mojo
vect.clear()
print(vect.__len__())  # Output: 0
```

#### Vector Length
You can retrieve the length of the vector using the `__len__` method:
```mojo
print(vect.__len__())  # Output: 5
```

These vector classes provide different trade-offs in terms of flexibility and performance. Choose the one that best suits your needs based on the specific requirements of your application.
