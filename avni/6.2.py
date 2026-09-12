import cv2
import matplotlib.pyplot as plt
# Read noisy image
img = cv2.imread("Noisy-image-Gaussian-noise-with-mean-and-variance-0005.png", 0)  # grayscale
# Apply Gaussian Blur
restored = cv2.GaussianBlur(img, (5, 5), 0)
# Show results
plt.subplot(1, 2, 1), plt.imshow(img, cmap='gray'), plt.title("Gaussian Noisy")
plt.subplot(1, 2, 2), plt.imshow(restored, cmap='gray'), plt.title("Restored (Gaussian Blur)")
plt.show()
