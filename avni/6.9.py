##Generate Scratched Image (for Inpainting)
import cv2
import numpy as np
import matplotlib.pyplot as plt
# Base clean image (gray background + text)
img = np.ones((256, 256), dtype=np.uint8) * 200
cv2.putText(img, "CAT", (70, 140), cv2.FONT_HERSHEY_SIMPLEX, 2, 50, 5)
# Add scratches (black lines)
scratched = img.copy()
cv2.line(scratched, (30, 100), (220, 120), 0, 3)
cv2.line(scratched, (100, 30), (120, 220), 0, 3)
cv2.imwrite("scratched.png", scratched)
plt.imshow(scratched, cmap="gray")
plt.title("Scratched Image")
plt.axis("off")
plt.show()
