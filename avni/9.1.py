import cv2
import numpy as np
def detect_object(template_path, input_image_path):
    template = cv2.imread(template_path, 0)
    img = cv2.imread(input_image_path)
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    w, h = template.shape[::-1]
    res = cv2.matchTemplate(gray_img, template, cv2.TM_CCOEFF_NORMED)
    threshold = 0.8
    loc = np.where(res >= threshold)
    for pt in zip(*loc[::-1]):
        cv2.rectangle(img, pt, (pt[0] + w, pt[1] + h), (0, 255, 255), 2)
    cv2.imshow('Detected Objects', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
template_path = "i1.jpg"
input_image_path = "Animals.jpg"
detect_object(template_path, input_image_path)