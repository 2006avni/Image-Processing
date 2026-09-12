import cv2
import numpy as np
img1 = cv2.imread('input3.jpg')
img2 = cv2.imread('input4.jpg')
dest_xor = cv2.bitwise_xor(img1, img2, mask=None)
cv2.imshow('Bitwise XOR', dest_xor)
if cv2.waitKey(0) & 0xff == 27:
    cv2.destroyAllWindows()
