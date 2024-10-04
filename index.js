let body, projectWidth, projectHeight;
const aspectRatio = 16/9;
const widthPercent = 0.6;
const heightPercent = widthPercent / aspectRatio;

let currentProject = null;
let projectClosing = false;

const refresh = function () {
    body = document.body.getBoundingClientRect();
    projectWidth = widthPercent * body.width;
    projectHeight = heightPercent * body.width;
};

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

const showProject = async function(thumbnail, projectId) {
    refresh();
    closeProject();
    const project = document.querySelector(`#${thumbnail.id.slice(0, thumbnail.id.indexOf("-"))}`);
    currentProject = project;

    const startBox = thumbnail.getBoundingClientRect();
    project.style.top = `${startBox.top}px`;
    project.style.left = `${startBox.left}px`;
    project.style.width = `${startBox.width}px`;
    project.style.height = `${startBox.height}px`

    project.style.display = "flex";
    project.hidden = false;
    await delay();
    project.style.top = `${0.5 * body.height - projectHeight / 2}px`;
    project.style.left = `${0.5 * body.width - projectWidth / 2}px`;
    project.style.width = `${projectWidth}px`;
    project.style.height = `${projectHeight}px`;
    project.style.opacity = "1";
};

const closeProject = async function () {
    //console.log(currentProject);
    if (currentProject) {
        const project = currentProject;
        currentProject = null;
        const startBox = document.querySelector(`#${project.id}-thumbnail`).getBoundingClientRect();
        const oldPos = project.getBoundingClientRect();
        //console.log(project.style.transition);
        project.style.transition = "none";
        project.style.top = `${oldPos.top + window.scrollY}px`;
        setTimeout(() => {
            project.style.transition = "top 0.75s, left 0.75s, width 0.75s, height 0.75s, opacity 1s ease-out";
        });
        project.style.position = "absolute";
        await delay();
        project.style.top = `${startBox.top + window.scrollY}px`;
        project.style.left = `${startBox.left}px`;
        project.style.width = `${startBox.width}px`;
        project.style.height = `${startBox.height}px`
        project.style.opacity = "0";
        projectClosing = true;
        await delay(750);
        project.style.display = "none";
        project.style.position = "fixed";
        //project.style.opacity = "1";
    }
};

/*window.onscroll = function () {
    if (projectClosing) {
        currentProject.style.top = `${startBox.top}px`;
        currentProject.style.left = `${startBox.left}px`;
    }
};*/

document.addEventListener("click", function (event) {
    //console.log(event.target.className);
    if (currentProject && event.target.id.slice(0, event.target.id.indexOf("-")) != currentProject.id && event.target.className != "project" && !currentProject.contains(event.target)) {
        //console.log("close");
        closeProject(currentProject);
    }
});

const test = async function () {
    /*const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (node of mutation.addedNodes) {
                console.log(node);
                node.style.opacity = "1";
                console.log(node);
            }
            //console.log(mutation.addedNodes[0]);
        });
        //console.log(mutations);
    });
    observer.observe(document.querySelector("#rand"), {
        childList: true
    });*/
    setInterval(() => {
        const char = document.createElement("p");
        char.className = "randLetter";
        const spawnWidth = window.innerWidth;
        const spawnHeight = window.innerHeight;
        //const spawnWidth = document.body.style.width;
        //const spawnHeight = document.body.style.height;
        //const spawnHeight = Math.max(document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight );
        //const spawnHeight = document.documentElement.offsetHeight;
        //console.log("Width", spawnWidth);
        //console.log("Height", spawnHeight);
        char.style.left = `${Math.random() * (spawnWidth * 0.8) + spawnWidth * 0.1}px`;
        char.style.top = `${Math.random() * (spawnHeight - char.getBoundingClientRect().height)}px`;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=;:\'\"[{]}\\|`~,<.>/?";
        char.innerHTML = characters.charAt(Math.floor(Math.random() * characters.length));
        char.style.opacity = "0";
        document.querySelector("#rand").appendChild(char);
        char.style.opacity = "1";
        char.style.animationPlayState = "running";
        setTimeout(() => removeChar(char), 3000);
    }, 100);
};

const removeChar = function (element) {
    element.style.animationName = "makeInvisible";
    element.style.animationPlayState = "running";
    element.style.opacity = "0";
    element.addEventListener("animationend", (event) => {
        element.remove();
    });
};