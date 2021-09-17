var inFile
var nH
var nW

function aspectRatio(w, h) {
    let ratio = nW / nH
    return ([parseInt(h * ratio), parseInt(w / ratio)])
}

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log('File Path of dragged files: ', f.path);
        setFile(f)
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('dragenter', (event) => {
    console.log('File is in the Drop Space');
});

document.addEventListener('dragleave', (event) => {
    console.log('File has left the Drop Space');
});

document.getElementById('file_picker').onchange = function() {
    setFile(document.getElementById('file_picker').files[0])
};

function setFile(f) {
    let preview = document.getElementById("preview")
    if (preview.firstChild) {
        preview.removeChild(preview.firstChild)
    }


    console.log(f)
    let images
    let ftype = f.path.split(".")
    ftype = ftype[ftype.length - 1]

    if (ftype == "gif")
        images = document.createElement('img');
    else {
        images = document.createElement('video');
    }
    images.onload = function() {
        if (ftype == "mp4") {
            getVideoDimensionsOf(inFile).then((result) => setWidthHeight(result.width, result.height));
        } else {
            console.log("Image Size", images.naturalWidth, images.naturalWidth)
            setWidthHeight(images.naturalWidth, images.naturalHeight);
        }
    }

    images.onloadstart = function() {
        if (ftype == "mp4") {
            getVideoDimensionsOf(inFile).then((result) => setWidthHeight(result.width, result.height));
        }
    }

    images.src = f.path
    images.id = "myImage"
    inFile = f.path

    // Add image to the DOM just so we can get its width and height
    // then immediately remove it.
    preview.appendChild(images);

    if (ftype == "mp4") {
        document.getElementById("myImage").autoplay = true
        document.getElementById("myImage").load()
    }

    document.getElementById("logbox").innerHTML += f.path + "\n";
}

function setWidthHeight(width, height) {
    document.getElementById("width").value = width
    document.getElementById("height").value = height
    nW = width
    nH = height
}

// Ty https://stackoverflow.com/a/45355068
function getVideoDimensionsOf(url) {
    return new Promise(resolve => {
        // create the video element
        const video = document.createElement('video');

        // place a listener on it
        video.addEventListener("loadedmetadata", function() {
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

document.getElementById("width").onchange = function() {
    let width = document.getElementById("width")
    let d = aspectRatio(width.value, 1)
    console.log(d)
    height.value = d[1]
}

document.getElementById("height").onchange = function() {
    let height = document.getElementById("height")
    let d = aspectRatio(1, height.value)
    console.log(d)
    width.value = d[0]
}

document.getElementById('start').onclick = function() {
    let w = document.getElementById("width").value;
    let h = document.getElementById("height").value;
    let fps = document.getElementById("fps").value;
    let command = `-i ${inFile} -filter_complex fps=${fps},scale=${w}:${h}:flags=fast_bilinear,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse=dither=sierra2_4a output.gif`

    let myArgs = command.split(" ");
    const execFile = require('child_process').execFile;
    const child = execFile('ffmpeg.exe', myArgs, (err, stdout, stderr) => {
        if (err) {
            throw err;
        }
        console.log(stdout);
    });
}