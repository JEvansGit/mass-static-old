/*
 * This is a bit of a headache..
 * I was/am new to JS and know that this is not how things
 * should be done.
 * Although it works
 */

var cameraStream = [];

var btnAdd = document.querySelector('#btn-add');
var windowAdd = document.querySelector('.btn-add-window');
var infoBtnAdd = document.querySelector('#btn-add-window-info');
var progressBtnAdd = document.querySelector('.btn-add-window__progress-bar__progress');
var progressBar = document.querySelector(".btn-add-window__progress-bar");
var page = document.querySelector('#page');
var btnHamburger = document.querySelector('.hamburger');
var navMain = document.querySelector('nav');
var camerasAdded = document.querySelector('.cameras__links');
var camerasAddedLink = document.getElementsByClassName('cameras__links__link');
var currentCameraHeading = document.querySelector('.is-live');
var cameraIp = document.querySelector('.camera-ip');


var cameras;
var camerasFound = false;
var blockingMenu = false;

if (btnHamburger != null) {
    btnHamburger.onclick = function () {
        if (navMain.classList.contains("hidden")) {
            navMain.classList.remove("hidden");
            document.body.style.backgroundColor = "rgba(0,0,0,0.25)";
        } else {
            navMain.classList.add("hidden");
        }
    }
}


var scanAlreadyRun = false;
var firstAdded = false;
if (btnAdd != null) {
    btnAdd.onclick = function () {

        if (document.querySelector('.camera-img') == null) {
            windowAdd.style.marginTop = "30px";
            windowAdd.style.marginLeft = "4px";
        }  else {
            windowAdd.style.marginLeft = "0px";
        }
        let progress = 0;

        if (windowAdd.classList.contains("on")) {
            windowAdd.classList.remove("on");
            console.log("* Turning off camera discovery ... *")
        } else {
            windowAdd.classList.add("on");
            console.log("* Openning camera discovery ... *")
            var i = 1;

            if (!scanAlreadyRun) {
                (function sleep(i) {
                    setTimeout(function () {
                        scanAlreadyRun = true;
                        progress++;
                        infoBtnAdd.textContent = "Searching IP ranges for cameras... " + progress + "%";
                        progressBtnAdd.style.width = progress + "%";
                        if (--i) sleep(i)
                        else {
                            progressBtnAdd.style.background = "transparent";
                            progressBar.style.background = "transparent";
                            if (document.querySelector('.camera-img') == null) {
                                windowAdd.style.marginTop = "30px";
                            } else { windowAdd.style.marginTop = "-380px"; }
                            windowAdd.style.height = "350px";
                            windowAdd.style.overflowY = "auto";

                            for (let i = 0; i < 10; i++) {
                                var cameraItem = document.createElement("div");

                                var camera = document.createElement("div");
                                var cameraName = document.createTextNode("192.168.0." + (i + 1));
                                camera.appendChild(cameraName);
                                camera.className = "camera";

                                cameraItem.appendChild(camera);
                                cameraItem.className = "camera-item";
                                windowAdd.append(cameraItem);
                            }

                            var cameras = document.querySelectorAll('.camera-item');
                            // Add event listeners to each camera item
                            for (let i = 0; i < cameras.length; i++) {
                                cameras[i].addEventListener('click', function(event) {
                                    console.log(i);
                                    var txtAdd = document.createElement("input");
                                    txtAdd.setAttribute("type", "text");
                                    txtAdd.className ="txtCamera";
                                    txtAdd.setAttribute("placeholder", "Enter camera name here...");

                                    var btnSave = document.createElement("div");
                                    btnSave.className ="btnSave"
                                    btnSaveName = document.createTextNode("Add");
                                    btnSave.append(btnSaveName);

                                    txtAdd.addEventListener('keyup', function(event) {
                                        if (event.keyCode === 13) {
                                            btnSave.click();
                                        }
                                    })

                                    btnSave.addEventListener('click', function(event) {
                                        console.log("Saving " + txtAdd.value);
                                        cameras[i].textContent = txtAdd.value;
                                        cameras[i].style.color = "#ccc";
                                        cameras[i].style.cursor = "default";

                                        var notification = document.createElement("div");
                                        var notificationText = document.createTextNode(txtAdd.value + " camera has been added");
                                        notification.appendChild(notificationText);
                                        notification.className = "notification notification--add";
                                        document.body.appendChild(notification);
                                        var currentImage = "img/streams/" + (i + 1) + ".png";

                                        cameraStream.push ({
                                            ip: "192.168.0." + (i + 1),
                                            name: txtAdd.value,
                                            imageSrc: currentImage
                                        });

                                        console.log(cameraStream);

                                        txtAdd.remove();
                                        btnSave.remove();

                                        let existingImage = document.querySelector('.camera-img');
                                        var cameraVideo = document.querySelector('.camera-video');

                                        if (existingImage === null) {
                                            let camActions = document.querySelector('.camera-actions');
                                            camActions.style.padding = "0";
                                            camActions.style.border = "none"
                                            camActions.style.textAlign = "left";

                                            windowAdd.style.marginTop = "-450px";
                                            console.log("Image not found, adding");
                                        }
                                        refreshCameras();
                                    });

                                    // Use insertBefore to add textbox after a given camera item
                                    let parentDiv = cameras[i].parentNode;
                                    parentDiv.insertBefore(txtAdd, cameras[i + 1]);
                                    parentDiv.insertBefore(btnSave, cameras[i + 1]);

                                });
                            }

                            blockingMenu = true;

                            infoBtnAdd.textContent = "Found 10 cameras...";
                            var btnClose = document.createElement("a");
                            var btnCloseText = document.createTextNode("Close");
                            btnClose.appendChild(btnCloseText);
                            btnClose.className = "button button--close";
                            btnClose.style.display = "block";
                            windowAdd.append(btnClose);

                            btnClose.onclick = function () {
                                windowAdd.classList.remove("on");
                            }
                        };
                    }, 10);
                })(100);
            }
        }
        windowAdd.style.marginLeft = "0px";
    }
}

if (page != null) 
    page.onclick = function () {
        // if (windowAdd != null){
            // if (windowAdd.classList.contains("on") && blockingMenu == false) {
            //     windowAdd.classList.remove("on");
            // }
        // }
    if (!navMain.classList.contains("hidden") && window.innerWidth <= 768) {
        navMain.classList.add("hidden");
        document.body.style.backgroundColor = "#fefefe";
    }
}

// Disabling this menu JavaScript allows for non-javascript devices to use mobile navigation
document.getElementsByTagName("body")[0].onresize = function () {
    updateNav()
};

function updateNav() {
    if (window.innerWidth <= 768) {
        navMain.classList.add("hidden");
    } else {
        if (navMain.classList.contains("hidden")) {
            navMain.classList.remove("hidden");
        }
    }
}
updateNav();

function refreshCameras() {
    console.log("[Cameras]: Refreshing...");
    console.log("[Cameras]: Object array length: " + cameraStream.length);
    while (camerasAddedLink[0]) {
        if (camerasAddedLink[0].parentNode != null) {
            camerasAddedLink[0].parentNode.removeChild(camerasAddedLink[0]);
            console.log("[Cameras]: Clearing...");
        } else { console.log("Can't find parent node"); }
    }

    if (cameraStream.length > 0 && document.querySelector('#btn-remove') === null) {
        btnRemove = document.createElement("a");
        let actions = document.querySelector('.camera-actions');
        actions.style.float = "right";
        btnRemove.id = "btn-remove";
        btnRemove.className = "camera-actions__action button button--remove";
        btnRemove.textContent = "Remove";

        btnRemove.addEventListener('click', function (event) {
            cameraStream.shift();

            if (cameraStream.length == 0) {
                document.querySelector('#btn-remove').remove();
                document.querySelector('h1').textContent = "Please add a camera";
                document.querySelector('h1').classList.remove("is-live");
                document.querySelector('img').remove();
                document.querySelector('.camera-ip').remove();
            }

            refreshCameras();
        })
        actions.appendChild(btnRemove);
    } else {

        if (cameraStream.length === 0) {
            let camActions = document.querySelector('.camera-actions');
            camActions.style.padding = "0";
            camActions.style.border = "none"
            camActions.style.textAlign = "left";

            windowAdd.style.marginTop = "-450px";

            let actions = document.querySelector('.camera-actions');
            actions.style.float = "left";
            actions.style.margin = "20px 0";
            actions.style.padding = "";
            actions.style.float = "";
        }
    }

    if (cameraStream.length > 0) {
        document.querySelector('h1').textContent = cameraStream[0].name;
        document.querySelector('h1').classList.add("is-live");
        let currentImage = document.querySelector('img');

        if (currentImage !== null) {
            currentImage.src = cameraStream[0].imageSrc;

        } else {
            var image = document.createElement("img");
            image.src = cameraStream[0].imageSrc;

            document.querySelector('.camera-video').appendChild(image);
        }

        let ip = document.querySelector('.camera-ip');
        if (ip !== null) {
            ip.textContent = cameraStream[0].ip;
        } else {
            let newIp = document.createElement("p");
            newIp.classList.add("camera-ip");
            newIp.textContent = cameraStream[0].ip;

            let video = document.querySelector('.camera-video');
            video.parentNode.insertBefore(newIp, video.nextSibling);
        }
    }

    if (camerasAdded != null) {
        console.log(cameraStream);

        for (let i = 0; i < cameraStream.length; i++) {

           var newCamera = document.createElement("a");
           var newCameraText = document.createTextNode(cameraStream[i].name);
           newCamera.className = "cameras__links__link";
           newCamera.appendChild(newCameraText);
           newCamera.addEventListener('click', function ()  {

                // Swap with front of queue
                console.log("clicked " + cameraStream[i].name);
                let tmpStream = cameraStream[i];
                cameraStream[i] = cameraStream[0];
                cameraStream[0] = tmpStream;

               // TODO: Remove this at some point
                console.log("222222");
                console.log(cameraStream);

                console.log("Viewing camera: " + cameraStream[i].name);

                refreshCameras();
            });

            if (cameraStream[0] !== cameraStream[i]) {
                camerasAdded.appendChild(newCamera);
            }
        }

        if (cameraStream.length > 4) {
            var newBtn = document.createElement("a");
            var newBtnText = document.createTextNode("Next");
            newBtn.className = "cameras__links__link cameras__links__actions__action";
            newBtn.appendChild(newBtnText);

            camerasAdded.appendChild(newBtn);
        }
    }
}

/*
 * Recordings page JS
 */
var recordings = {
    recording1 : {
        No: 1,
        DateTime: "2018-11-26 19:21",
        Duration: "14 seconds",
        Description: "eqhqehqehtrwhwrtjhwrtjwr rtjwryj tqjhqrtj qtrjqrtj tqrjqrtj qtehthqijohqjotp pojiqrhopijqthjpo kopwthrkpwtrhpokwthr pkowrthpowrth opkwtrhopkwrth Lorem ipsum",
        ImageSrc: "img/streams/1.png",
    },
    recording2 : {
        No: 2,
        DateTime: "2018-11-26 19:21",
        Duration: "24 seconds",
        Description: "eqhqehqehtrwhwrtjhwrtjwr rtjwryj tqjhqrtj qtrjqrtj tqrjqrtj qtehthqijohqjotp pojiqrhopijqthjpo kopwthrkpwtrhpokwthr pkowrthpowrth opkwtrhopkwrth Lorem ipsum",
        ImageSrc: "img/streams/2.png",
    },
    recording3 : {
        No: 3,
        DateTime: "2018-11-26 19:21",
        Duration: "15 seconds",
        Description: "eqhqehqehtrwhwrtjhwrtjwr rtjwryj tqjhqrtj qtrjqrtj tqrjqrtj qtehthqijohqjotp pojiqrhopijqthjpo kopwthrkpwtrhpokwthr pkowrthpowrth opkwtrhopkwrth Lorem ipsum",
        ImageSrc: "img/streams/3.png",
    },
    recording4 : {
        No: 4,
        DateTime: "2018-11-26 19:21",
        Duration: "4 seconds",
        Description: "eqhqehqehtrwhwrtjhwrtjwr rtjwryj tqjhqrtj qtrjqrtj tqrjqrtj qtehthqijohqjotp pojiqrhopijqthjpo kopwthrkpwtrhpokwthr pkowrthpowrth opkwtrhopkwrth Lorem ipsum",
        ImageSrc: "img/streams/4.png",
    },
}

var recordingArray = [];
for (var i in recordings) {
    recordingArray.push(recordings[i]);
}


var recordingsTable  = document.querySelector('.recordings');

/*
 * Load data
 */
/*
if (recordingsTable != null) {
    for (let i = 0; i < recordingArray.length; i++) {
        console.log("loading record: " + i);
        let tr = document.createElement("tr");

        let tdId = document.createElement("td");
        tdId.textContent = recordingArray[i].No;

        let tdDateTime = document.createElement("td");
        tdDateTime.textContent = recordingArray[i].DateTime;

        let tdDuration = document.createElement("td");
        tdDuration.textContent = recordingArray[i].Duration;

        tr.appendChild(tdId);
        tr.appendChild(tdDateTime);
        tr.appendChild(tdDuration);

        let tr2 = document.createElement("tr");

        tr.addEventListener('click', function (event) {
            let expanded = 0;
            console.log("expanding");
            if (expanded == 0) {
                expanded = 1;

                let trExpand = document.createElement("tr");
                let tdRowInfo = document.createElement("td");
        
                tdRowInfo.className = "row-info";
                tdRowInfo.colSpan = 4;
                tdRowInfo.innerHTML = "<img src=\"" + recordingArray[i].ImageSrc + "\" />";
                tdRowInfo.innerHTML += "<p>" + recordingArray[i].Description + " </p>";
                tdRowInfo.innerHTML += "<a class=\"button button--add\" href=\"#\">Download</a>";
                tdRowInfo.innerHTML += "<a class=\"button button--remove\" href=\"#\">Remove</a>";

                trExpand.appendChild(tdRowInfo);

                // recordingsTable.appendChild(trExpand);
                console.log(i);
                tr2.appendChild(trExpand);
                // tr.parentNode.appendChild(trExpand);

            } else { console.log("collapse"); }
        });

        recordingsTable.appendChild(tr);
        recordingsTable.parentNode.appendChild(tr2);

    }
}*/

var canCollapse = document.getElementsByClassName('can-collapse');
var canCollapseEdit = document.getElementsByClassName('btn--edit');
var canCollapseContent = document.getElementsByClassName('can-collapse-content');
var canCollapseContentText = document.getElementsByClassName('can-collapse-content-text');
var canCollapseRemove = document.getElementsByClassName('button--remove');
console.log(canCollapseEdit.length);
for (let i = 0; i < canCollapse.length; i++) {
    canCollapse[i].nextElementSibling.style.display = "none";
    
    canCollapse[i].addEventListener('click', function (event) {
        console.log("clicked");
        var content = this.nextElementSibling;

        if (content.style.display === "") {
            content.style.display = "none";
            canCollapse[i].style.background="#eee url('img/expand-icon.png') no-repeat 97% 50%";
        } else {
            content.style.display = "";
            canCollapse[i].style.background="#fff url('img/collapse-icon.png') no-repeat 97% 50%";

        }
    });

    if (canCollapseEdit[i] != null) {
        canCollapseEdit[i].addEventListener('click', function (event) {
            var txtInput = prompt ("Please enter text here:");
            if (txtInput != null || txtInput != "") {
                canCollapseContentText[i].textContent = txtInput;
            } else { console.log("Invalid input!"); }
        });
    }

    if (canCollapseRemove[i] != null) {
        canCollapseRemove[i].addEventListener('click', function (event) {
            canCollapse[i].remove();
            canCollapseContentText[i].remove();
            canCollapseContent[i].remove();

            var notification = document.createElement("div");
            var notificationText = document.createTextNode("Removed recording");
            notification.appendChild(notificationText);
            notification.className = "notification--remove notification";
            document.body.appendChild(notification);

        });
    }

}

