document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log('File Path of dragged files: ', f.path);
        document.getElementById("logbox").innerHTML += f.path + "\n";
        test();
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
  let f = document.getElementById('file_picker').files
  console.log(f)
  for (let i = 0; i < f.length; i += 1){
    document.getElementById("logbox").innerHTML += f[i].path + "\n";
  }
};

function test(){
    const execFile = require('child_process').execFile;
    const child = execFile('ffmpeg.exe', ['--version'], (err, stdout, stderr) => {
      if (err) {
        throw err;
      }
      console.log(stdout);
    });
}