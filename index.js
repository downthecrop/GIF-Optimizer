var inFile

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log('File Path of dragged files: ', f.path);
        document.getElementById("logbox").innerHTML += f.path + "\n";
        inFile = f[i].path
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
  
  let preview = document.getElementById("preview")
  if (preview.firstChild)
    preview.removeChild(firstChild)

  let f = document.getElementById('file_picker').files
  console.log(f)
  for (let i = 0; i < f.length; i += 1){
    let images = new Image();
    images.onload = () => {
     console.log("Image Size", images.width, images.height)
     document.getElementById("width").value = images.width
     document.getElementById("height").value = images.height
    }
    images.onerror = () => result(true);
    images.src = f[i].path
    inFile = f[i].path

    // Add image to the DOM just so we can get its width and height
    // then immediately remove it.
    preview.appendChild(images);

    document.getElementById("logbox").innerHTML += f[i].path + "\n";
  }
};



document.getElementById('start').onclick = function(){
    let w = document.getElementById("width").value;
    let h = document.getElementById("height").value;
    let fps = document.getElementById("fps").value;

    let command = `-i ${inFile} -filter_complex fps=${fps},scale=${w}:-1:flags=fast_bilinear,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse=dither=sierra2_4a output.gif`

    let myArgs = command.split(" ");    
    const execFile = require('child_process').execFile;
    const child = execFile('ffmpeg.exe', myArgs, (err, stdout, stderr) => {
      if (err) {
        throw err;
      }
      console.log(stdout);
    });
}