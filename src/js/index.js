const moodTextArea = document.getElementById("mood-textarea");
const searchButton = document.getElementById("search-button");

document.addEventListener("DOMContentLoaded", () => {
	setupEventListeners();
});

function setupEventListeners() {
	moodTextArea.addEventListener("keypress", event => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSearch();
		}
	});

	searchButton.addEventListener("click", handleSearch);
}

async function handleSearch() {
	const mood = moodTextArea.value.trim();

	if (!mood) {
		alert("Fill in the mood field!");
		return;
	}

	const resultsDiv = document.getElementById("results");
	const moviesGrid = document.getElementById("movies-grid");
	const loader = document.getElementById("loader");
	const resultsTitle = document.getElementById("results-title");

	resultsDiv.classList.add("show");
	moviesGrid.innerHTML = "";

	// 🔹 Esconde o título e mostra loader
	resultsTitle.style.display = "none";
	loader.style.display = "block";

	// 🔹 Chama o n8n (que já faz o papel da IA e devolve o nome do anime)
	const response = await fetch("https://fmlevy.app.n8n.cloud/webhook/search-anime", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userPrompt: mood }),
	});

	const data = await response.json();

	// 🔹 Esconde loader e mostra título de volta
	loader.style.display = "none";
	resultsTitle.style.display = "block";

	// 🔹 Aqui, o n8n já retorna os dados completos do anime
	if (data && data.data && data.data.length > 0) {
		const anime = data.data[0];

		const animeCard = document.createElement("div");
		animeCard.classList.add("movie-card");

		animeCard.innerHTML = `
			<div class="movie-poster">
				<img src="${anime.images.jpg.image_url}" alt="${anime.title}" />
			</div>
			<div class="movie-info">
				<div class="movie-title">${anime.title}</div>
				<div class="movie-overview">${anime.synopsis || "No description available."}</div>
				<div class="movie-rating">
					⭐ ${anime.score ? anime.score.toFixed(1) : "N/A"} / 10<br>
					📺 ${anime.type || "Desconhecido"} — ${anime.episodes || "?"} episódios
				</div>
			</div>
		`;
		moodTextArea.value = "";

		moviesGrid.appendChild(animeCard);
	} else {
		moviesGrid.innerHTML = "<p>No anime found.</p>";
	}
}
