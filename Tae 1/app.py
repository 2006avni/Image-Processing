from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os
import base64
import io
import time
import math

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------
# FOLDERS
# ---------------------------------------------------------

UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)


# ---------------------------------------------------------
# HOME / TEST
# ---------------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Morphological Image Processing Python Backend is running",
        "api": "/api/process"
    })


@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({
        "status": "success",
        "message": "Backend connected successfully"
    })


# ---------------------------------------------------------
# IMAGE DECODING
# ---------------------------------------------------------

def decode_image(file):
    """
    Read uploaded image and convert it into OpenCV format.
    """

    data = file.read()

    if not data:
        return None

    image_array = np.frombuffer(data, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    return image


# ---------------------------------------------------------
# IMAGE TO BASE64
# ---------------------------------------------------------

def image_to_base64(image):
    """
    Convert OpenCV image to Base64 so that
    JavaScript can display it directly.
    """

    success, buffer = cv2.imencode(".png", image)

    if not success:
        return None

    encoded = base64.b64encode(buffer).decode("utf-8")

    return "data:image/png;base64," + encoded


# ---------------------------------------------------------
# GRAYSCALE
# ---------------------------------------------------------

def convert_grayscale(image):

    if len(image.shape) == 2:
        return image

    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


# ---------------------------------------------------------
# ADD NOISE
# ---------------------------------------------------------

def add_noise(image, noise_type):

    result = image.copy()

    # -------------------------
    # NO NOISE
    # -------------------------

    if noise_type == "none":
        return result

    # -------------------------
    # SALT AND PEPPER
    # -------------------------

    if noise_type == "saltpepper":

        noisy = result.copy()

        amount = 0.03

        number_of_pixels = int(amount * image.size)

        # Salt
        coords = [
            np.random.randint(0, i - 1, number_of_pixels)
            for i in image.shape
        ]

        if len(image.shape) == 2:
            noisy[coords[0], coords[1]] = 255
        else:
            noisy[coords[0], coords[1]] = 255

        # Pepper
        coords = [
            np.random.randint(0, i - 1, number_of_pixels)
            for i in image.shape
        ]

        if len(image.shape) == 2:
            noisy[coords[0], coords[1]] = 0
        else:
            noisy[coords[0], coords[1]] = 0

        return noisy

    # -------------------------
    # GAUSSIAN NOISE
    # -------------------------

    if noise_type == "gaussian":

        mean = 0
        sigma = 20

        gaussian = np.random.normal(
            mean,
            sigma,
            image.shape
        ).astype(np.float32)

        noisy = image.astype(np.float32) + gaussian

        noisy = np.clip(noisy, 0, 255)

        return noisy.astype(np.uint8)

    # -------------------------
    # SPECKLE NOISE
    # -------------------------

    if noise_type == "speckle":

        random_noise = np.random.randn(*image.shape)

        noisy = image + image * random_noise * 0.15

        noisy = np.clip(noisy, 0, 255)

        return noisy.astype(np.uint8)

    return result


# ---------------------------------------------------------
# FILTERS
# ---------------------------------------------------------

def apply_filter(image, filter_type, kernel_size):

    # Ensure odd kernel
    if kernel_size % 2 == 0:
        kernel_size += 1

    # -------------------------
    # MORPHOLOGICAL
    # -------------------------

    if filter_type == "morphological":
        return image

    # -------------------------
    # MEDIAN
    # -------------------------

    if filter_type == "median":

        return cv2.medianBlur(
            image,
            kernel_size
        )

    # -------------------------
    # GAUSSIAN
    # -------------------------

    if filter_type == "gaussian":

        return cv2.GaussianBlur(
            image,
            (kernel_size, kernel_size),
            0
        )

    # -------------------------
    # MEAN
    # -------------------------

    if filter_type == "mean":

        return cv2.blur(
            image,
            (kernel_size, kernel_size)
        )

    return image


# ---------------------------------------------------------
# MORPHOLOGICAL OPENING
# ---------------------------------------------------------

def morphological_opening(image, kernel_size):

    kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (kernel_size, kernel_size)
    )

    # Opening = Erosion -> Dilation

    erosion = cv2.erode(
        image,
        kernel,
        iterations=1
    )

    opening = cv2.dilate(
        erosion,
        kernel,
        iterations=1
    )

    return opening


# ---------------------------------------------------------
# MORPHOLOGICAL CLOSING
# ---------------------------------------------------------

def morphological_closing(image, kernel_size):

    kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (kernel_size, kernel_size)
    )

    # Closing = Dilation -> Erosion

    dilation = cv2.dilate(
        image,
        kernel,
        iterations=1
    )

    closing = cv2.erode(
        dilation,
        kernel,
        iterations=1
    )

    return closing


# ---------------------------------------------------------
# MSE
# ---------------------------------------------------------

def calculate_mse(original, processed):

    original = original.astype(np.float32)
    processed = processed.astype(np.float32)

    mse = np.mean(
        (original - processed) ** 2
    )

    return float(mse)


# ---------------------------------------------------------
# MAE
# ---------------------------------------------------------

def calculate_mae(original, processed):

    original = original.astype(np.float32)
    processed = processed.astype(np.float32)

    mae = np.mean(
        np.abs(original - processed)
    )

    return float(mae)


# ---------------------------------------------------------
# PSNR
# ---------------------------------------------------------

def calculate_psnr(mse):

    if mse == 0:
        return 100.0

    psnr = 10 * math.log10(
        (255 ** 2) / mse
    )

    return float(psnr)


# ---------------------------------------------------------
# SSIM
# ---------------------------------------------------------

def calculate_ssim(original, processed):

    original = original.astype(np.float64)
    processed = processed.astype(np.float64)

    C1 = (0.01 * 255) ** 2
    C2 = (0.03 * 255) ** 2

    mu1 = cv2.GaussianBlur(
        original,
        (11, 11),
        1.5
    )

    mu2 = cv2.GaussianBlur(
        processed,
        (11, 11),
        1.5
    )

    mu1_sq = mu1 * mu1
    mu2_sq = mu2 * mu2
    mu1_mu2 = mu1 * mu2

    sigma1_sq = cv2.GaussianBlur(
        original * original,
        (11, 11),
        1.5
    ) - mu1_sq

    sigma2_sq = cv2.GaussianBlur(
        processed * processed,
        (11, 11),
        1.5
    ) - mu2_sq

    sigma12 = cv2.GaussianBlur(
        original * processed,
        (11, 11),
        1.5
    ) - mu1_mu2

    numerator = (
        (2 * mu1_mu2 + C1) *
        (2 * sigma12 + C2)
    )

    denominator = (
        (mu1_sq + mu2_sq + C1) *
        (sigma1_sq + sigma2_sq + C2)
    )

    ssim_map = numerator / (denominator + 1e-10)

    return float(np.mean(ssim_map))


# ---------------------------------------------------------
# ACCURACY
# ---------------------------------------------------------

def calculate_accuracy(original, processed):

    original = original.astype(np.float32)
    processed = processed.astype(np.float32)

    difference = np.abs(
        original - processed
    )

    similarity = 1 - (
        np.mean(difference) / 255
    )

    accuracy = similarity * 100

    return float(max(0, min(100, accuracy)))


# ---------------------------------------------------------
# HISTOGRAM
# ---------------------------------------------------------

def calculate_histogram(image):

    gray = convert_grayscale(image)

    histogram = cv2.calcHist(
        [gray],
        [0],
        None,
        [256],
        [0, 256]
    )

    histogram = histogram.flatten()

    return [
        int(value)
        for value in histogram
    ]


# ---------------------------------------------------------
# PROCESS ONE IMAGE
# ---------------------------------------------------------

def process_single_image(
    image,
    operation,
    filter_type,
    noise_type,
    kernel_size
):

    start_time = time.time()

    # Convert to grayscale
    gray = convert_grayscale(image)

    # Add noise
    noisy = add_noise(
        gray,
        noise_type
    )

    # Apply selected filter
    filtered = apply_filter(
        noisy,
        filter_type,
        kernel_size
    )

    # Morphological operation
    if operation == "opening":

        processed = morphological_opening(
            filtered,
            kernel_size
        )

    elif operation == "closing":

        processed = morphological_closing(
            filtered,
            kernel_size
        )

    else:

        raise ValueError(
            "Invalid operation. Use opening or closing."
        )

    # Metrics
    mse = calculate_mse(
        gray,
        processed
    )

    mae = calculate_mae(
        gray,
        processed
    )

    psnr = calculate_psnr(mse)

    ssim = calculate_ssim(
        gray,
        processed
    )

    accuracy = calculate_accuracy(
        gray,
        processed
    )

    processing_time = (
        time.time() - start_time
    ) * 1000

    return {
        "processed": processed,
        "histogram_original": calculate_histogram(gray),
        "histogram_processed": calculate_histogram(processed),
        "metrics": {
            "accuracy": round(accuracy, 2),
            "psnr": round(psnr, 2),
            "mse": round(mse, 4),
            "mae": round(mae, 4),
            "ssim": round(ssim, 4),
            "processingTime": round(
                processing_time,
                2
            )
        }
    }


# ---------------------------------------------------------
# PROCESS API
# ---------------------------------------------------------

@app.route(
    "/api/process",
    methods=["POST"]
)
def process_images():

    try:

        # -------------------------
        # CHECK FILES
        # -------------------------

        if "images" not in request.files:

            return jsonify({
                "status": "error",
                "message": "No images uploaded."
            }), 400

        files = request.files.getlist("images")

        if len(files) < 5:

            return jsonify({
                "status": "error",
                "message": "Please upload minimum 5 images."
            }), 400

        # -------------------------
        # GET SETTINGS
        # -------------------------

        operation = request.form.get(
            "operation",
            "opening"
        )

        filter_type = request.form.get(
            "filter",
            "morphological"
        )

        noise_type = request.form.get(
            "noise",
            "none"
        )

        kernel_size = int(
            request.form.get(
                "kernel",
                3
            )
        )

        # Validate operation
        if operation not in [
            "opening",
            "closing"
        ]:

            return jsonify({
                "status": "error",
                "message": "Invalid operation."
            }), 400

        # Validate filter
        allowed_filters = [
            "morphological",
            "median",
            "gaussian",
            "mean"
        ]

        if filter_type not in allowed_filters:

            return jsonify({
                "status": "error",
                "message": "Invalid filter."
            }), 400

        # Validate noise
        allowed_noise = [
            "none",
            "saltpepper",
            "gaussian",
            "speckle"
        ]

        if noise_type not in allowed_noise:

            return jsonify({
                "status": "error",
                "message": "Invalid noise type."
            }), 400

        # Validate kernel
        if kernel_size not in [
            3,
            5,
            7,
            9
        ]:

            return jsonify({
                "status": "error",
                "message": "Kernel size must be 3, 5, 7 or 9."
            }), 400

        results = []

        # -------------------------
        # PROCESS EACH IMAGE
        # -------------------------

        for index, file in enumerate(files):

            if file.filename == "":
                continue

            image = decode_image(file)

            if image is None:

                continue

            # Save uploaded image
            safe_name = (
                f"{index}_"
                + file.filename.replace(
                    " ",
                    "_"
                )
            )

            upload_path = os.path.join(
                UPLOAD_FOLDER,
                safe_name
            )

            cv2.imwrite(
                upload_path,
                image
            )

            # Process
            output = process_single_image(
                image,
                operation,
                filter_type,
                noise_type,
                kernel_size
            )

            processed = output["processed"]

            # Save processed image
            processed_name = (
                f"processed_{index}.png"
            )

            processed_path = os.path.join(
                PROCESSED_FOLDER,
                processed_name
            )

            cv2.imwrite(
                processed_path,
                processed
            )

            # Convert images to Base64
            original_base64 = image_to_base64(
                convert_grayscale(image)
            )

            processed_base64 = image_to_base64(
                processed
            )

            # Add result
            results.append({

                "imageName": file.filename,

                "originalImage":
                    original_base64,

                "processedImage":
                    processed_base64,

                "downloadUrl":
                    f"/api/download/{processed_name}",

                "operation":
                    operation,

                "filter":
                    filter_type,

                "noise":
                    noise_type,

                "kernel":
                    kernel_size,

                "histogram": {

                    "original":
                        output["histogram_original"],

                    "processed":
                        output["histogram_processed"]
                },

                "metrics":
                    output["metrics"]
            })

        # -------------------------
        # AVERAGE METRICS
        # -------------------------

        if len(results) > 0:

            average_accuracy = np.mean([
                r["metrics"]["accuracy"]
                for r in results
            ])

            average_psnr = np.mean([
                r["metrics"]["psnr"]
                for r in results
            ])

            average_mse = np.mean([
                r["metrics"]["mse"]
                for r in results
            ])

            average_mae = np.mean([
                r["metrics"]["mae"]
                for r in results
            ])

            average_ssim = np.mean([
                r["metrics"]["ssim"]
                for r in results
            ])

            average_time = np.mean([
                r["metrics"]["processingTime"]
                for r in results
            ])

        else:

            return jsonify({
                "status": "error",
                "message": "No valid images found."
            }), 400

        # -------------------------
        # FINAL RESPONSE
        # -------------------------

        return jsonify({

            "status": "success",

            "message":
                "Images processed successfully.",

            "totalImages":
                len(results),

            "settings": {

                "operation":
                    operation,

                "filter":
                    filter_type,

                "noise":
                    noise_type,

                "kernel":
                    kernel_size
            },

            "averageMetrics": {

                "accuracy":
                    round(
                        float(average_accuracy),
                        2
                    ),

                "psnr":
                    round(
                        float(average_psnr),
                        2
                    ),

                "mse":
                    round(
                        float(average_mse),
                        4
                    ),

                "mae":
                    round(
                        float(average_mae),
                        4
                    ),

                "ssim":
                    round(
                        float(average_ssim),
                        4
                    ),

                "processingTime":
                    round(
                        float(average_time),
                        2
                    )
            },

            "results":
                results

        })

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({

            "status": "error",

            "message":
                str(e)

        }), 500


# ---------------------------------------------------------
# DOWNLOAD PROCESSED IMAGE
# ---------------------------------------------------------

@app.route(
    "/api/download/<filename>",
    methods=["GET"]
)
def download_image(filename):

    path = os.path.join(
        PROCESSED_FOLDER,
        filename
    )

    if not os.path.exists(path):

        return jsonify({
            "status": "error",
            "message": "File not found."
        }), 404

    return send_file(
        path,
        as_attachment=True
    )


# ---------------------------------------------------------
# RUN SERVER
# ---------------------------------------------------------

if __name__ == "__main__":

    print("=" * 60)
    print("Morphological Image Processing Backend")
    print("=" * 60)
    print("Server: http://localhost:5000")
    print("Test:   http://localhost:5000/api/test")
    print("Process: http://localhost:5000/api/process")
    print("=" * 60)

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )