import cv2
import numpy as np
img = cv2.imread("salad1.jpg")
if img is None:
    print("Error: Image not found or path is incorrect.")
    exit()
im1 = cv2.blur(img, (5, 5))
cv2.imwrite("salad1_blurred.png", im1)
print("Success: Blurred image saved as 'salad1_blurred.png'")
cv2.imshow("Original Salad Image", img)
cv2.imshow("Averaged (Blurred) Salad Image", im1)
cv2.waitKey(0)
cv2.destroyAllWindows()
