import cv2
import os
from collections import defaultdict
def rle_encode(data):
    """Run Length Encode a 1D list of values."""
    encoding = []
    prev = data[0]
    count = 1
    for pixel in data[1:]:
        if pixel == prev:
            count += 1
        else:
            encoding.append((prev, count))
            prev = pixel
            count = 1
    encoding.append((prev, count))
    return encoding

def rle_decode(encoding):
    """Run Length Decode back to original data."""
    data = []
    for value, count in encoding:
        data.extend([value] * count)
    return data
def lzw_compress(uncompressed):
    """Compress a list of integers using LZW."""
    # Build the dictionary.
    dict_size = 256
    dictionary = {bytes([i]): i for i in range(dict_size)}
    w = b""
    compressed = []

    for k in uncompressed:
        c = bytes([k])
        wc = w + c
        if wc in dictionary:
            w = wc
        else:
            compressed.append(dictionary[w])
            dictionary[wc] = dict_size
            dict_size += 1
            w = c
    if w:
        compressed.append(dictionary[w])
    return compressed

def lzw_decompress(compressed):
    """Decompress LZW output."""
    dict_size = 256
    dictionary = {i: bytes([i]) for i in range(dict_size)}
    w = bytes([compressed.pop(0)])
    result = bytearray(w)
    for k in compressed:
        if k in dictionary:
            entry = dictionary[k]
        elif k == dict_size:
            entry = w + w[:1]
        else:
            raise ValueError("Bad compressed k: %s" % k)
        result += entry
        dictionary[dict_size] = w + entry[:1]
        dict_size += 1
        w = entry
    return list(result)
image_path = 'img.jpg'
img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
if img is None:
    raise FileNotFoundError("Image not found.")
pixels = img.flatten().tolist()
rle_encoded = rle_encode(pixels)
rle_size_bytes = len(rle_encoded) * 2
rle_decoded = rle_decode(rle_encoded)
assert rle_decoded == pixels, "RLE decompression failed!"
lzw_encoded = lzw_compress(pixels)
lzw_size_bytes = len(lzw_encoded) * 2
lzw_decoded = lzw_decompress(lzw_encoded.copy())
assert lzw_decoded == pixels, "LZW decompression failed!"
original_size_bytes = len(pixels)  # one byte per pixel
rle_ratio = original_size_bytes / rle_size_bytes if rle_size_bytes else 0
lzw_ratio = original_size_bytes / lzw_size_bytes if lzw_size_bytes else 0
print("Original Image Size (approx):", original_size_bytes, "bytes")
print("RLE Compressed Size (approx):", rle_size_bytes, "bytes")
print("LZW Compressed Size (approx):", lzw_size_bytes, "bytes")
print(f"RLE Compression Ratio: {rle_ratio:.2f}:1")
print(f"LZW Compression Ratio: {lzw_ratio:.2f}:1")
cv2.imshow("Original Image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
