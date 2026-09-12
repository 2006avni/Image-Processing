import cv2
import numpy as np
img1 = cv2.imread('input3.jpg')
img2 = cv2.imread('input4.jpg')
dest_and = cv2.bitwise_and(img2, img1, mask = None)
cv2.imshow('Bitwise And', dest_and)
 # De-allocate any associated memory usage
if cv2.waitKey(0) & 0xff == 27:
    cv2.destroyAllWindows()
