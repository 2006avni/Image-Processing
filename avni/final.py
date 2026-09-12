import cv2
import numpy as np
import matplotlib.pyplot as plt

# Read the input image
image = cv2.imread("text_image.jpeg")

# Check if image is loaded
if image is None:
    print("Error: Image not found!")
    exit()

# Convert image to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Convert image to binary using thresholding
_, binary = cv2.threshold(
    gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
)

# Create a morphological kernel
kernel = np.ones((3, 3), np.uint8)

# -------------------------------
# MORPHOLOGICAL OPENING
# -------------------------------
# Opening = Erosion followed by Dilation
opening = cv2.morphologyEx(
    binary,
    cv2.MORPH_OPEN,
    kernel,
    iterations=1
)

# -------------------------------
# MORPHOLOGICAL CLOSING
# -------------------------------
# Closing = Dilation followed by Erosion
closing = cv2.morphologyEx(
    binary,
    cv2.MORPH_CLOSE,
    kernel,
    iterations=1
)

# Display results
plt.figure(figsize=(12, 8))

plt.subplot(2, 2, 1)
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.title("Original Image")
plt.axis("off")

plt.subplot(2, 2, 2)
plt.imshow(binary, cmap="gray")
plt.title("Binary Image")
plt.axis("off")

plt.subplot(2, 2, 3)
plt.imshow(opening, cmap="gray")
plt.title("Morphological Opening")
plt.axis("off")

plt.subplot(2, 2, 4)
plt.imshow(closing, cmap="gray")
plt.title("Morphological Closing")
plt.axis("off")

plt.tight_layout()
plt.show()

# Save output images
cv2.imwrite("binary_text.png", binary)
cv2.imwrite("opening_text.png", opening)
cv2.imwrite("closing_text.png", closing)

print("Processing completed successfully!")
print("Opening and closing images saved.")