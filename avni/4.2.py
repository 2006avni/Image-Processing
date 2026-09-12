import cv2
import matplotlib.pyplot as plt
import numpy as np
image = cv2.imread('tomato.jpg')
brightness = 10
contrast = 2.3
image2 = cv2.convertScaleAbs(image, alpha=contrast, beta=brightness)
cv2.imwrite('modified_image.jpg', image2)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
image2_rgb = cv2.cvtColor(image2, cv2.COLOR_BGR2RGB)
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.title("Original")
plt.imshow(image_rgb)
plt.axis('off')
plt.subplot(1, 2, 2)
plt.title("Brightness & Contrast")
plt.imshow(image2_rgb)
plt.axis('off')
plt.show()
