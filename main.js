var timerDiv = document.getElementById("study-timer");
var startStudyingButton = document.getElementById("start-button");
var breakButton = document.getElementById("break-button");
var endButton = document.getElementById("end-button");
var saveButton = document.getElementById("save-button");
var addFileButton = document.getElementById("add-new-file-button");
var filesList = document.getElementById("files-list")

var contentTextField = document.getElementById("content-text");
var contentTitleField = document.getElementById("content-title");

var hours = 0;
var mins = 0;
var seconds = 0;

var paused = false;

startStudyingButton.addEventListener("click", () => {
    paused = false;
    changeTime();
});

breakButton.addEventListener("click", () => {
    paused = true;
})

saveButton.addEventListener("click", () => {
    saveFile();
})

addFileButton.addEventListener("click", () => {
    wipeAll();
})

function wipeAll() {
    saveFile();
    contentTextField.value = "";
    contentTitleField.value = "";
}

function saveFile() {
    fetch("http://localhost:3000/saveFile?title=" + contentTitleField.value + "&content=" + contentTextField.value).then(response => response.text()).then(res => {
        console.log(res);
    })
    loadAllFiles();
}

function openFile(filename) {
    fetch("http://localhost:3000/readFile?name=" + filename).then(response => response.text()).then(res => {
        contentTextField.value = res;
    })
}

function formattingTitle(title) {
    var titleArr = title.split(" ");
    var titleStr = "";

    for(var i in titleArr) {
        var firstLetter = titleArr[i][0].toUpperCase();
        var restOfWord = titleArr[i].slice(1);
        var newWord = firstLetter + restOfWord;

        if(parseInt(i) != 0) {
            titleStr += " " + newWord;
        }
        else {
            titleStr += newWord;
        }
    }

    if(titleStr.length > 30) {
        titleStr = titleStr.slice(0, 29);
        titleStr += "...";
    }

    return titleStr;
}

function loadAllFiles() {
    var arr = [];
    filesList.innerHTML = "";
    fetch("http://localhost:3000/getAllFiles").then(response => response.json()).then(res => {
        arr = res;

        for(var i in arr) {
            var indivFile = document.createElement('div');
            var indivFileName = document.createElement("div");
            var indivFileArrow = document.createElement("div");

            indivFile.className = "indiv-file";
            indivFileName.className = "indiv-file-name";
            indivFileArrow.className = "indiv-file-arrow";

            indivFile.id = i;
            indivFileName.id = i;
            indivFileArrow.id = i;

            indivFileName.innerHTML = formattingTitle(arr[i].replace(".txt", ""));
            indivFileArrow.innerHTML = ">";

            indivFile.onclick = (event) => {
                openFile(arr[event.target.id]);
                contentTitleField.value = formattingTitle(arr[event.target.id].replace(".txt", ""));
            }

            indivFile.appendChild(indivFileName);
            indivFile.appendChild(indivFileArrow);

            filesList.appendChild(indivFile);
        }
    })
}

function setDefaultTimeDisplay() {
    var timeDisplay = hours + " hrs : " + mins + " mins : " + seconds + " seconds";
    timerDiv.innerHTML = "<h2>" + timeDisplay + "</h2>";
}

function changeTime() {
    if(!paused) {
        if(seconds >= 60) {
            mins++;
            seconds -= 60;
        }
    
        if(mins >= 60) {
            hours++;
            mins -= 60;
        }
    
        var timeDisplay = hours + " hrs : " + mins + " mins : " + seconds + " seconds";
        timerDiv.innerHTML = "<h2>" + timeDisplay + "</h2>";
        seconds++;
        setTimeout(() => {
            changeTime();
        }, 1000);
    }
}

setDefaultTimeDisplay();
loadAllFiles();
