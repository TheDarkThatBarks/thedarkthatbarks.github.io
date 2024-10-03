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

const closeProject = function () {
    //console.log(currentProject);
    if (currentProject) {
        currentProject.style.display = "none";
        currentProject = null;
    }
};

document.addEventListener("click", function (event) {
    //console.log(event.target.className);
    if (currentProject && event.target.id.slice(0, event.target.id.indexOf("-")) != currentProject.id && event.target.className != "project" && !currentProject.contains(event.target)) {
        //console.log("close");
        closeProject(currentProject);
    }
});