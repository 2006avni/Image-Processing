##Generate General Noisy Image (for Non-local Means)
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Base clean image (gray background + text)
img = np.ones((256, 256), dtype=np.uint8) * 180
cv2.putText(img, "TEST", (60, 150), cv2.FONT_HERSHEY_SIMPLEX, 2, 50, 5)

# Add mixed random noise
noise = np.random.randint(0, 50, img.shape, dtype=np.uint8)
noisy_img = cv2.add(img, noise)

cv2.imwrite("noisy_image.png", noisy_img)

plt.imshow(noisy_img, cmap="gray")
plt.title("General Noisy Image")
plt.axis("off")
plt.show()
