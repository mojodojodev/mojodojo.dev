# Mojo's built in Bool

Here we will discuss all of the fields and functions implemented in Mojo's built in Bool class using examples.

Mojo's Bool is initialized by setting a variable of type Bool using True (1) or Flase (0)


```python
var my_bool_value: Bool = True # __init__(value: i1)
```

my_bool_value now has a field called value which contains the boolean value True or False. In this case it is True.


```python
print(my_bool_value)
print(my_bool_value.value)
```

Bool also implements the basic operations such as == , !=, &, | and ^. These operations can be performed by using these infix operators or by calling \_\_eq\_\_, \_\_ne\_\_, \_\_and\_\_, \_\_or\_\_ and \_\_xor\_\_ respectively.


```python
var my_second_bool_value: Bool = False
```


```python
print("They are equal:", my_bool_value.__eq__(my_second_bool_value)) # or print(my_bool_value == my_second_bool_value)
print("They are not equal:",my_bool_value.__ne__(my_second_bool_value)) # or print(my_bool_value != my_second_bool_value)
print("Are either of them True:",my_bool_value.__or__(my_second_bool_value)) # or print(my_bool_value | my_second_bool_value)
print("Are both of them True:",my_bool_value.__and__(my_second_bool_value)) # or print(my_bool_value & my_second_bool_value)
print("Are they different:",my_bool_value.__xor__(my_second_bool_value)) # or print(my_bool_value ^ my_second_bool_value)
```

The \_\_ror\_\_ , \_\_rand\_\_ and \_\_rxor\_\_ works a bit differently. Firstly think of the r in these cases as reversed. The ror, rand and rxor is called if you are trying to call the and, or, xor functions with a struct or class that does not implement these functions.

For example let say we have a struct called MyNumber that implements \_\_and\_\_ as well as \_\_rand\_\_, in the example below we want to see if MyNumber and another float has a value above 10.


```python
struct MyNumber:
    var float_value: FloatLiteral
    fn __init__(inout self, num: FloatLiteral):
        self.float_value = num

    # This object can & with int
    fn __and__(self, other: FloatLiteral) -> Bool:
        print("Called MyNumber's __and__ function")
        if self.float_value > 10.0:
            if other > 10:
                return True
        return False

    fn __rand__(self, other: FloatLiteral) -> Bool:
        print("Called MyNumber's __rand__ function")
        if self.float_value > 10.0:
            if other > 10:
                return True
        return False
```

If you check the documentation on FloatLiterals (https://docs.modular.com/mojo/MojoBuiltin/FloatLiteral.html) you will see the class does not implenent \_\_and\_\_ (nor \_\_rand\_\_).


```python
let float_number = FloatLiteral(12.0)
let my_number = MyNumber(15.0)
```

If MyNumber did not have the function \_\_rand\_\_ when you try execute print(float_number & my_number) the program will fail since FloatLiterals do not implement \_\_and\_\_. But since MyNumber implements \_\_rand\_\_ your program will try and run that function first before giving you an error.


```python
print(float_number & my_number) # First tries float_number.__and__(my_number) but this fails so it reverses it and tries my_number.__rand__(float_number) and succeeds.
```


```python
print(my_number & float_number) # First tries my_number.__and__(float_number) and succeeds.
```
