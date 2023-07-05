```python
%%python
import cv2 as cv
import numpy as np
from matplotlib import colors

image = cv.imread('/home/jovyan/fire.png')

hex_values = [
    '#998AD3',
    '#E494D3',
    '#CDF1AF',
    '#87DCC0',
    '#88BBE4'
]

colours = []
for hex_value in hex_values:
    rgb_tuple = colors.hex2color(hex_value)
    rgb = tuple(int(val * 255) for val in rgb_tuple)
    colours.append(rgb)


output_image = np.zeros_like(image)

for i in range(image.shape[0]):
    for j in range(image.shape[1]):

        closest_colour = colours[np.argmin(np.linalg.norm(colours - image[i, j], axis=1))]

        output_image[i, j] = closest_colour

cv.imwrite("output.jpg", output_image)
```


```python
from Buffer import Buffer, NDBuffer
from DType import DType
from Index import StaticIntTuple
from TargetInfo import dtype_simd_width
from List import DimList

let cv = Python.import_module("cv2")
let np = Python.import_module("numpy")
let py = Python.import_module("builtins")

var img = cv.imread("/home/jovyan/fire.png")
py.print(img)

# alias hex_values = [
#     '#998AD3',
#     '#E494D3',
#     '#CDF1AF',
#     '#87DCC0',
#     '#88BBE4'
# ]

let h = img.shape[0].to_index()
let w = img.shape[1].to_index()
let c = img.shape[2].to_index()

print("image is", h,"x",w,"x",c)

# Create a buffer over the Numpy array
# var buf = NDBuffer[3, DimList(256, 256, 3), DType.int8](img.pyObject.value, StaticIntTuple[3](h, w, c), DType.int8)

# Calcuate how many elements can fit into our SIMD register
# alias nelts = dtype_simd_width[DType.int8]()
# let size = img.size
# let iterations = size // nelts
# let leftovers = size % nelts

# print("nelts:", nelts)
# print("size:", size)
# print("iterations:", iterations)
# print("leftovers:", leftovers)

# # let vals = buf.simd_load[nelts](0) / 10

# for i in range(1, 10):
#     let i_shape = buf.get_nd_index(i)
#     print(buf[i_shape])
#     let i_shape = buf.get_nd_index(i * nelts)
#     buf.simd_store[nelts](i_shape, 10)

cv.resize(img, (64, 64), inerpolation = cv.INTER_LINEAR)
cv.imwrite("little_fire.png", img)


 
```

    [[[255 255 255]
      [255 255 255]
      [255 255 255]
      ...
      [255 255 255]
      [255 255 255]
      [255 255 255]]
    
     [[255 255 255]
      [255 255 255]
      [255 255 255]
      ...
      [255 255 255]
      [255 255 255]
      [255 255 255]]
    
     [[255 255 255]
      [255 255 255]
      [255 255 255]
      ...
      [255 255 255]
      [255 255 255]
      [255 255 255]]
    
     ...
    
     [[255 255 255]
      [255 255 255]
      [255 255 255]
      ...
      [255 255 255]
      [255 255 255]
      [255 255 255]]
    
     [[255 255 255]
      [255 255 255]
      [255 255 255]
      ...
      [255 255 255]
      [255 255 255]
      [255 255 255]]
    
     [[255 255 255]
      [255 255 255]
      [255 255 255]
      ...
      [255 255 255]
      [255 255 255]
      [255 255 255]]]
    image is 256 x 256 x 3

