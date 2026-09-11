from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import os
import uuid
import json
import io
import zipfile

app = Flask(__name__)
CORS(app)

# ============================================================
# FOLDERS
# ============================================================

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "Image Processing Lab Backend is running!",
        "api": "/api/process"
    })


# ============================================================
# TEST
# ============================================================

@app.route("/api/test")
def test_api():
    return jsonify({
        "success": True,
        "message": "API is working successfully!"
    })


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_parameters():
    """
    Read parameters sent by JavaScript.
    """
    parameters = request.form.get("parameters", "{}")

    try:
        return json.loads(parameters)
    except:
        return {}


def get_int(parameters, key, default):
    try:
        return int(float(parameters.get(key, default)))
    except:
        return default


def get_float(parameters, key, default):
    try:
        return float(parameters.get(key, default))
    except:
        return default


def save_image(image, filename):
    path = os.path.join(
        OUTPUT_FOLDER,
        filename
    )

    success = cv2.imwrite(path, image)

    if not success:
        raise Exception("Could not save processed image.")

    return path


# ============================================================
# IMAGE PROCESSING API
# ============================================================

@app.route("/api/process", methods=["POST"])
def process_image():

    try:

        # ----------------------------------------------------
        # CHECK IMAGE
        # ----------------------------------------------------

        if "image" not in request.files:

            return jsonify({
                "success": False,
                "message": "No image uploaded."
            }), 400

        file = request.files["image"]

        if file.filename == "":

            return jsonify({
                "success": False,
                "message": "No image selected."
            }), 400


        # ----------------------------------------------------
        # GET FORM DATA
        # ----------------------------------------------------

        practical = request.form.get(
            "practical",
            ""
        )

        operation = request.form.get(
            "operation",
            ""
        )

        parameters = get_parameters()


        # ----------------------------------------------------
        # READ IMAGE
        # ----------------------------------------------------

        file_bytes = np.frombuffer(
            file.read(),
            np.uint8
        )

        image = cv2.imdecode(
            file_bytes,
            cv2.IMREAD_COLOR
        )

        if image is None:

            return jsonify({
                "success": False,
                "message": "Invalid image file."
            }), 400


        # ----------------------------------------------------
        # ORIGINAL FILE
        # ----------------------------------------------------

        original_filename = (
            str(uuid.uuid4()) + "_original.jpg"
        )

        original_path = os.path.join(
            UPLOAD_FOLDER,
            original_filename
        )

        cv2.imwrite(
            original_path,
            image
        )


        # ----------------------------------------------------
        # DEFAULT PROCESSED IMAGE
        # ----------------------------------------------------

        processed = image.copy()


        # ====================================================
        # 1. IMAGE FORMAT & OPERATIONS
        # ====================================================

        # RGB → GRAYSCALE
        if operation in [
            "RGB → Grayscale",
            "RGB to Grayscale",
            "Grayscale"
        ]:

            processed = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2GRAY
            )


        # ----------------------------------------------------
        # ARITHMETIC OPERATIONS
        # ----------------------------------------------------

        elif operation == "Arithmetic Operations":

            value = get_int(
                parameters,
                "value",
                50
            )

            value = max(
                0,
                min(255, value)
            )

            arithmetic_type = parameters.get(
                "arithmeticOperation",
                "Addition"
            )

            if arithmetic_type == "Subtraction":

                processed = cv2.subtract(
                    image,
                    np.full_like(
                        image,
                        value
                    )
                )

            elif arithmetic_type == "Multiplication":

                processed = cv2.multiply(
                    image,
                    np.ones_like(
                        image,
                        dtype=np.float32
                    ),
                    scale=max(
                        0.1,
                        value / 50
                    )
                )

            elif arithmetic_type == "Division":

                divisor = max(
                    1,
                    value
                )

                processed = cv2.divide(
                    image,
                    np.full_like(
                        image,
                        divisor
                    )
                )

            else:

                processed = cv2.add(
                    image,
                    np.full_like(
                        image,
                        value
                    )
                )


        # ----------------------------------------------------
        # BITWISE OPERATIONS
        # ----------------------------------------------------

        elif operation == "Bitwise Operations":

            bitwise_type = parameters.get(
                "bitwiseOperation",
                "NOT"
            )

            if bitwise_type == "NOT":

                processed = cv2.bitwise_not(
                    image
                )

            else:

                # Create a mask/image for AND, OR, XOR
                mask = np.zeros_like(image)

                h, w = image.shape[:2]

                cv2.rectangle(
                    mask,
                    (0, 0),
                    (w, h),
                    (255, 255, 255),
                    -1
                )

                if bitwise_type == "AND":

                    processed = cv2.bitwise_and(
                        image,
                        mask
                    )

                elif bitwise_type == "OR":

                    processed = cv2.bitwise_or(
                        image,
                        mask
                    )

                elif bitwise_type == "XOR":

                    processed = cv2.bitwise_xor(
                        image,
                        mask
                    )


        # ====================================================
        # 2. 2-D GEOMETRIC TRANSFORMATIONS
        # ====================================================

        # ----------------------------------------------------
        # TRANSLATION
        # ----------------------------------------------------

        elif operation == "Translation":

            tx = get_int(
                parameters,
                "tx",
                100
            )

            ty = get_int(
                parameters,
                "ty",
                50
            )

            h, w = image.shape[:2]

            matrix = np.float32([
                [1, 0, tx],
                [0, 1, ty]
            ])

            processed = cv2.warpAffine(
                image,
                matrix,
                (w, h)
            )


        # ----------------------------------------------------
        # ROTATION
        # ----------------------------------------------------

        elif operation == "Rotation":

            angle = get_float(
                parameters,
                "angle",
                45
            )

            h, w = image.shape[:2]

            center = (
                w // 2,
                h // 2
            )

            matrix = cv2.getRotationMatrix2D(
                center,
                angle,
                1.0
            )

            processed = cv2.warpAffine(
                image,
                matrix,
                (w, h)
            )


        # ----------------------------------------------------
        # SCALING
        # ----------------------------------------------------

        elif operation == "Scaling":

            scale = get_float(
                parameters,
                "scale",
                1.5
            )

            scale = max(
                0.1,
                min(5.0, scale)
            )

            processed = cv2.resize(
                image,
                None,
                fx=scale,
                fy=scale,
                interpolation=cv2.INTER_LINEAR
            )


        # ----------------------------------------------------
        # SHEARING
        # ----------------------------------------------------

        elif operation == "Shearing":

            shear = get_float(
                parameters,
                "shear",
                0.3
            )

            h, w = image.shape[:2]

            matrix = np.float32([
                [1, shear, 0],
                [0, 1, 0]
            ])

            new_width = int(
                w + abs(shear * h)
            )

            processed = cv2.warpAffine(
                image,
                matrix,
                (new_width, h)
            )


        # ----------------------------------------------------
        # REFLECTION
        # ----------------------------------------------------

        elif operation == "Reflection":

            processed = cv2.flip(
                image,
                1
            )


        # ----------------------------------------------------
        # CROPPING
        # ----------------------------------------------------

        elif operation == "Cropping":

            h, w = image.shape[:2]

            x = get_int(
                parameters,
                "cropX",
                0
            )

            y = get_int(
                parameters,
                "cropY",
                0
            )

            crop_width = get_int(
                parameters,
                "cropWidth",
                min(300, w)
            )

            crop_height = get_int(
                parameters,
                "cropHeight",
                min(300, h)
            )

            x = max(
                0,
                min(x, w - 1)
            )

            y = max(
                0,
                min(y, h - 1)
            )

            x2 = min(
                w,
                x + crop_width
            )

            y2 = min(
                h,
                y + crop_height
            )

            processed = image[
                y:y2,
                x:x2
            ]


        # ====================================================
        # 3. IMAGE ENHANCEMENT
        # ====================================================

        # ----------------------------------------------------
        # HISTOGRAM EQUALIZATION
        # ----------------------------------------------------

        elif operation == "Histogram Equalization":

            gray = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2GRAY
            )

            processed = cv2.equalizeHist(
                gray
            )


        # ----------------------------------------------------
        # SMOOTHING
        # ----------------------------------------------------

        elif operation == "Smoothing":

            processed = cv2.blur(
                image,
                (5, 5)
            )


        # ----------------------------------------------------
        # SHARPENING
        # ----------------------------------------------------

        elif operation == "Sharpening":

            kernel = np.array([
                [0, -1, 0],
                [-1, 5, -1],
                [0, -1, 0]
            ])

            processed = cv2.filter2D(
                image,
                -1,
                kernel
            )


        # ----------------------------------------------------
        # THRESHOLDING
        # ----------------------------------------------------

        elif operation == "Thresholding":

            threshold = get_int(
                parameters,
                "threshold",
                127
            )

            threshold = max(
                0,
                min(255, threshold)
            )

            gray = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2GRAY
            )

            _, processed = cv2.threshold(
                gray,
                threshold,
                255,
                cv2.THRESH_BINARY
            )


        # ====================================================
        # 4. SPATIAL FILTERS
        # ====================================================

        # ----------------------------------------------------
        # AVERAGING
        # ----------------------------------------------------

        elif operation == "Averaging":

            processed = cv2.blur(
                image,
                (5, 5)
            )


        # ----------------------------------------------------
        # GAUSSIAN
        # ----------------------------------------------------

        elif operation == "Gaussian":

            processed = cv2.GaussianBlur(
                image,
                (5, 5),
                0
            )


        # ----------------------------------------------------
        # MEDIAN
        # ----------------------------------------------------

        elif operation == "Median":

            processed = cv2.medianBlur(
                image,
                5
            )


        # ----------------------------------------------------
        # BILATERAL
        # ----------------------------------------------------

        elif operation == "Bilateral":

            processed = cv2.bilateralFilter(
                image,
                9,
                75,
                75
            )


        # ====================================================
        # 5. IMAGE INPAINTING
        # ====================================================

        # ----------------------------------------------------
        # TELEA METHOD
        # ----------------------------------------------------

        elif operation == "Telea Method":

            # Automatically create a small mask
            # in the center of the image for demonstration.

            h, w = image.shape[:2]

            mask = np.zeros(
                (h, w),
                dtype=np.uint8
            )

            center_x = w // 2
            center_y = h // 2

            radius = max(
                5,
                min(h, w) // 20
            )

            cv2.circle(
                mask,
                (center_x, center_y),
                radius,
                255,
                -1
            )

            processed = cv2.inpaint(
                image,
                mask,
                3,
                cv2.INPAINT_TELEA
            )


        # ----------------------------------------------------
        # NAVIER-STOKES METHOD
        # ----------------------------------------------------

        elif operation == "Navier-Stokes (NS) Method":

            h, w = image.shape[:2]

            mask = np.zeros(
                (h, w),
                dtype=np.uint8
            )

            center_x = w // 2
            center_y = h // 2

            radius = max(
                5,
                min(h, w) // 20
            )

            cv2.circle(
                mask,
                (center_x, center_y),
                radius,
                255,
                -1
            )

            processed = cv2.inpaint(
                image,
                mask,
                3,
                cv2.INPAINT_NS
            )


        # ====================================================
        # 6. LOSSLESS COMPRESSION
        # ====================================================

        elif operation in [
            "Lossless Compression",
            "Compression Comparison"
        ]:

            # PNG is a lossless image format.
            # Save the image as PNG.

            filename = (
                str(uuid.uuid4()) +
                "_compressed.png"
            )

            output_path = os.path.join(
                OUTPUT_FOLDER,
                filename
            )

            success = cv2.imwrite(
                output_path,
                image,
                [
                    cv2.IMWRITE_PNG_COMPRESSION,
                    9
                ]
            )

            if not success:
                raise Exception(
                    "PNG compression failed."
                )

            original_size = os.path.getsize(
                original_path
            )

            compressed_size = os.path.getsize(
                output_path
            )

            percentage = 0

            if original_size > 0:

                percentage = (
                    (
                        original_size -
                        compressed_size
                    )
                    /
                    original_size
                ) * 100


            return jsonify({

                "success": True,

                "message":
                    "Lossless compression completed.",

                "practical":
                    practical,

                "operation":
                    operation,

                "original_size":
                    original_size,

                "processed_size":
                    compressed_size,

                "compression_percentage":
                    round(
                        percentage,
                        2
                    ),

                "download_url":
                    "/api/download/" +
                    filename
            })


        # ====================================================
        # 7. MORPHOLOGICAL OPERATIONS
        # ====================================================

        elif operation == "Erosion":

            kernel = np.ones(
                (5, 5),
                np.uint8
            )

            processed = cv2.erode(
                image,
                kernel,
                iterations=1
            )


        elif operation == "Dilation":

            kernel = np.ones(
                (5, 5),
                np.uint8
            )

            processed = cv2.dilate(
                image,
                kernel,
                iterations=1
            )


        elif operation == "Opening":

            kernel = np.ones(
                (5, 5),
                np.uint8
            )

            processed = cv2.morphologyEx(
                image,
                cv2.MORPH_OPEN,
                kernel
            )


        elif operation == "Closing":

            kernel = np.ones(
                (5, 5),
                np.uint8
            )

            processed = cv2.morphologyEx(
                image,
                cv2.MORPH_CLOSE,
                kernel
            )


        # ====================================================
        # 8. OBJECT DETECTION
        # ====================================================

        elif operation == "Correlation Principle":

            # Convert image to grayscale
            gray = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2GRAY
            )

            # Normalize correlation demonstration
            # using the image itself as the template.
            template = gray.copy()

            result = cv2.matchTemplate(
                gray,
                template,
                cv2.TM_CCOEFF_NORMED
            )

            min_val, max_val, min_loc, max_loc = \
                cv2.minMaxLoc(result)

            template_height, template_width = \
                template.shape[:2]

            top_left = max_loc

            bottom_right = (
                top_left[0] + template_width,
                top_left[1] + template_height
            )

            processed = image.copy()

            cv2.rectangle(
                processed,
                top_left,
                bottom_right,
                (0, 255, 0),
                3
            )

            cv2.putText(
                processed,
                f"Correlation: {max_val:.3f}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )


        # ====================================================
        # UNKNOWN OPERATION
        # ====================================================

        else:

            return jsonify({

                "success": False,

                "message":
                    f"Unsupported operation: {operation}"
            }), 400


        # ====================================================
        # SAVE PROCESSED IMAGE
        # ====================================================

        output_filename = (
            str(uuid.uuid4()) +
            "_processed.jpg"
        )

        output_path = save_image(
            processed,
            output_filename
        )


        # ====================================================
        # FILE SIZE
        # ====================================================

        original_size = os.path.getsize(
            original_path
        )

        processed_size = os.path.getsize(
            output_path
        )


        compression_percentage = 0

        if original_size > 0:

            compression_percentage = (
                (
                    original_size -
                    processed_size
                )
                /
                original_size
            ) * 100


        # ====================================================
        # RESPONSE
        # ====================================================

        return jsonify({

            "success": True,

            "message":
                "Image processed successfully.",

            "practical":
                practical,

            "operation":
                operation,

            "original_size":
                original_size,

            "processed_size":
                processed_size,

            "compression_percentage":
                round(
                    compression_percentage,
                    2
                ),

            "download_url":
                "/api/download/" +
                output_filename
        })


    except Exception as e:

        print(
            "Processing Error:",
            str(e)
        )

        return jsonify({

            "success": False,

            "message":
                str(e)

        }), 500


# ============================================================
# DOWNLOAD PROCESSED IMAGE
# ============================================================

@app.route(
    "/api/download/<filename>",
    methods=["GET"]
)
def download_image(filename):

    path = os.path.join(
        OUTPUT_FOLDER,
        filename
    )

    if not os.path.exists(path):

        return jsonify({

            "success": False,

            "message":
                "Processed file not found."
        }), 404


    return send_file(
        path,
        as_attachment=True
    )


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )