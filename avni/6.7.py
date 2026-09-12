##Generate Salt & Pepper Noise Image
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Base clean image (gray background + rectangle)
img = np.ones((256, 256), dtype=np.uint8) * 127
cv2.rectangle(img, (60, 60), (200, 200), 200, -1)
# Add Salt & Pepper noise
s_p_img = img.copy()
num_noise = 2000  # number of noise pixels
# Salt
coords = [np.random.randint(0, i-1, num_noise) for i in img.shape]
s_p_img[coords] = 255
# Pepper
coords = [np.random.randint(0, i-1, num_noise) for i in img.shape]
s_p_img[coords] = 0
cv2.imwrite("noisy_salt_pepper.png", s_p_img)
plt.imshow(s_p_img, cmap="gray")
plt.title("Salt & Pepper Noise")
plt.axis("off")
plt.show()
