import numpy as np
import cv2 as cv
img = cv.imread("girl.jpg", 0)
rows, cols = img.shape
M = np.float32([[1,  0, 0],
                [0, -1, rows],
                [0,  0, 1]])
reflected_img = cv.warpPerspective(img, M,(int(cols),int(rows)))
cv.imshow('img', reflected_img)
cv.imwrite('reflection_out.jpg', reflected_img)
cv.waitKey(0)
cv.destroyAllWindows()
