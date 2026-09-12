import cv2
import numpy as np
img = cv2.imread('neg.jpg', cv2.IMREAD_GRAYSCALE)
if img is not None:
    negative = 255 - img
    combined = np.hstack((img, negative))
    cv2.imshow('CS25D015', combined)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
else:
    print("Error: Image not found. Please check the file path.")

