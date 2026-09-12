import numpy as np
import cv2 as cv
img = cv.imread('girl.jpg', 0)
rows, cols = img.shape
M = np.float32([[1, 0.5, 0], [0, 1, 0], [0, 0, 1]])
sheared_img = cv.warpPerspective(img, M, (int(cols*1.5), int(rows*1.5)))
cv.imshow('img1', sheared_img)
cv.waitKey(0)
cv.destroyAllWindows()
