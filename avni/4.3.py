import cv2
import matplotlib.pyplot as plt
import numpy as np
image = cv2.imread('tomato.jpg')
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
kernel = np.array([[0, -1, 0],
                   [-1, 5, -1],
                   [0, -1, 0]])
sharpened_image_rgb = cv2.filter2D(image_rgb, -1, kernel)
sharpened_image_bgr = cv2.cvtColor(sharpened_image_rgb, cv2.COLOR_RGB2BGR)
cv2.imwrite('sharpened_image.jpg', sharpened_image_bgr)
plt.subplot(1, 2, 1)
plt.title("Original")
plt.imshow(image_rgb)
plt.subplot(1, 2, 2)
plt.title("Sharpening")
plt.imshow(sharpened_image_rgb)
plt.show()
