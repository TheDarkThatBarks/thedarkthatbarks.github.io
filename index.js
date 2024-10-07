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
    const button = currentProject.querySelector(".close");
    button.style.fontSize = `${projectHeight * 0.1 * 0.8}px`;
    console.log(button.style.fontSize);
};

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

const showProject = function(thumbnail) {
    console.log(currentProject);
    if (currentProject) {
        console.log("DEBUG");
        closeProject();
        return;
    }
    const project = document.querySelector(`#${thumbnail.classList[0]}`);
    currentProject = project;
    refresh();
    thumbnail.dataset.open = "1";

    const startBox = thumbnail.getBoundingClientRect();
    project.style.top = `${startBox.top}px`;
    project.style.left = `${startBox.left}px`;
    project.style.width = `${startBox.width}px`;
    project.style.height = `${startBox.height}px`

    project.style.display = "flex";
    project.hidden = false;
    setTimeout(() => {
        project.style.top = `${0.5 * body.height - projectHeight / 2}px`;
        project.style.left = `${0.5 * body.width - projectWidth / 2}px`;
        project.style.width = `${projectWidth}px`;
        project.style.height = `${projectHeight}px`;
        project.style.opacity = "1";
        project.style.backgroundSize = "100% 100%";
    }, 1);
};

const closeProject = function () {
    if (currentProject) {
        const project = currentProject;
        currentProject = null;
        const thumbnail = document.querySelector(`.${project.id}.thumbnail`);
        thumbnail.dataset.open = "0";
        const transition = getComputedStyle(project).transition;
        project.style.transition = "none";
        project.style.top = `${project.getBoundingClientRect().top + window.scrollY}px`;
        project.style.position = "absolute";
        setTimeout(() => {
            project.style.transition = transition;
            const box = thumbnail.getBoundingClientRect();
            project.style.top = `${box.top + window.scrollY}px`;
            project.style.left = `${box.left}px`;
            project.style.width = `${box.width}px`;
            project.style.height = `${box.height}px`
            project.style.opacity = "0";
            project.style.backgroundSize = "100% 100%";
            setTimeout(() => {
                project.style.display = "none";
                project.style.position = "fixed";
            }, 750);
        }, 1);
    }
};

document.addEventListener("click", function (event) {
    if (currentProject && event.target.classList[0] != currentProject.id && event.target.className != "project" && !currentProject.contains(event.target))
        closeProject(currentProject);
});

const backgroundAnimation = function () {
    setInterval(() => {
        const char = document.createElement("p");
        char.className = "randLetter";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=;:\'\"[{]}\\|`~,<.>/?";
        char.innerHTML = characters.charAt(Math.floor(Math.random() * characters.length));
        const main = document.querySelector("#main").getBoundingClientRect();
        char.style.left = `${Math.random() * (main.width * 0.8) + main.width * 0.1}px`;
        char.style.top = `${Math.random() * (main.height * 0.9)}px`;
        document.querySelector("#background").appendChild(char);
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