import cv2
import numpy as np
image1 = cv2.imread('tomato.jpg')
img = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
ret, thresh1 = cv2.threshold(img, 120, 255, cv2.THRESH_BINARY)
ret, thresh2 = cv2.threshold(img, 120, 255, cv2.THRESH_BINARY_INV)
ret, thresh3 = cv2.threshold(img, 120, 255, cv2.THRESH_TRUNC)
ret, thresh4 = cv2.threshold(img, 120, 255, cv2.THRESH_TOZERO)
ret, thresh5 = cv2.threshold(img, 120, 255, cv2.THRESH_TOZERO_INV)
cv2.imshow('CS25D015', thresh1)
cv2.imshow('CS25D015', thresh2)
cv2.imshow('CS25D015', thresh3)
cv2.imshow('CS25D015', thresh4)
cv2.imshow('CS25D015', thresh5)
if cv2.waitKey(0) & 0xff == 27:
    cv2.destroyAllWindows()
