// Element references
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

// Load last search from localStorage
document.addEventListener("DOMContentLoaded", () => {
	const last = localStorage.getItem("lastSearch");
	if (last) {
		searchInput.value = last;
		searchMeals();
	}
});

searchBtn.addEventListener("click", searchMeals);
searchInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") searchMeals();
});
mealsContainer.addEventListener("click", handleMealClick);
backBtn.addEventListener("click", () => {
	mealDetails.classList.add("hidden");
	mealDetails.setAttribute("aria-hidden", "true");
});

async function searchMeals() {
	const searchTerm = searchInput.value.trim();
		if (!searchTerm) {
			errorContainer.textContent = "Please enter a search term (e.g. chicken)";
			errorContainer.classList.remove("hidden");
			return;
		}

	try {
		resultHeading.textContent = `正在搜索 "${searchTerm}"...`;
		mealsContainer.innerHTML = "";
		errorContainer.classList.add("hidden");

		const response = await fetch(`${SEARCH_URL}${encodeURIComponent(searchTerm)}`);
		if (!response.ok) throw new Error("网络响应错误");
		const data = await response.json();

			if (!data.meals) {
				resultHeading.textContent = "";
				mealsContainer.innerHTML = "";
				errorContainer.textContent = `No recipes found for "${searchTerm}". Try another search term.`;
				errorContainer.classList.remove("hidden");
			} else {
				resultHeading.textContent = `Search results for "${searchTerm}":`;
			displayMeals(data.meals);
			// save last search
			localStorage.setItem("lastSearch", searchTerm);
			// clear input if desired
			// searchInput.value = "";
		}
	} catch (error) {
			console.error(error);
			errorContainer.textContent = "Something went wrong. Please try again later.";
		errorContainer.classList.remove("hidden");
	}
}

function displayMeals(meals) {
	mealsContainer.innerHTML = "";
	meals.forEach((meal) => {
		const el = document.createElement("div");
		el.className = "meal";
		el.setAttribute("data-meal-id", meal.idMeal);
		el.innerHTML = `
			<img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
			<div class="meal-info">
				<h3 class="meal-title">${meal.strMeal}</h3>
				${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
			</div>
		`;
		mealsContainer.appendChild(el);
	});
}

async function handleMealClick(e) {
	const mealEl = e.target.closest(".meal");
	if (!mealEl) return;

	const mealId = mealEl.getAttribute("data-meal-id");
	try {
		const response = await fetch(`${LOOKUP_URL}${mealId}`);
		if (!response.ok) throw new Error("网络响应错误");
		const data = await response.json();
		if (data.meals && data.meals[0]) {
			const meal = data.meals[0];
			const ingredients = [];
			for (let i = 1; i <= 20; i++) {
				const ingredient = meal[`strIngredient${i}`];
				const measure = meal[`strMeasure${i}`];
				if (ingredient && ingredient.trim() !== "") {
					ingredients.push({ ingredient: ingredient.trim(), measure: (measure||"").trim() });
				}
			}

			mealDetailsContent.innerHTML = `
				<img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img" />
				<h2 class="meal-details-title">${meal.strMeal}</h2>
				<div class="meal-details-category"><span>${meal.strCategory || "未分类"}</span></div>
				<div class="meal-details-instructions">
					<h3>做法</h3>
					<p>${meal.strInstructions || "暂无"}</p>
				</div>
				<div class="meal-details-ingredients">
					<h3>材料</h3>
					<ul class="ingredients-list">
						${ingredients
							.map((item) => `<li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>`)
							.join("")}
					</ul>
				</div>
				${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" class="youtube-link"><i class="fab fa-youtube"></i> 查看视频</a>` : ""}
			`;

			mealDetails.classList.remove("hidden");
			mealDetails.setAttribute("aria-hidden", "false");
			mealDetails.scrollIntoView({ behavior: "smooth" });
		}
	} catch (error) {
		console.error(error);
		errorContainer.textContent = "无法加载菜谱详情，请稍后重试。";
		errorContainer.classList.remove("hidden");
	}
}

