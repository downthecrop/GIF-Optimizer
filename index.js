var source = {}

function aspectRatio(w, h) {
    let ratio = source.naturalWidth / source.naturalHeight
    return ([parseInt(h * ratio), parseInt(w / ratio)])
}

function setSource(f) {

    let preview = document.getElementById("preview")

    preview.style.border = "none"

    if (preview.hasChildNodes()) {
        preview.removeChild(preview.children[0]);
    }

    console.log(f)

    let ftype = f.path.split(".")
    ftype = ftype[ftype.length - 1]
    let input = (ftype == "gif") ? document.createElement('img') : document.createElement('video')
    input.src = f.path
    input.id = "myImage"
    source.path = f.path

    // Handler for GIF inputs
    input.onload = function () {
        console.log("Image Size", input.naturalWidth, input.naturalWidth)
        setWidthHeight(input.naturalWidth, input.naturalHeight);
    }

    // Handler for video inputs
    input.onloadstart = function () {
        getVideoDimensions(source.path).then((result) => setWidthHeight(result.width, result.height));
    }

    preview.appendChild(input);

    // Load video files
    if (ftype == "mp4") {
        let video = document.getElementById("myImage")
        video.autoplay = true
        video.muted = true
        video.loop = true
        video.load()
    }
    addToLog(`<i>Loaded: ${f.path}</i>`);
}

function addToLog(text) {
    document.getElementById("logbox").innerHTML += text + "<br>";
}

function clearLog() {
    document.getElementById("logbox").innerHTML = "";
}

function setWidthHeight(width, height) {
    document.getElementById("width").value = width
    document.getElementById("height").value = height
    source.naturalHeight = height
    source.naturalWidth = width
}

// Ty https://stackoverflow.com/a/45355068
function getVideoDimensions(url) {
    return new Promise(resolve => {
        // create the video element
        const video = document.createElement('video');

        // place a listener on it
        video.addEventListener("loadedmetadata", function () {
            // retrieve dimensions
            const height = this.videoHeight;
            const width = this.videoWidth;
            // send back result
            resolve({
                height,
                width
            });
        }, false);

        // start download meta-datas
        video.src = url;
    });
}


// Init Listeners

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log('File Path of dragged files: ', f.path);
        setSource(f)
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.getElementById('file_picker').onchange = function () {
    setSource(document.getElementById('file_picker').files[0])
};

document.getElementById("width").onchange = function () {
    if (document.getElementById("aspect").checked) {
        let width = document.getElementById("width")
        let d = aspectRatio(width.value, 1)
        console.log(d)
        height.value = d[1]
    }
}

document.getElementById("height").onchange = function () {
    if (document.getElementById("aspect").checked) {
        let height = document.getElementById("height")
        let d = aspectRatio(1, height.value)
        console.log(d)
        width.value = d[0]
    }
}

document.getElementById('start').onclick = function () {
    let w = document.getElementById("width").value;
    let h = document.getElementById("height").value;
    let fps = document.getElementById("fps").value;
    let outFile = source.path.split(".")[0] + "-" + w + "x" + h + ".gif"
    let command = `-y -i ${source.path} -filter_complex fps=${fps},scale=${w}:${h}:flags=fast_bilinear,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse=dither=sierra2_4a ${outFile}`
    let myArgs = command.split(" ");
    const execFile = require('child_process').execFile;
    execFile('ffmpeg.exe', myArgs, (err, stdout, stderr) => {
        if (err) {
            throw err;
        }
        console.log(stdout);
    });
    addToLog(`<b>Saved to: <u>${outFile}</u></b>`)
}