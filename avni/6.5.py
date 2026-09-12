import cv2
import numpy as np
import matplotlib.pyplot as plt
# Read scratched/damaged image
img = cv2.imread("scratched.png", 0)
# Create mask (white = damaged parts)
mask = np.zeros(img.shape, np.uint8)
mask[50:80, 50:150] = 255   # Example damaged area
# Inpaint damaged regions
restored = cv2.inpaint(img, mask, 3, cv2.INPAINT_TELEA)

# Show results
plt.subplot(1, 3, 1), plt.imshow(img, cmap='gray'), plt.title("Damaged Image")
plt.subplot(1, 3, 2), plt.imshow(mask, cmap='gray'), plt.title("Mask")
plt.subplot(1, 3, 3), plt.imshow(restored, cmap='gray'), plt.title("Restored (Inpainting)")
plt.show()
