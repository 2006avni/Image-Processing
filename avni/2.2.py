import cv2
import numpy as np
image1 = cv2.imread('input1.jpg')
image2 = cv2.imread('input2.jpg')
sub = cv2.subtract(image1, image2)
cv2.imshow('Subtracted Image', sub)
# De-allocate any associated memory usage
if cv2.waitKey(0) & 0xff == 27:
    cv2.destroyAllWindows()
