import cv2
import numpy as np
img = cv2.imread("salad1.jpg")
if img is None:
    print("Error: Image not found. Please check your file name and path.")
    exit()
ksize = 5
dst = cv2.medianBlur(img, ksize)
cv2.imshow('Original vs Median Blur', np.hstack((img, dst)))
cv2.imwrite("median_blurred_output.png", dst)
print("Success: Filtered image saved as 'median_blurred_output.png'")
cv2.waitKey(0)
cv2.destroyAllWindows()
