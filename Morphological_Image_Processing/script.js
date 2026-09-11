// ============================================================
// MORPHOLOGICAL IMAGE PROCESSING
// Frontend JavaScript
// Connected with Python Flask Backend
// ============================================================

let uploadedImages = [];
let processedResults = [];

// ------------------------------------------------------------
// DOM ELEMENTS
// ------------------------------------------------------------

let imageInput;
let uploadMessage;
let resultsContainer;
let operationSelect;
let filterSelect;
let noiseSelect;
let kernelSelect;
let processButton;
let performanceTable;
let histogramCanvas;


// ------------------------------------------------------------
// PAGE LOAD
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    imageInput = document.getElementById("imageInput");
    uploadMessage = document.getElementById("uploadMessage");

    resultsContainer = document.getElementById("resultsContainer");

    operationSelect = document.getElementById("operation");
    filterSelect = document.getElementById("filter");
    noiseSelect = document.getElementById("noise");
    kernelSelect = document.getElementById("kernel");

    processButton = document.getElementById("processButton");

    performanceTable = document.getElementById("performanceTable");

    histogramCanvas = document.getElementById("histogramCanvas");


    // --------------------------------------------------------
    // IMAGE INPUT
    // --------------------------------------------------------

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            handleImageUpload
        );

    }


    // --------------------------------------------------------
    // OPERATION CHANGE
    // --------------------------------------------------------

    if (operationSelect) {

        operationSelect.addEventListener(
            "change",
            function () {

                console.log(
                    "Operation:",
                    operationSelect.value
                );

            }
        );

    }


    // --------------------------------------------------------
    // FILTER CHANGE
    // --------------------------------------------------------

    if (filterSelect) {

        filterSelect.addEventListener(
            "change",
            function () {

                console.log(
                    "Filter:",
                    filterSelect.value
                );

            }
        );

    }


    // --------------------------------------------------------
    // NOISE CHANGE
    // --------------------------------------------------------

    if (noiseSelect) {

        noiseSelect.addEventListener(
            "change",
            function () {

                console.log(
                    "Noise:",
                    noiseSelect.value
                );

            }
        );

    }


    // --------------------------------------------------------
    // KERNEL CHANGE
    // --------------------------------------------------------

    if (kernelSelect) {

        kernelSelect.addEventListener(
            "change",
            function () {

                console.log(
                    "Kernel:",
                    kernelSelect.value
                );

            }
        );

    }


    // --------------------------------------------------------
    // PROCESS BUTTON
    // --------------------------------------------------------

    if (processButton) {

        processButton.addEventListener(
            "click",
            processImages
        );

    }


    // --------------------------------------------------------
    // LOAD SAVED RESULTS
    // --------------------------------------------------------

    loadSavedResults();

});


// ============================================================
// IMAGE UPLOAD
// ============================================================

function handleImageUpload(event) {

    const files = Array.from(
        event.target.files
    );

    uploadedImages = files;


    // --------------------------------------------------------
    // MINIMUM 5 IMAGES
    // --------------------------------------------------------

    if (files.length < 5) {

        if (uploadMessage) {

            uploadMessage.innerHTML =
                `<span style="color:#ff6b6b;">
                    Please upload minimum 5 images.
                </span>`;

        }

        return;
    }


    // --------------------------------------------------------
    // SUCCESS MESSAGE
    // --------------------------------------------------------

    if (uploadMessage) {

        uploadMessage.innerHTML =
            `<span style="color:#00adb5;">
                ✓ ${files.length} images selected successfully
            </span>`;

    }


    console.log(
        "Images selected:",
        files.length
    );

}


// ============================================================
// PROCESS IMAGES
// ============================================================

async function processImages() {

    // --------------------------------------------------------
    // CHECK IMAGES
    // --------------------------------------------------------

    if (uploadedImages.length < 5) {

        alert(
            "Please upload minimum 5 images."
        );

        return;
    }


    // --------------------------------------------------------
    // GET SETTINGS
    // --------------------------------------------------------

    const operation =
        operationSelect
            ? operationSelect.value
            : "opening";


    const filter =
        filterSelect
            ? filterSelect.value
            : "morphological";


    const noise =
        noiseSelect
            ? noiseSelect.value
            : "none";


    const kernel =
        kernelSelect
            ? kernelSelect.value
            : "3";


    // --------------------------------------------------------
    // VALIDATE OPERATION
    // --------------------------------------------------------

    if (
        operation !== "opening" &&
        operation !== "closing"
    ) {

        alert(
            "Please select Opening or Closing."
        );

        return;
    }


    // --------------------------------------------------------
    // FORM DATA
    // --------------------------------------------------------

    const formData = new FormData();


    uploadedImages.forEach(
        function (file) {

            formData.append(
                "images",
                file
            );

        }
    );


    formData.append(
        "operation",
        operation
    );


    formData.append(
        "filter",
        filter
    );


    formData.append(
        "noise",
        noise
    );


    formData.append(
        "kernel",
        kernel
    );


    // --------------------------------------------------------
    // BUTTON LOADING
    // --------------------------------------------------------

    const originalButtonText =
        processButton
            ? processButton.innerHTML
            : "";


    if (processButton) {

        processButton.disabled = true;

        processButton.innerHTML =
            "⏳ Processing...";

    }


    try {

        // ----------------------------------------------------
        // SEND REQUEST TO PYTHON
        // ----------------------------------------------------

        const response = await fetch(
            "http://localhost:5000/api/process",
            {
                method: "POST",
                body: formData
            }
        );


        // ----------------------------------------------------
        // READ RESPONSE
        // ----------------------------------------------------

        const data =
            await response.json();


        // ----------------------------------------------------
        // ERROR
        // ----------------------------------------------------

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Processing failed."
            );

        }


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        console.log(
            "Backend response:",
            data
        );


        processedResults =
            data.results || [];


        // ----------------------------------------------------
        // DISPLAY RESULTS
        // ----------------------------------------------------

        displayResults(
            processedResults
        );


        // ----------------------------------------------------
        // DISPLAY PERFORMANCE
        // ----------------------------------------------------

        displayPerformance(
            processedResults
        );


        // ----------------------------------------------------
        // DISPLAY HISTOGRAM
        // ----------------------------------------------------

        if (
            processedResults.length > 0
        ) {

            drawHistogram(
                processedResults[0]
            );

        }


        // ----------------------------------------------------
        // SAVE RESULTS
        // ----------------------------------------------------

        try {

            localStorage.setItem(
                "morphologicalResults",
                JSON.stringify(data)
            );

        } catch (storageError) {

            console.warn(
                "Could not save results:",
                storageError
            );

        }


        // ----------------------------------------------------
        // SUCCESS MESSAGE
        // ----------------------------------------------------

        alert(
            "✓ Images processed successfully!"
        );


    } catch (error) {

        console.error(
            "Processing error:",
            error
        );


        alert(
            "Backend connection failed.\n\n" +
            "Make sure Python Flask server is running:\n" +
            "python app.py"
        );

    } finally {

        // ----------------------------------------------------
        // RESTORE BUTTON
        // ----------------------------------------------------

        if (processButton) {

            processButton.disabled = false;

            processButton.innerHTML =
                originalButtonText ||
                "Process Images";

        }

    }

}


// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(results) {

    if (!resultsContainer) {

        return;
    }


    if (!results.length) {

        resultsContainer.innerHTML =
            `<div class="empty-state">
                <p>No results available.</p>
            </div>`;

        return;
    }


    resultsContainer.innerHTML = "";


    results.forEach(
        function (result, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "result-card";


            card.innerHTML = `

                <div class="result-header">

                    <h3>
                        Image ${index + 1}
                    </h3>

                    <span>
                        ${result.imageName}
                    </span>

                </div>


                <div class="image-comparison">

                    <div class="image-box">

                        <h4>Original</h4>

                        <img
                            src="${result.originalImage}"
                            alt="Original Image"
                        >

                    </div>


                    <div class="image-box">

                        <h4>Processed</h4>

                        <img
                            src="${result.processedImage}"
                            alt="Processed Image"
                        >

                    </div>

                </div>


                <div class="result-info">

                    <div>
                        <strong>Operation:</strong>
                        ${capitalize(result.operation)}
                    </div>

                    <div>
                        <strong>Filter:</strong>
                        ${capitalize(result.filter)}
                    </div>

                    <div>
                        <strong>Noise:</strong>
                        ${formatNoise(result.noise)}
                    </div>

                    <div>
                        <strong>Kernel:</strong>
                        ${result.kernel} × ${result.kernel}
                    </div>

                </div>


                <div class="result-metrics">

                    <div>
                        <span>Accuracy</span>
                        <strong>
                            ${result.metrics.accuracy}%
                        </strong>
                    </div>

                    <div>
                        <span>PSNR</span>
                        <strong>
                            ${result.metrics.psnr} dB
                        </strong>
                    </div>

                    <div>
                        <span>MSE</span>
                        <strong>
                            ${result.metrics.mse}
                        </strong>
                    </div>

                    <div>
                        <span>MAE</span>
                        <strong>
                            ${result.metrics.mae}
                        </strong>
                    </div>

                    <div>
                        <span>SSIM</span>
                        <strong>
                            ${result.metrics.ssim}
                        </strong>
                    </div>

                    <div>
                        <span>Time</span>
                        <strong>
                            ${result.metrics.processingTime} ms
                        </strong>
                    </div>

                </div>


                <div class="download-area">

                    <a
                        href="http://localhost:5000${result.downloadUrl}"
                        class="download-btn"
                        download
                    >
                        ⬇ Download Processed Image
                    </a>

                </div>

            `;


            resultsContainer.appendChild(
                card
            );

        }
    );

}


// ============================================================
// PERFORMANCE TABLE
// ============================================================

function displayPerformance(results) {

    if (!performanceTable) {

        return;
    }


    performanceTable.innerHTML = "";


    results.forEach(
        function (result, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    Image ${index + 1}
                </td>

                <td>
                    ${capitalize(result.operation)}
                </td>

                <td>
                    ${capitalize(result.filter)}
                </td>

                <td>
                    ${formatNoise(result.noise)}
                </td>

                <td>
                    ${result.kernel}
                </td>

                <td>
                    ${result.metrics.accuracy}%
                </td>

                <td>
                    ${result.metrics.psnr} dB
                </td>

                <td>
                    ${result.metrics.mse}
                </td>

            `;


            performanceTable.appendChild(
                row
            );

        }
    );


    // --------------------------------------------------------
    // UPDATE AVERAGE METRICS
    // --------------------------------------------------------

    updateAverageMetrics(
        results
    );

}


// ============================================================
// AVERAGE METRICS
// ============================================================

function updateAverageMetrics(results) {

    if (!results.length) {

        return;
    }


    const average = {

        accuracy: averageValue(
            results,
            "accuracy"
        ),

        psnr: averageValue(
            results,
            "psnr"
        ),

        mse: averageValue(
            results,
            "mse"
        ),

        mae: averageValue(
            results,
            "mae"
        ),

        ssim: averageValue(
            results,
            "ssim"
        ),

        processingTime: averageValue(
            results,
            "processingTime"
        )

    };


    setMetric(
        "accuracy",
        average.accuracy + "%"
    );


    setMetric(
        "psnr",
        average.psnr + " dB"
    );


    setMetric(
        "mse",
        average.mse
    );


    setMetric(
        "mae",
        average.mae
    );


    setMetric(
        "ssim",
        average.ssim
    );


    setMetric(
        "processingTime",
        average.processingTime + " ms"
    );

}


// ============================================================
// AVERAGE VALUE
// ============================================================

function averageValue(
    results,
    metric
) {

    const values =
        results.map(
            function (item) {

                return Number(
                    item.metrics[metric]
                ) || 0;

            }
        );


    if (!values.length) {

        return 0;

    }


    const total =
        values.reduce(
            function (sum, value) {

                return sum + value;

            },
            0
        );


    return Number(
        (total / values.length)
            .toFixed(2)
    );

}


// ============================================================
// SET METRIC CARD
// ============================================================

function setMetric(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;
    }


    // If the ID itself is the metric display
    element.textContent = value;

}


// ============================================================
// HISTOGRAM
// ============================================================

function drawHistogram(result) {

    if (!histogramCanvas) {

        return;
    }


    const canvas =
        histogramCanvas;


    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.width;


    const height =
        canvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const original =
        result.histogram.original;


    const processed =
        result.histogram.processed;


    if (
        !original ||
        !processed
    ) {

        return;
    }


    // --------------------------------------------------------
    // FIND MAX
    // --------------------------------------------------------

    const maxValue =
        Math.max(
            ...original,
            ...processed
        );


    if (maxValue <= 0) {

        return;
    }


    // --------------------------------------------------------
    // DRAW GRID
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.strokeStyle =
        "rgba(0,0,0,0.08)";

    ctx.lineWidth = 1;


    for (
        let y = 0;
        y <= 4;
        y++
    ) {

        const yPosition =
            (height / 4) * y;


        ctx.moveTo(
            0,
            yPosition
        );


        ctx.lineTo(
            width,
            yPosition
        );

    }


    ctx.stroke();


    // --------------------------------------------------------
    // DRAW ORIGINAL
    // --------------------------------------------------------

    drawHistogramLine(
        ctx,
        original,
        maxValue,
        width,
        height
    );


    // --------------------------------------------------------
    // DRAW PROCESSED
    // --------------------------------------------------------

    drawHistogramLine(
        ctx,
        processed,
        maxValue,
        width,
        height
    );

}


// ============================================================
// HISTOGRAM LINE
// ============================================================

function drawHistogramLine(
    ctx,
    histogram,
    maxValue,
    width,
    height
) {

    ctx.beginPath();

    ctx.lineWidth = 2;


    for (
        let i = 0;
        i < histogram.length;
        i++
    ) {

        const x =
            (i / 255) * width;


        const normalized =
            histogram[i] / maxValue;


        const y =
            height -
            normalized * height;


        if (i === 0) {

            ctx.moveTo(
                x,
                y
            );

        } else {

            ctx.lineTo(
                x,
                y
            );

        }

    }


    ctx.strokeStyle =
        "rgba(0, 173, 181, 0.9)";


    ctx.stroke();

}


// ============================================================
// LOAD SAVED RESULTS
// ============================================================

function loadSavedResults() {

    try {

        const saved =
            localStorage.getItem(
                "morphologicalResults"
            );


        if (!saved) {

            return;
        }


        const data =
            JSON.parse(saved);


        if (
            data.results &&
            data.results.length
        ) {

            processedResults =
                data.results;


            displayResults(
                processedResults
            );


            displayPerformance(
                processedResults
            );


            drawHistogram(
                processedResults[0]
            );

        }

    } catch (error) {

        console.warn(
            "Could not load saved results:",
            error
        );

    }

}


// ============================================================
// CAPITALIZE
// ============================================================

function capitalize(value) {

    if (!value) {

        return "";

    }


    return value
        .charAt(0)
        .toUpperCase() +
        value.slice(1);

}


// ============================================================
// FORMAT NOISE
// ============================================================

function formatNoise(value) {

    if (value === "saltpepper") {

        return "Salt & Pepper";

    }


    if (value === "gaussian") {

        return "Gaussian";

    }


    if (value === "speckle") {

        return "Speckle";

    }


    return "None";

}


// ============================================================
// CLEAR SAVED RESULTS
// ============================================================

function clearResults() {

    localStorage.removeItem(
        "morphologicalResults"
    );


    processedResults = [];


    if (resultsContainer) {

        resultsContainer.innerHTML =
            `<div class="empty-state">
                <p>No results available.</p>
            </div>`;

    }


    if (performanceTable) {

        performanceTable.innerHTML = "";

    }


    alert(
        "Results cleared."
    );

}


// ============================================================
// WINDOW RESIZE
// ============================================================

window.addEventListener(
    "resize",
    function () {

        if (
            processedResults.length > 0 &&
            histogramCanvas
        ) {

            drawHistogram(
                processedResults[0]
            );

        }

    }
);


// ============================================================
// MAKE FUNCTION AVAILABLE TO HTML
// ============================================================

window.processImages =
    processImages;

window.clearResults =
    clearResults;