document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://127.0.0.1:5000";

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
    // CHECK HTML ELEMENTS
    // =====================================================

    console.log("JavaScript loaded");

    console.log("Practical:", practicalSelect);
    console.log("Operation:", operationSelect);
    console.log("Parameters:", parametersContainer);


    // =====================================================
    // PRACTICALS + OPERATIONS
    // =====================================================

    const operations = {

        format: [
            "RGB → Grayscale",
            "Arithmetic Operations",
            "Bitwise Operations"
        ],

        geometric: [
            "Translation",
            "Rotation",
            "Scaling",
            "Shearing",
            "Reflection",
            "Cropping"
        ],

        enhancement: [
            "Histogram Equalization",
            "Smoothing",
            "Sharpening",
            "Thresholding"
        ],

        filters: [
            "Averaging",
            "Gaussian",
            "Median",
            "Bilateral"
        ],

        inpainting: [
            "Telea Method",
            "Navier-Stokes (NS) Method"
        ],

        compression: [
            "Lossless Compression",
            "Compression Comparison"
        ],

        morphology: [
            "Erosion",
            "Dilation",
            "Opening",
            "Closing"
        ],

        detection: [
            "Correlation Principle"
        ]

    };


    // =====================================================
    // SELECT PRACTICAL
    // =====================================================

    practicalSelect.addEventListener("change", function () {

        const practical = this.value;

        console.log("Selected practical:", practical);

        // Clear operation dropdown
        operationSelect.innerHTML =
            '<option value="">-- Select Operation --</option>';

        // Clear parameters
        if (parametersContainer) {

            parametersContainer.innerHTML = `
                <p>Select an operation to view parameters.</p>
            `;

        }


        // If nothing selected
        if (!practical) {
            return;
        }


        // Get operations
        const operationList = operations[practical];

        console.log("Operations:", operationList);


        // Add operations
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


    // =====================================================
    // SELECT OPERATION
    // =====================================================

    operationSelect.addEventListener("change", function () {

        const operation = this.value;

        console.log("Selected operation:", operation);

        createParameters(operation);

    });


    // =====================================================
    // CREATE PARAMETERS
    // =====================================================

    function createParameters(operation) {

        if (!parametersContainer) {
            return;
        }

        parametersContainer.innerHTML = "";


        // -------------------------------------------------
        // RGB TO GRAYSCALE
        // -------------------------------------------------

        if (operation === "RGB → Grayscale") {

            parametersContainer.innerHTML = `
                <div class="parameter-info">
                    <h4>RGB → Grayscale</h4>
                    <p>
                        Converts the RGB image into grayscale.
                    </p>
                </div>
            `;

        }


        // -------------------------------------------------
        // ARITHMETIC
        // -------------------------------------------------

        else if (operation === "Arithmetic Operations") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>Arithmetic Operation</label>

                    <select id="arithmeticOperation">

                        <option value="Addition">
                            Addition
                        </option>

                        <option value="Subtraction">
                            Subtraction
                        </option>

                        <option value="Multiplication">
                            Multiplication
                        </option>

                        <option value="Division">
                            Division
                        </option>

                    </select>

                </div>


                <div class="parameter-row">

                    <label>Value</label>

                    <input
                        type="number"
                        id="value"
                        value="50"
                        min="1"
                    >

                </div>

            `;

        }


        // -------------------------------------------------
        // BITWISE
        // -------------------------------------------------

        else if (operation === "Bitwise Operations") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>Bitwise Operation</label>

                    <select id="bitwiseOperation">

                        <option value="AND">AND</option>

                        <option value="OR">OR</option>

                        <option value="XOR">XOR</option>

                        <option value="NOT">NOT</option>

                    </select>

                </div>

            `;

        }


        // -------------------------------------------------
        // TRANSLATION
        // -------------------------------------------------

        else if (operation === "Translation") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>X Translation</label>

                    <input
                        type="number"
                        id="tx"
                        value="100"
                    >

                </div>


                <div class="parameter-row">

                    <label>Y Translation</label>

                    <input
                        type="number"
                        id="ty"
                        value="50"
                    >

                </div>

            `;

        }


        // -------------------------------------------------
        // ROTATION
        // -------------------------------------------------

        else if (operation === "Rotation") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>Rotation Angle</label>

                    <input
                        type="number"
                        id="angle"
                        value="45"
                    >

                </div>

            `;

        }


        // -------------------------------------------------
        // SCALING
        // -------------------------------------------------

        else if (operation === "Scaling") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>Scale Factor</label>

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


        // -------------------------------------------------
        // SHEARING
        // -------------------------------------------------

        else if (operation === "Shearing") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>Shear Factor</label>

                    <input
                        type="number"
                        id="shear"
                        value="0.3"
                        step="0.1"
                    >

                </div>

            `;

        }


        // -------------------------------------------------
        // REFLECTION
        // -------------------------------------------------

        else if (operation === "Reflection") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>Reflection Direction</label>

                    <select id="reflectionDirection">

                        <option value="Horizontal">
                            Horizontal
                        </option>

                        <option value="Vertical">
                            Vertical
                        </option>

                        <option value="Both">
                            Both
                        </option>

                    </select>

                </div>

            `;

        }


        // -------------------------------------------------
        // CROPPING
        // -------------------------------------------------

        else if (operation === "Cropping") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>X</label>

                    <input
                        type="number"
                        id="cropX"
                        value="0"
                        min="0"
                    >

                </div>


                <div class="parameter-row">

                    <label>Y</label>

                    <input
                        type="number"
                        id="cropY"
                        value="0"
                        min="0"
                    >

                </div>


                <div class="parameter-row">

                    <label>Width</label>

                    <input
                        type="number"
                        id="cropWidth"
                        value="300"
                        min="1"
                    >

                </div>


                <div class="parameter-row">

                    <label>Height</label>

                    <input
                        type="number"
                        id="cropHeight"
                        value="300"
                        min="1"
                    >

                </div>

            `;

        }


        // -------------------------------------------------
        // HISTOGRAM
        // -------------------------------------------------

        else if (
            operation === "Histogram Equalization"
        ) {

            parametersContainer.innerHTML = `

                <div class="parameter-info">

                    <h4>Histogram Equalization</h4>

                    <p>
                        Improves image contrast using
                        histogram equalization.
                    </p>

                </div>

            `;

        }


        // -------------------------------------------------
        // SMOOTHING
        // -------------------------------------------------

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


        // -------------------------------------------------
        // SHARPENING
        // -------------------------------------------------

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


        // -------------------------------------------------
        // THRESHOLD
        // -------------------------------------------------

        else if (operation === "Thresholding") {

            parametersContainer.innerHTML = `

                <div class="parameter-row">

                    <label>Threshold Value</label>

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


        // -------------------------------------------------
        // FILTERS
        // -------------------------------------------------

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


        // -------------------------------------------------
        // INPAINTING
        // -------------------------------------------------

        else if (
            operation === "Telea Method" ||
            operation === "Navier-Stokes (NS) Method"
        ) {

            parametersContainer.innerHTML = `

                <div class="parameter-info">

                    <h4>${operation}</h4>

                    <p>
                        Restores damaged image regions
                        using OpenCV inpainting.
                    </p>

                </div>

            `;

        }


        // -------------------------------------------------
        // COMPRESSION
        // -------------------------------------------------

        else if (
            operation === "Lossless Compression" ||
            operation === "Compression Comparison"
        ) {

            parametersContainer.innerHTML = `

                <div class="parameter-info">

                    <h4>${operation}</h4>

                    <p>
                        Compare original and compressed
                        image file sizes.
                    </p>

                </div>

            `;

        }


        // -------------------------------------------------
        // MORPHOLOGY
        // -------------------------------------------------

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
                        Applies morphological image
                        processing using OpenCV.
                    </p>

                </div>

            `;

        }


        // -------------------------------------------------
        // OBJECT DETECTION
        // -------------------------------------------------

        else if (
            operation === "Correlation Principle"
        ) {

            parametersContainer.innerHTML = `

                <div class="parameter-info">

                    <h4>Correlation Principle</h4>

                    <p>
                        Detects matching regions using
                        template correlation.
                    </p>

                </div>

            `;

        }

    }


    // =====================================================
    // IMAGE UPLOAD
    // =====================================================

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


        if (resultMessage) {

            resultMessage.textContent =
                "Image uploaded successfully.";

        }

    });


    // =====================================================
    // VARIABLE
    // =====================================================

    let selectedFile = null;
    let processedImageURL = null;


    // =====================================================
    // GET PARAMETERS
    // =====================================================

    function getParameters() {

        const parameters = {};

        if (!parametersContainer) {
            return parameters;
        }

        const fields =
            parametersContainer.querySelectorAll(
                "input, select"
            );

        fields.forEach(field => {

            parameters[field.id] =
                field.value;

        });

        return parameters;

    }


    // =====================================================
    // APPLY
    // =====================================================

    applyBtn.addEventListener("click", async function () {

        if (!selectedFile) {

            showMessage(
                "Please upload an image first."
            );

            return;

        }


        if (!practicalSelect.value) {

            showMessage(
                "Please select a practical."
            );

            return;

        }


        if (!operationSelect.value) {

            showMessage(
                "Please select an operation."
            );

            return;

        }


        try {

            applyBtn.disabled = true;

            applyBtn.textContent =
                "⏳ Processing...";


            const formData =
                new FormData();


            formData.append(
                "image",
                selectedFile
            );


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
                JSON.stringify(
                    getParameters()
                )
            );


            const response =
                await fetch(
                    `${API_URL}/api/process`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!response.ok ||
                !data.success) {

                throw new Error(
                    data.message ||
                    "Processing failed."
                );

            }


            processedImageURL =
                `${API_URL}${data.download_url}`;


            if (processedImage) {

                processedImage.src =
                    processedImageURL;

                processedImage.style.display =
                    "block";

            }


            if (processedPlaceholder) {

                processedPlaceholder.style.display =
                    "none";

            }


            if (processedSize) {

                processedSize.textContent =
                    formatFileSize(
                        data.processed_size
                    );

            }


            if (downloadBtn) {

                downloadBtn.disabled =
                    false;

            }


            showMessage(
                "Image processed successfully."
            );

        }

        catch (error) {

            console.error(error);

            showMessage(
                error.message ||
                "Cannot connect to backend."
            );

        }

        finally {

            applyBtn.disabled = false;

            applyBtn.textContent =
                "▶ Apply";

        }

    });


    // =====================================================
    // DOWNLOAD
    // =====================================================

    if (downloadBtn) {

        downloadBtn.addEventListener(
            "click",
            function () {

                if (!processedImageURL) {
                    return;
                }

                window.open(
                    processedImageURL,
                    "_blank"
                );

            }
        );

    }


    // =====================================================
    // RESET
    // =====================================================

    resetBtn.addEventListener("click", function () {

        selectedFile = null;
        processedImageURL = null;

        imageInput.value = "";

        practicalSelect.value = "";

        operationSelect.innerHTML =
            '<option value="">-- Select Operation --</option>';

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

            originalPlaceholder.style.display =
                "flex";

        }

        if (processedPlaceholder) {

            processedPlaceholder.style.display =
                "flex";

        }

        if (fileName) {

            fileName.textContent =
                "No image selected";

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

        showMessage(
            "Select an image and practical to start."
        );

    });


    // =====================================================
    // MESSAGE
    // =====================================================

    function showMessage(message) {

        if (resultMessage) {

            resultMessage.textContent =
                message;

        }

    }


    // =====================================================
    // FILE SIZE
    // =====================================================

    function formatFileSize(bytes) {

        if (
            bytes === undefined ||
            bytes === null
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

        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );

        return (
            (bytes /
                Math.pow(1024, index)
            ).toFixed(2)
            + " "
            + units[index]
        );

    }


    console.log(
        "✅ Image Processing Lab initialized successfully"
    );

});