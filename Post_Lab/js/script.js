document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // API CONFIGURATION
    // =====================================================

    const API_URL = "http://127.0.0.1:5000";

    // =====================================================
    // HTML ELEMENTS
    // =====================================================

    const imageInput = document.getElementById("imageInput");
    const practicalSelect = document.getElementById("practicalSelect");
    const operationSelect = document.getElementById("operationSelect");

    const parametersContainer =
        document.getElementById("parametersContainer");

    const applyBtn = document.getElementById("applyBtn");
    const resetBtn = document.getElementById("resetBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    const originalImage = document.getElementById("originalImage");
    const processedImage = document.getElementById("processedImage");

    const originalPlaceholder =
        document.getElementById("originalPlaceholder");

    const processedPlaceholder =
        document.getElementById("processedPlaceholder");

    const fileName = document.getElementById("fileName");

    const originalSize =
        document.getElementById("originalSize");

    const processedSize =
        document.getElementById("processedSize");

    const resultMessage =
        document.getElementById("resultMessage");

    const statusBadge =
        document.getElementById("statusBadge");

    const compressionPanel =
        document.getElementById("compressionPanel");

    const compressionPercentage =
        document.getElementById("compressionPercentage");

    // =====================================================
    // GLOBAL VARIABLES
    // =====================================================

    let selectedFile = null;
    let processedImageURL = null;

    console.log("JavaScript loaded successfully");
    console.log("Practical Select:", practicalSelect);
    console.log("Operation Select:", operationSelect);
    console.log("Parameters Container:", parametersContainer);

    // =====================================================
    // PRACTICALS AND OPERATIONS
    // =====================================================

    const operations = {

        // -------------------------------------------------
        // IMAGE FORMAT AND BASIC OPERATIONS
        // -------------------------------------------------

        format: [
            "RGB → Grayscale",
            "Arithmetic Operations",
            "Bitwise Operations"
        ],

        // -------------------------------------------------
        // GEOMETRIC TRANSFORMATIONS
        // -------------------------------------------------

        geometric: [
            "Translation",
            "Rotation",
            "Scaling",
            "Shearing",
            "Reflection",
            "Cropping"
        ],

        // -------------------------------------------------
        // IMAGE ENHANCEMENT
        // -------------------------------------------------

        enhancement: [
            "Histogram Equalization",
            "Smoothing",
            "Sharpening",
            "Thresholding"
        ],

        // -------------------------------------------------
        // SPATIAL FILTERS
        // -------------------------------------------------

        filters: [
            "Averaging",
            "Gaussian",
            "Median",
            "Bilateral"
        ],

        // -------------------------------------------------
        // IMAGE INPAINTING
        // -------------------------------------------------

        inpainting: [
            "Telea Method",
            "Navier-Stokes (NS) Method"
        ],

        // -------------------------------------------------
        // IMAGE COMPRESSION
        // -------------------------------------------------

        compression: [
            "Lossless Compression",
            "Compression Comparison"
        ],

        // -------------------------------------------------
        // MORPHOLOGICAL OPERATIONS
        // -------------------------------------------------

        morphology: [
            "Erosion",
            "Dilation",
            "Opening",
            "Closing"
        ],

        // -------------------------------------------------
        // OBJECT DETECTION
        // -------------------------------------------------

        detection: [
            "Correlation Principle"
        ],

        // -------------------------------------------------
        // NEW: COLOUR SPACE CONVERSION
        // -------------------------------------------------

        colour: [
            "RGB",
            "HSV",
            "YCrCb",
            "Lab"
        ],

        // -------------------------------------------------
        // NEW: EDGE DETECTION
        // -------------------------------------------------

        edges: [
            "Canny",
            "Sobel",
            "Prewitt"
        ]
    };

    // =====================================================
    // PRACTICAL SELECTION
    // =====================================================

    if (practicalSelect) {

        practicalSelect.addEventListener("change", function () {

            const practical = this.value;

            console.log("Selected practical:", practical);

            // Clear old operations
            operationSelect.innerHTML =
                '<option value="">-- Select Operation --</option>';

            // Clear old parameters
            if (parametersContainer) {
                parametersContainer.innerHTML = `
                    <p>Select an operation to view parameters.</p>
                `;
            }

            // Hide compression panel
            if (compressionPanel) {
                compressionPanel.classList.add("hidden");
            }

            // If no practical selected
            if (!practical) {
                return;
            }

            const operationList = operations[practical];

            console.log("Available operations:", operationList);

            if (operationList) {

                operationList.forEach(operation => {

                    const option =
                        document.createElement("option");

                    option.value = operation;
                    option.textContent = operation;

                    operationSelect.appendChild(option);

                });

            }

        });

    }

    // =====================================================
    // OPERATION SELECTION
    // =====================================================

    if (operationSelect) {

        operationSelect.addEventListener("change", function () {

            const operation = this.value;

            console.log("Selected operation:", operation);

            createParameters(operation);

        });

    }

    // =====================================================
    // CREATE PARAMETERS
    // =====================================================

    function createParameters(operation) {

        if (!parametersContainer) {
            return;
        }

        parametersContainer.innerHTML = "";

        // =================================================
        // RGB TO GRAYSCALE
        // =================================================

        if (operation === "RGB → Grayscale") {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>RGB → Grayscale</h4>
                    <p>
                        Converts the RGB image into a grayscale image.
                    </p>
                </div>
            `;

        }

        // =================================================
        // ARITHMETIC OPERATIONS
        // =================================================

        else if (operation === "Arithmetic Operations") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="arithmeticOperation">
                        Arithmetic Operation
                    </label>

                    <select id="arithmeticOperation">
                        <option value="Addition">Addition</option>
                        <option value="Subtraction">Subtraction</option>
                        <option value="Multiplication">Multiplication</option>
                        <option value="Division">Division</option>
                    </select>
                </div>

                <div class="parameter-row">
                    <label for="value">Value</label>

                    <input
                        type="number"
                        id="value"
                        value="50"
                        min="1"
                    >
                </div>
            `;

        }

        // =================================================
        // BITWISE OPERATIONS
        // =================================================

        else if (operation === "Bitwise Operations") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="bitwiseOperation">
                        Bitwise Operation
                    </label>

                    <select id="bitwiseOperation">
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                        <option value="XOR">XOR</option>
                        <option value="NOT">NOT</option>
                    </select>
                </div>
            `;

        }

        // =================================================
        // TRANSLATION
        // =================================================

        else if (operation === "Translation") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="tx">X Translation</label>

                    <input
                        type="number"
                        id="tx"
                        value="100"
                    >
                </div>

                <div class="parameter-row">
                    <label for="ty">Y Translation</label>

                    <input
                        type="number"
                        id="ty"
                        value="50"
                    >
                </div>
            `;

        }

        // =================================================
        // ROTATION
        // =================================================

        else if (operation === "Rotation") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="angle">Rotation Angle</label>

                    <input
                        type="number"
                        id="angle"
                        value="45"
                    >
                </div>
            `;

        }

        // =================================================
        // SCALING
        // =================================================

        else if (operation === "Scaling") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="scale">Scale Factor</label>

                    <input
                        type="number"
                        id="scale"
                        value="1.5"
                        min="0.1"
                        step="0.1"
                    >
                </div>
            `;

        }

        // =================================================
        // SHEARING
        // =================================================

        else if (operation === "Shearing") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="shear">Shear Factor</label>

                    <input
                        type="number"
                        id="shear"
                        value="0.3"
                        step="0.1"
                    >
                </div>
            `;

        }

        // =================================================
        // REFLECTION
        // =================================================

        else if (operation === "Reflection") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="reflectionDirection">
                        Reflection Direction
                    </label>

                    <select id="reflectionDirection">
                        <option value="Horizontal">Horizontal</option>
                        <option value="Vertical">Vertical</option>
                        <option value="Both">Both</option>
                    </select>
                </div>
            `;

        }

        // =================================================
        // CROPPING
        // =================================================

        else if (operation === "Cropping") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="cropX">X</label>

                    <input
                        type="number"
                        id="cropX"
                        value="0"
                        min="0"
                    >
                </div>

                <div class="parameter-row">
                    <label for="cropY">Y</label>

                    <input
                        type="number"
                        id="cropY"
                        value="0"
                        min="0"
                    >
                </div>

                <div class="parameter-row">
                    <label for="cropWidth">Width</label>

                    <input
                        type="number"
                        id="cropWidth"
                        value="300"
                        min="1"
                    >
                </div>

                <div class="parameter-row">
                    <label for="cropHeight">Height</label>

                    <input
                        type="number"
                        id="cropHeight"
                        value="300"
                        min="1"
                    >
                </div>
            `;

        }

        // =================================================
        // HISTOGRAM EQUALIZATION
        // =================================================

        else if (operation === "Histogram Equalization") {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>Histogram Equalization</h4>

                    <p>
                        Improves image contrast using histogram
                        equalization.
                    </p>
                </div>
            `;

        }

        // =================================================
        // SMOOTHING
        // =================================================

        else if (operation === "Smoothing") {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>Smoothing</h4>

                    <p>
                        Reduces noise and smooths the image.
                    </p>
                </div>
            `;

        }

        // =================================================
        // SHARPENING
        // =================================================

        else if (operation === "Sharpening") {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>Sharpening</h4>

                    <p>
                        Enhances edges and image details.
                    </p>
                </div>
            `;

        }

        // =================================================
        // THRESHOLDING
        // =================================================

        else if (operation === "Thresholding") {

            parametersContainer.innerHTML = `
                <div class="parameter-row">
                    <label for="threshold">
                        Threshold Value
                    </label>

                    <input
                        type="number"
                        id="threshold"
                        value="127"
                        min="0"
                        max="255"
                    >
                </div>
            `;

        }

        // =================================================
        // SPATIAL FILTERS
        // =================================================

        else if (
            operation === "Averaging" ||
            operation === "Gaussian" ||
            operation === "Median" ||
            operation === "Bilateral"
        ) {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>${operation} Filter</h4>

                    <p>
                        Applies the ${operation} spatial filter
                        using OpenCV.
                    </p>
                </div>
            `;

        }

        // =================================================
        // INPAINTING
        // =================================================

        else if (
            operation === "Telea Method" ||
            operation === "Navier-Stokes (NS) Method"
        ) {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>${operation}</h4>

                    <p>
                        Restores damaged image regions using
                        OpenCV inpainting.
                    </p>
                </div>
            `;

        }

        // =================================================
        // COMPRESSION
        // =================================================

        else if (
            operation === "Lossless Compression" ||
            operation === "Compression Comparison"
        ) {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>${operation}</h4>

                    <p>
                        Compares original and compressed image
                        file sizes.
                    </p>
                </div>
            `;

        }

        // =================================================
        // MORPHOLOGICAL OPERATIONS
        // =================================================

        else if (
            operation === "Erosion" ||
            operation === "Dilation" ||
            operation === "Opening" ||
            operation === "Closing"
        ) {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>${operation}</h4>

                    <p>
                        Applies morphological image processing
                        using OpenCV.
                    </p>
                </div>
            `;

        }

        // =================================================
        // OBJECT DETECTION
        // =================================================

        else if (operation === "Correlation Principle") {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>Correlation Principle</h4>

                    <p>
                        Detects matching regions using template
                        correlation.
                    </p>
                </div>
            `;

        }

        // =================================================
        // NEW: COLOUR SPACE CONVERSION
        // =================================================

        else if (
            operation === "RGB" ||
            operation === "HSV" ||
            operation === "YCrCb" ||
            operation === "Lab"
        ) {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>${operation} Colour Space</h4>

                    <p>
                        Converts the input image into the
                        ${operation} colour space.
                    </p>
                </div>
            `;

        }

        // =================================================
        // NEW: EDGE DETECTION
        // =================================================

        else if (
            operation === "Canny" ||
            operation === "Sobel" ||
            operation === "Prewitt"
        ) {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>${operation} Edge Detection</h4>

                    <p>
                        Detects edges and boundaries in the
                        input image using the ${operation}
                        operator.
                    </p>
                </div>
            `;

        }

    }

    // =====================================================
    // IMAGE UPLOAD
    // =====================================================

    if (imageInput) {

        imageInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) {
                return;
            }

            selectedFile = file;

            if (fileName) {
                fileName.textContent = file.name;
            }

            const imageURL =
                URL.createObjectURL(file);

            if (originalImage) {
                originalImage.src = imageURL;
                originalImage.style.display = "block";
            }

            if (originalPlaceholder) {
                originalPlaceholder.style.display = "none";
            }

            if (originalSize) {
                originalSize.textContent =
                    formatFileSize(file.size);
            }

            if (processedImage) {
                processedImage.src = "";
                processedImage.style.display = "none";
            }

            if (processedPlaceholder) {
                processedPlaceholder.style.display = "flex";
            }

            if (processedSize) {
                processedSize.textContent = "Size: —";
            }

            if (downloadBtn) {
                downloadBtn.disabled = true;
            }

            showMessage("Image uploaded successfully.");

        });

    }

    // =====================================================
    // GET PARAMETERS
    // =====================================================

    function getParameters() {

        const parameters = {};

        if (!parametersContainer) {
            return parameters;
        }

        const fields =
            parametersContainer.querySelectorAll("input, select");

        fields.forEach(field => {
            parameters[field.id] = field.value;
        });

        return parameters;
    }

    // =====================================================
    // APPLY IMAGE PROCESSING
    // =====================================================

    if (applyBtn) {

        applyBtn.addEventListener("click", async function () {

            if (!selectedFile) {
                showMessage("Please upload an image first.");
                return;
            }

            if (!practicalSelect.value) {
                showMessage("Please select a practical.");
                return;
            }

            if (!operationSelect.value) {
                showMessage("Please select an operation.");
                return;
            }

            try {

                applyBtn.disabled = true;
                applyBtn.textContent = "⏳ Processing...";

                if (statusBadge) {
                    statusBadge.textContent = "Processing";
                }

                const formData = new FormData();

                formData.append("image", selectedFile);

                formData.append(
                    "practical",
                    practicalSelect.value
                );

                formData.append(
                    "operation",
                    operationSelect.value
                );

                formData.append(
                    "parameters",
                    JSON.stringify(getParameters())
                );

                const response = await fetch(
                    `${API_URL}/api/process`,
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Processing failed."
                    );
                }

                processedImageURL =
                    `${API_URL}${data.download_url}`;

                if (processedImage) {
                    processedImage.src = processedImageURL;
                    processedImage.style.display = "block";
                }

                if (processedPlaceholder) {
                    processedPlaceholder.style.display = "none";
                }

                if (processedSize) {
                    processedSize.textContent =
                        formatFileSize(data.processed_size);
                }

                if (downloadBtn) {
                    downloadBtn.disabled = false;
                }

                // Compression information
                if (
                    data.original_size !== undefined &&
                    data.compressed_size !== undefined
                ) {

                    if (compressionPanel) {
                        compressionPanel.classList.remove("hidden");
                    }

                    const compressionOriginal =
                        document.getElementById("compressionOriginal");

                    const compressionCompressed =
                        document.getElementById("compressionCompressed");

                    const compressionSaved =
                        document.getElementById("compressionSaved");

                    const compressionRatio =
                        document.getElementById("compressionRatio");

                    if (compressionOriginal) {
                        compressionOriginal.textContent =
                            formatFileSize(data.original_size);
                    }

                    if (compressionCompressed) {
                        compressionCompressed.textContent =
                            formatFileSize(data.compressed_size);
                    }

                    if (compressionSaved) {
                        compressionSaved.textContent =
                            `${data.saved_percentage || 0}%`;
                    }

                    if (compressionRatio) {
                        compressionRatio.textContent =
                            data.compression_ratio || "—";
                    }

                    if (compressionPercentage) {
                        compressionPercentage.textContent =
                            `${data.saved_percentage || 0}%`;
                    }

                }

                if (statusBadge) {
                    statusBadge.textContent = "Completed";
                }

                showMessage("Image processed successfully.");

            }

            catch (error) {

                console.error("Processing Error:", error);

                if (statusBadge) {
                    statusBadge.textContent = "Error";
                }

                showMessage(
                    error.message ||
                    "Cannot connect to backend. Please start Flask server."
                );

            }

            finally {

                applyBtn.disabled = false;
                applyBtn.textContent = "▶ Apply";

            }

        });

    }

    // =====================================================
    // DOWNLOAD PROCESSED IMAGE
    // =====================================================

    if (downloadBtn) {

        downloadBtn.addEventListener("click", function () {

            if (!processedImageURL) {
                showMessage("No processed image available.");
                return;
            }

            const link = document.createElement("a");

            link.href = processedImageURL;
            link.download = "processed_image.png";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        });

    }

    // =====================================================
    // RESET
    // =====================================================

    if (resetBtn) {

        resetBtn.addEventListener("click", function () {

            selectedFile = null;
            processedImageURL = null;

            if (imageInput) {
                imageInput.value = "";
            }

            if (practicalSelect) {
                practicalSelect.value = "";
            }

            if (operationSelect) {
                operationSelect.innerHTML =
                    '<option value="">-- Select Operation --</option>';
            }

            if (parametersContainer) {
                parametersContainer.innerHTML = `
                    <p>Select an operation to view parameters.</p>
                `;
            }

            if (originalImage) {
                originalImage.src = "";
                originalImage.style.display = "none";
            }

            if (processedImage) {
                processedImage.src = "";
                processedImage.style.display = "none";
            }

            if (originalPlaceholder) {
                originalPlaceholder.style.display = "flex";
            }

            if (processedPlaceholder) {
                processedPlaceholder.style.display = "flex";
            }

            if (fileName) {
                fileName.textContent = "No image selected";
            }

            if (originalSize) {
                originalSize.textContent = "Size: —";
            }

            if (processedSize) {
                processedSize.textContent = "Size: —";
            }

            if (downloadBtn) {
                downloadBtn.disabled = true;
            }

            if (compressionPanel) {
                compressionPanel.classList.add("hidden");
            }

            if (statusBadge) {
                statusBadge.textContent = "Ready";
            }

            showMessage(
                "Select an image and practical to start."
            );

        });

    }

    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    function showMessage(message) {

        if (resultMessage) {
            resultMessage.textContent = message;
        }

    }

    // =====================================================
    // FORMAT FILE SIZE
    // =====================================================

    function formatFileSize(bytes) {

        if (
            bytes === undefined ||
            bytes === null ||
            isNaN(bytes)
        ) {
            return "—";
        }

        if (bytes === 0) {
            return "0 Bytes";
        }

        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];

        const index = Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

        return (
            (bytes / Math.pow(1024, index)).toFixed(2)
            + " "
            + units[index]
        );

    }

    // =====================================================
    // INITIAL MESSAGE
    // =====================================================

    showMessage(
        "Select an image and practical to start."
    );

    console.log(
        "Image Processing Lab initialized successfully"
    );

});