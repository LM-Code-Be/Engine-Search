// Fonctionnalité d'onglets
const allTab = document.getElementById("all-tab");
const imagesTab = document.getElementById("images-tab");
const resultsContainer = document.getElementById("results");
const imagesContainer = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

// Gestion des clics sur les onglets
allTab.addEventListener("click", function (e) {
    e.preventDefault();
    allTab.classList.add("active");
    imagesTab.classList.remove("active");
    resultsContainer.style.display = "block";
    imagesContainer.style.display = "none";
    showMoreBtn.style.display = "none"; // Cacher le bouton "Voir plus"
});

imagesTab.addEventListener("click", function (e) {
    e.preventDefault();
    allTab.classList.remove("active");
    imagesTab.classList.add("active");
    resultsContainer.style.display = "none";
    imagesContainer.style.display = "grid";
    if (imagesContainer.children.length > 0) {
        showMoreBtn.style.display = "block"; // Montrer le bouton "Voir plus" s'il y a des images
    }
});

// Recherche Wikipedia et Images
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let query = document.getElementById('searchQuery').value.trim();
    if (query === "") {
        alert("Veuillez entrer un terme de recherche.");
        return;
    }
    resultsContainer.innerHTML = ""; // Réinitialiser les résultats texte
    imagesContainer.innerHTML = ""; // Réinitialiser les résultats images
    searchWikipedia(query);
    searchImages(query);
});

// Recherche sur Wikipedia
async function searchWikipedia(query) {
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.query.search.length > 0) {
            displayWikipediaResults(data.query.search, resultsContainer);
        } else {
            displayNoResultsMessage(resultsContainer, "Aucun résultat trouvé sur Wikipedia.");
        }
    } catch (error) {
        console.error("Erreur lors de la recherche sur Wikipedia :", error);
        displayNoResultsMessage(resultsContainer, "Erreur lors de la recherche sur Wikipedia.");
    }
}

// Affichage des résultats Wikipedia
function displayWikipediaResults(results, container) {
    let groupTitle = document.createElement('h3');
    groupTitle.textContent = "Résultats Wikipedia";
    container.appendChild(groupTitle);

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item p-3 mb-2 bg-light border';

        const resultTitle = document.createElement('h4');
        const resultLink = document.createElement('a');
        resultLink.href = `https://en.wikipedia.org/?curid=${result.pageid}`;
        resultLink.target = "_blank";
        resultLink.textContent = result.title;

        const resultSnippet = document.createElement('p');
        resultSnippet.innerHTML = result.snippet + "...";

        resultTitle.appendChild(resultLink);
        resultItem.appendChild(resultTitle);
        resultItem.appendChild(resultSnippet);

        container.appendChild(resultItem);
    });
}

// Recherche d'images via Unsplash
const accessKey = "rq9OoN6Qq_Gv1n_Cdk_S0fFx2Km6rHHbbfQyhKxGOgo";
let page = 1;

async function searchImages(query) {
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${accessKey}&per_page=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (page === 1) {
            imagesContainer.innerHTML = ""; // Réinitialiser les résultats d'image
        }

        data.results.forEach(result => {
            const image = document.createElement("img");
            image.src = result.urls.small;
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";

            imageLink.appendChild(image);
            imagesContainer.appendChild(imageLink);
        });

        if (data.results.length > 0) {
            showMoreBtn.style.display = "block";
        } else if (page === 1) {
            displayNoResultsMessage(imagesContainer, "Aucune image trouvée.");
        }
    } catch (error) {
        console.error("Erreur lors de la recherche d'images :", error);
        displayNoResultsMessage(imagesContainer, "Erreur lors de la recherche d'images.");
    }
}

// Gestion du bouton "Voir plus" pour la recherche d'images
showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages(document.getElementById("searchQuery").value);
});

// Message pour aucun résultat
function displayNoResultsMessage(container, message) {
    let noResultsMessage = document.createElement('div');
    noResultsMessage.textContent = message;
    noResultsMessage.className = 'alert alert-danger';
    container.appendChild(noResultsMessage);
}