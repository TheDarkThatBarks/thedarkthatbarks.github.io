const desktop = window.matchMedia("(orientation: landscape)").matches;

const widthPercent = desktop ? 0.95 : 0.99;
const heightPercent = desktop ? 0.95 : 0.99;
let currentProject = null;

const refresh = function () {
    const projectHeight = heightPercent * window.visualViewport.height;

    const lastCol = currentProject.querySelector(".column-small:nth-last-child(2)");
    if (lastCol) {
        lastCol.style.marginRight = `-${projectHeight * 0.08 + 26}px`;

        const lastColFirstItem = currentProject.querySelector(".column-small:nth-last-child(2) > *:first-child");
        if (lastColFirstItem)
            lastColFirstItem.style.marginTop = `${projectHeight * 0.1}px`;
    }
    
    const details = currentProject.querySelector(".details-table");
    if (details)
        // details.style.gridTemplateRows = `repeat(${desktop ? 3 : 2}, ${desktop ? (projectHeight * 0.35 / 3) : (projectHeight * 0.24 / 2)}px)`;
        details.style.gridTemplateRows = `repeat(3, auto)`;
};

const showProject = function(thumbnail) {
    if (currentProject) {
        closeProject();
        return;
    }

    thumbnail.dataset.open = "1";
    const project = document.querySelector(`.${desktop ? "desktop" : "mobile"} > #${thumbnail.classList[0]}`);
    currentProject = project;
    refresh();

    const clone = thumbnail.parentElement.cloneNode();
    clone.style.backgroundImage = getComputedStyle(thumbnail).backgroundImage;
    clone.classList.add("thumbnail-clone");
    clone.id = "clone";

    const box = thumbnail.getBoundingClientRect();
    console.log(box);
    clone.style.top = `${box.top}px`;
    clone.style.left = `${box.left}px`;
    clone.style.height = `${box.height}px`;
    clone.style.width = `${box.width}px`;
    document.body.appendChild(clone);

    const newBackground = document.createElement("div");
    newBackground.classList.add("thumbnail-background");
    newBackground.style.backgroundImage = getComputedStyle(currentProject).backgroundImage;
    clone.appendChild(newBackground);

    setTimeout(() => {
        clone.style.top = desktop ? `${(100 - heightPercent * 100) / 2}vh` : "2.5px";
        clone.style.left = desktop ? `${(100 - widthPercent * 100) / 2}vw` : "2.5px";
        clone.style.width = `${widthPercent * 100}vw`;
        clone.style.height = `${heightPercent * 100}vh`;
        newBackground.style.opacity = "1";
    }, 1);
    
    project.style.top = desktop ? `${(100 - heightPercent * 100) / 2}vh` : "2.5px";
    project.style.left = desktop ? `${(100 - widthPercent * 100) / 2}vw` : "2.5px";
    project.style.width = `${widthPercent * 100}vw`;
    project.style.height = `${heightPercent * 100}vh`;
    project.style.fontSize = "5px";
    project.style.display = "flex";
    
    document.querySelector("#back").style.zIndex = "2";
    document.querySelector("#back").style.opacity = "0.6";

    setTimeout(() => {
        project.scrollTop = 0;
        project.scrollMarginTop = 0;
    }, 500);
    setTimeout(() => {
        project.style.opacity = "1";
        project.style.fontSize = "16px";
    }, 750);

    document.body.style.overflowY = "hidden";
};

const closeProject = function () {
    if (currentProject) {
        const project = currentProject;
        currentProject = null;
        
        const thumbnail = document.querySelector(`.${project.id}.thumbnail`);
        const clone = document.querySelector("#clone");
        const transition = getComputedStyle(clone).transition;
        clone.style.transition = "none";

        let box = clone.getBoundingClientRect();
        clone.style.position = "absolute";
        clone.style.top = `${box.top + window.scrollY}px`;
        clone.style.left = `${box.left}px`;
        clone.style.height = `${box.height}px`;
        clone.style.width = `${box.width}px`;

        project.style.opacity = "0";
        setTimeout(() => {
            clone.style.transition = transition;
            box = thumbnail.getBoundingClientRect();
            clone.style.top = `${box.top + window.scrollY}px`;
            clone.style.left = `${box.left}px`;
            clone.style.height = `${box.height}px`;
            clone.style.width = `${box.width}px`;

            project.style.display = "none";
            document.querySelector("#back").style.opacity = "0";
            clone.querySelector("div").style.opacity = "0";

            setTimeout(() => {
                document.querySelector("#back").style.zIndex = "-2";
            }, 500);
            setTimeout(() => {
                clone.remove();
                thumbnail.dataset.open = "0";
            }, 750);
        }, 500);

        document.body.style.overflowY = "initial";
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
};

document.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("floating", desktop && nav.getBoundingClientRect().top === parseInt(getComputedStyle(nav).top));
});

window.onload = function (event) {
    backgroundAnimation();
};

const fixAnchors = function () {
    const nav = document.querySelector("nav");
    document.querySelectorAll(".anchor").forEach((element) => {
        element.style.scrollMarginTop = `${nav.getBoundingClientRect().height + 30}px`;
    });
};

// const revealDetails = function (details) {
//     if (details.dataset.open == "1") {
//         details.style.height = `${details.querySelector(".button.details").getBoundingClientRect().height}px`;
//         details.dataset.open = "0";
//         details.querySelector(".arrow").style.transform = "rotate(0)";
//     } else {
//         details.style.height = `${details.querySelector(".button.details").getBoundingClientRect().height + details.querySelector(".details-table").getBoundingClientRect().height}px`;
//         details.dataset.open = "1";
//         details.querySelector(".arrow").style.transform = "rotate(90deg)";
//     }
// };