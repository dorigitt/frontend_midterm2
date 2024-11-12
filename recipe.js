const searchInput = document.getElementById('search');
        const suggestionsBox = document.getElementById('suggestions');
        const recipesContainer = document.getElementById('recipes');
        const recipeModal = document.getElementById('recipeModal');
        const modalContent = document.getElementById('modalContent');
        const favoriteRecipesContainer = document.getElementById('favorite-recipes');

        async function fetchSuggestions(query) {
            const response = await fetch(`https://api.spoonacular.com/recipes/autocomplete?number=5&query=${query}&apiKey=9a21f8bf4e3148d4906d0c7c755cced9`);
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            return [];
        }

        async function fetchRecipes(query) {
            const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=9a21f8bf4e3148d4906d0c7c755cced9`);
            if (response.ok) {
                const data = await response.json();
                return data.results;
            }
            return [];
        }

        async function fetchRecipeDetails(id) {
            const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=9a21f8bf4e3148d4906d0c7c755cced9`);
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            return null;
        }

        function showSuggestions(suggestions) {
            suggestionsBox.innerHTML = '';
            if (suggestions.length) {
                suggestionsBox.style.display = 'block';
                suggestions.forEach(suggestion => {
                    const suggestionDiv = document.createElement('div');
                    suggestionDiv.textContent = suggestion.title;
                    suggestionDiv.addEventListener('click', () => {
                        searchInput.value = suggestion.title;
                        suggestionsBox.style.display = 'none';
                        loadRecipes(suggestion.title);
                    });
                    suggestionsBox.appendChild(suggestionDiv);
                });
            } else {
                suggestionsBox.style.display = 'none';
            }
        }

        async function loadRecipes(query) {
            const recipes = await fetchRecipes(query);
            displayRecipes(recipes);
        }

        function displayRecipes(recipes) {
            recipesContainer.innerHTML = recipes.map(recipe => `
                <div class="recipe-card" data-id="${recipe.id}">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>Preparation time: ${recipe.readyInMinutes} minutes</p>
                    <button onclick="showRecipeDetails(${recipe.id})">View Details</button>
                    <button onclick="addToFavorites(${recipe.id}, '${recipe.title}', '${recipe.image}')">Add to Favorites</button>
                </div>
            `).join('');
        }

        async function showRecipeDetails(id) {
            const recipe = await fetchRecipeDetails(id);
            modalContent.innerHTML = `
                <h2>${recipe.title}</h2>
                <div class="flex">
                    <img src="${recipe.image}" alt="${recipe.title}" style="width: 50%;">
                    <div>
                        <h3>Ingredients</h3>
                        <ul>
                            ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <h3>Instructions</h3>
                <p>${recipe.instructions}</p>
                <h3>Nutritional Information</h3>
                <p>Calories: ${recipe.nutrition.nutrients.find(n => n.name === 'Calories').amount} kcal</p>
            `;
            recipeModal.style.display = 'flex';
        }

        function closeModal() {
            recipeModal.style.display = 'none';
        }

        function addToFavorites(id, title, image) {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const isAlreadyFavorited = favorites.some(recipe => recipe.id === id);
            if (!isAlreadyFavorited) {
                favorites.push({ id, title, image });
                localStorage.setItem('favorites', JSON.stringify(favorites));
                displayFavoriteRecipes();
            }
        }

        function displayFavoriteRecipes() {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favoriteRecipesContainer.innerHTML = favorites.map(favorite => `
                <div class="recipe-card">
                    <img src="${favorite.image}" alt="${favorite.title}">
                    <h3>${favorite.title}</h3>
                </div>
            `).join('');
        }

        searchInput.addEventListener('input', async (event) => {
            const query = event.target.value.trim();
            if (query.length > 1) {
                const suggestions = await fetchSuggestions(query);
                showSuggestions(suggestions);
            } else {
                suggestionsBox.style.display = 'none';
            }
        });

        document.addEventListener('click', (event) => {
            if (!suggestionsBox.contains(event.target)&&event.target !==searchInput) {
                suggestionsBox.style.display = 'none';
            }
        });

        document.addEventListener('DOMContentLoaded',displayFavoriteRecipes);