import cv2
import numpy as np
import matplotlib.pyplot as plt
# Base clean image (gray background + circle)
img = np.ones((256, 256), dtype=np.uint8) * 127
cv2.circle(img, (128, 128), 60, 200, -1)
# Add Gaussian noise
noise = np.random.normal(0, 25, img.shape).astype(np.int16)
gaussian_noisy = cv2.add(img.astype(np.int16), noise, dtype=cv2.CV_8U)
cv2.imwrite("noisy_gaussian.png", gaussian_noisy)
plt.imshow(gaussian_noisy, cmap="gray")
plt.title("Gaussian Noisy Image")
plt.axis("off")
plt.show()
