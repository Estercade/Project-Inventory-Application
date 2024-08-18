// automatically detects user's dark mode preference and
// sets page theme appropriately then saves to local storage if allowed
const body = document.body;
const prefersThemeLight = window.matchMedia("(prefers-color-scheme: light)");
const themeToggle = document.querySelector(".themeToggleInput");


if (storageAvailable("localStorage")) {
    if (localStorage.theme) {
        let themePref = localStorage.getItem("theme");
        if (themePref === "theme-light") {
            body.classList = "theme-light";
        } else {
            body.classList = "theme-dark";
            themeToggle.setAttribute("checked", true);
        }
    } else {
        if (prefersThemeLight.matches) {
            body.classList = "theme-light";
            localStorage.setItem("theme", "theme-light");
        } else {
            body.classList = "theme-dark";
            localStorage.setItem("theme", "theme-dark");
            themeToggle.setAttribute("checked", true);
        }
    }
} else {
    if (prefersThemeLight.matches) {
        body.classList = "theme-light";
    } else {
        body.classList = "theme-dark";
        localStorage.setItem("theme", "theme-dark");
    }
}

// add event listener to toggle switch
themeToggle.addEventListener("change", e => {
    if (!e.target.checked) {
        body.classList = "theme-light";
        if (storageAvailable("localStorage")) {
            localStorage.setItem("theme", "theme-light");
        }
    } else {
        body.classList = "theme-dark";
        if (storageAvailable("localStorage")) {
            localStorage.setItem("theme", "theme-dark");
        }
    }
});

// check if local storage is available
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x ,x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException && 
            e.name === "QuotaExceededError " &&
            storage &&
            storage.length !== 0
        );
    }
}