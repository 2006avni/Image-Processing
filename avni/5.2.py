import cv2
import numpy as np
img = cv2.imread("salad1.jpg")
if img is None:
    print("Error: 'cat.png' not found. Please check the file path.")
    exit()
dst = cv2.GaussianBlur(img, (5, 5), cv2.BORDER_DEFAULT)
cv2.imshow('Original vs Gaussian Blur', np.hstack((img, dst)))
cv2.waitKey(0)
cv2.destroyAllWindows()
