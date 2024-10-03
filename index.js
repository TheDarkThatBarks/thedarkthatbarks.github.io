let body, projectWidth, projectHeight;
const aspectRatio = 16/9;
const widthPercent = 0.6;
const heightPercent = widthPercent / aspectRatio;

let currentProject = null;

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
};

const closeProject = async function () {
    //console.log(currentProject);
    if (currentProject) {
        const project = currentProject;
        currentProject = null;
        const startBox = document.querySelector(`#${project.id}-thumbnail`).getBoundingClientRect();
        project.style.top = `${startBox.top}px`;
        project.style.left = `${startBox.left}px`;
        project.style.width = `${startBox.width}px`;
        project.style.height = `${startBox.height}px`
        await delay(750);
        project.style.display = "none";
        
    }
};

document.addEventListener("click", function (event) {
    //console.log(event.target.className);
    if (currentProject && event.target.id.slice(0, event.target.id.indexOf("-")) != currentProject.id && event.target.className != "project" && !currentProject.contains(event.target)) {
        //console.log("close");
        closeProject(currentProject);
    }
});

const test = async function () {
    while (true) {
        const char = document.createElement("p");
        char.className = "randLetter";
        char.style.left = `${Math.random() * (window.innerWidth - char.getBoundingClientRect().width)}px`;
        char.style.top = `${Math.random() * (window.innerHeight - char.getBoundingClientRect().height)}px`;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=;:\'\"[{]}\\|`~,<.>/?";
        char.innerHTML = characters.charAt(Math.floor(Math.random() * characters.length));
        document.querySelector("#rand").appendChild(char);
        await delay();
        char.style.opacity = "1";
        setTimeout(() => removeChar(char), 1000);
        await delay(500);
    }
};

const removeChar = async function (element) {
    element.style.opacity = "0";
    await delay(1000);
    element.remove();
};