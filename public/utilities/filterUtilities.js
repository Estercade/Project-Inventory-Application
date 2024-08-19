// toggle filters bar and styling when filter bar is shown
const filterButton = document.querySelector(".showFiltersButton");
const filtersContainer = document.querySelector(".filtersContainer");
const closeFiltersButton = document.querySelector(".closeFiltersButton");
const inventoryItems = Array.from(document.querySelectorAll(".inventoryItem"));

filterButton.addEventListener('click', toggleFilters);
closeFiltersButton.addEventListener('click', toggleFilters);

let filtersHidden = true;

function toggleFilters() {
    if (filtersHidden === true) {
        filterButton.classList.replace('filtersHidden', 'filtersShown');
        filtersContainer.classList.replace('filtersHidden', 'filtersShown');
        inventoryItems.forEach((element) => element.classList.replace('filtersHidden', 'filtersShown'));
        filtersHidden = false;
    } else {
        filterButton.classList.replace('filtersShown', 'filtersHidden');
        filtersContainer.classList.replace('filtersShown', 'filtersHidden');
        inventoryItems.forEach((element) => element.classList.replace('filtersShown', 'filtersHidden'));
        filtersHidden = true;
    }
}

// set minimum value for maximum price input field to 
// the value of the minimum price input field
const minPriceInput = document.querySelector(".priceMinimumInput");
const maxPriceInput = document.querySelector(".priceMaximumInput");

minPriceInput.addEventListener('change', setPriceLimits);
maxPriceInput.addEventListener('change', setPriceLimits);

function setPriceLimits() {
    maxPriceInput.setAttribute("min", Number(minPriceInput.value));
}

// add event listener to sort selector
const sortbySelector = document.querySelector(".sortbySelector");
sortbySelector.addEventListener('change', redirectedToSort);

const currentURL = document.URL;

function redirectedToSort() {
    let newPath = "";
    if (currentURL.includes('sortby')) {
        let subStringArr = currentURL.split('sortby');
        newPath = `${subStringArr[0]}sortby=${sortbySelector.value}`;
    } else if (currentURL.includes('filter')) {
        newPath = `${currentURL}&sortby=${sortbySelector.value}`;
    } else {
        newPath = `${currentURL}filter/sortby=${sortbySelector.value}`;
    }
    window.location.replace(newPath);
}

const currentPath = window.location.pathname.slice(8);

let paramsArray = currentPath.split('&');
paramsArray.forEach((param) => {
    if (param.startsWith('sortby')) {
        let selectedSort = param.slice(7);
        const targetSortSelection = document.querySelector(`.${selectedSort}`);
        targetSortSelection.setAttribute('selected', 'selected');
    } else if (param.startsWith('type')) {
        let selectedTypesArray = param.slice(5).split(",");
        selectedTypesArray.forEach((selected) => {
            let target = document.getElementById(`${selected}FilterSelector`);
            target.checked = true;
        })
    } else if (param.startsWith('generation')) {
        let selectedGenerationsArray = param.slice(11).split(",");
        selectedGenerationsArray.forEach((selected) => {
            let target = document.getElementById(`generation${selected}FilterSelector`);
            target.checked = true;
        })
    } else if (param.startsWith('rarity')) {
        let selectedRarityArray = param.slice(7).split(",");
        selectedRarityArray.forEach((selected) => {
            let target = document.getElementById(`${selected}FilterSelector`);
            target.checked = true;
        })
    } else if (param.startsWith('shiny')) {
        let selectedShinyArray = param.slice(6).split(",");
        selectedShinyArray.forEach((selected) => {
            if (selected === 'true') {
                let target = document.getElementById(`shinyFilterSelector`);
                target.checked = true;
            } else {
                let target = document.getElementById(`notShinyFilterSelector`);
                target.checked = true;
            }
        })
    } else if (param.startsWith('minimum')) {
        let selectedMinimumValue = Number(param.slice(8));
        let target = document.getElementById(`priceMinimumInput`);
        target.value = selectedMinimumValue;
    } else if (param.startsWith('maximum')) {
        let selectedMaximumValue = Number(param.slice(8));
        let target = document.getElementById(`priceMaximumInput`);
        target.value = selectedMaximumValue;
    }
})