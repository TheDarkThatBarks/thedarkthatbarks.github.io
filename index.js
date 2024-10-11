let body, projectWidth, projectHeight;
const aspectRatio = 20/9;
const widthPercent = 0.8;
const heightPercent = 0.9;

let currentProject = null;
let projectClosing = false;

let navHeight = null;

const refresh = function () {
    body = document.body.getBoundingClientRect();
    projectWidth = widthPercent * window.visualViewport.width;
    projectHeight = heightPercent * window.visualViewport.height;
    const button = currentProject.querySelector(".close");
    button.style.fontSize = `${projectHeight * 0.08 * 0.8}px`;
    currentProject.querySelector(".details-container").style.gridTemplateRows = `repeat(3, ${projectHeight * 0.35 / 3}px)`;
    console.log(getComputedStyle(currentProject.querySelector(".details-container")).gridTemplateRows);
};

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

const showProject = function(thumbnail) {
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
    project.style.height = `${startBox.height}px`;
    project.style.fontSize = "5px";
    project.style.lineHeight = "1.2";
    project.style.display = "flex";
    project.hidden = false;
    setTimeout(() => {
        project.style.top = `${0.5 * window.visualViewport.height - projectHeight / 2 + window.visualViewport.offsetTop}px`;
        project.style.left = `${0.5 * window.visualViewport.width - projectWidth / 2 + window.visualViewport.offsetLeft}px`;
        //project.style.width = `${projectWidth}px`;
        project.style.width = "80vw";
        //project.style.height = `${projectHeight}px`;
        project.style.height = "90vh";
        project.style.opacity = "1";
        project.style.backgroundSize = "100% 100%";
        project.style.fontSize = "16px";
        project.style.lineHeight = "1.2";
    }, 1);
    document.querySelector("#back").style.zIndex = "2";
    document.querySelector("#back").style.opacity = "0.6";
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
            project.style.fontSize = "5px";
            project.style.lineHeight = "1.2";
            project.scrollTop = 0;
            document.querySelector("#back").style.opacity = "0";
            setTimeout(() => {
                document.querySelector("#back").style.zIndex = "-2";
            }, 500);
            setTimeout(() => {
                project.style.display = "none";
                project.style.position = "fixed";
            }, Math.max(...getComputedStyle(project).transitionDuration.split(" ").map((d) => {
                return Number(d.split("s")[0]);
            })) * 1000);
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
    setTimeout(() => {
        element.remove();
    }, 2000);
    element.style.opacity = "0";
};

document.addEventListener("scroll", (event) => {
    const nav = document.querySelector("#hidden-nav");
    if (window.scrollY > navHeight)
        nav.style.visibility = "visible";
    if (window.scrollY <= navHeight)
        nav.style.visibility = "hidden";
});

const load = function () {
    const nav = document.querySelector("#hidden-nav");
    navHeight = document.querySelector("nav").getBoundingClientRect().top - parseFloat(getComputedStyle(nav).paddingTop) + window.scrollY;
    document.querySelectorAll(".anchor").forEach((element) => {
        element.style.scrollMarginTop = `${nav.getBoundingClientRect().height + 10}px`;
    });
    backgroundAnimation();
};

/*window.visualViewport.addEventListener("resize", (event) => {
    if (currentProject)
        resizeProject();
});*/

const resizeProject = function() {
    refresh();
    currentProject.style.top = `${0.5 * window.visualViewport.height - projectHeight / 2 + window.visualViewport.offsetTop}px`;
    currentProject.style.left = `${0.5 * window.visualViewport.width - projectWidth / 2 + window.visualViewport.offsetLeft}px`;
    currentProject.style.width = `${projectWidth}px`;
    currentProject.style.height = `${projectHeight}px`;
};

const revealDetails = function (details) {
    if (details.dataset.open == "1") {
        details.style.height = "0";
        details.dataset.open = "0";
    } else {
        details.style.height = "40%";
        details.dataset.open = "1";
    }
};

const changePage = function (button) {
    const pages = Array.from(currentProject.querySelectorAll("div.page"));
    const page = pages.indexOf(button.closest("div.page")) + (button.dataset.dir === "down" ? 1 : -1);
    currentProject.scrollTo(0, pages[page].getBoundingClientRect().top);
};