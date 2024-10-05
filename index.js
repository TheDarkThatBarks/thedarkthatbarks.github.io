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
    if (currentProject) {
        closeProject();
        return;
    }
    const project = document.querySelector(`#${thumbnail.id.slice(0, thumbnail.id.indexOf("-"))}`);
    closeProject();
    refresh();
    currentProject = project;
    thumbnail.dataset.open = "1";

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
        document.querySelector(`#${project.id}-thumbnail`).dataset.open = "0";
        const startBox = document.querySelector(`#${project.id}-thumbnail`).getBoundingClientRect();
        const oldPos = project.getBoundingClientRect();
        //console.log(project.style.transition);
        project.style.transition = "none";
        project.style.top = `${oldPos.top + window.scrollY}px`;
        setTimeout(() => {
            project.style.transition = "top 0.75s, left 0.75s, width 0.75s, height 0.75s, opacity 1s cubic-bezier(.17,.67,.25,1.01)";
        });
        project.style.position = "absolute";
        await delay();
        project.style.top = `${startBox.top + window.scrollY}px`;
        project.style.left = `${startBox.left}px`;
        project.style.width = `${startBox.width}px`;
        project.style.height = `${startBox.height}px`
        project.style.opacity = "0";
        setTimeout(() => {
            project.style.display = "none";
            project.style.position = "fixed";
        }, 750);
        //project.style.opacity = "1";
    }
};

document.addEventListener("click", function (event) {
    if (currentProject && event.target.id.slice(0, event.target.id.indexOf("-")) != currentProject.id && event.target.className != "project" && !currentProject.contains(event.target))
        closeProject(currentProject);
});

const backgroundAnimation = async function () {
    setInterval(() => {
        const char = document.createElement("p");
        char.className = "randLetter";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=;:\'\"[{]}\\|`~,<.>/?";
        char.innerHTML = characters.charAt(Math.floor(Math.random() * characters.length));
        const spawnWidth = window.innerWidth;
        const spawnHeight = window.innerHeight;
        const main = document.querySelector("#main").getBoundingClientRect();
        //console.log(char.getBoundingClientRect())
        char.style.left = `${Math.random() * (main.width * 0.8) + main.width * 0.1}px`;
        char.style.top = `${Math.random() * (main.height * 0.9)}px`;
        //char.style.opacity = "0";
        document.querySelector("#rand").appendChild(char);
        char.style.opacity = "0.6";
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