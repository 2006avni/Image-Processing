import cv2 as cv
img = cv.imread('girl.jpg', 0)
rows, cols = img.shape
img_shrinked = cv.resize(img, (250, 200),interpolation=cv.INTER_AREA)
cv.imshow('img', img_shrinked)
img_enlarged = cv.resize(img_shrinked, None,fx=1.5, fy=1.5,interpolation=cv.INTER_CUBIC)
cv.imshow('img', img_enlarged)
cv.waitKey(0)
cv.destroyAllWindows()
