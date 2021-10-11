const searchBtn = document.getElementById('search-btn');
const inputText = document.querySelector('#search-input');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const dataList = document.querySelector('.data-list');
const li = document.querySelector('.indi-data')

//event listners
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', closebtn);
searchBtn.addEventListener('click', getMealList);

inputText.addEventListener('keyup', dropdown);

async function dropdown(){
     dataList.style.display = 'block';
     const text = inputText.value;
     const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
     const data = await res.json();
     const {meals} = data;

     //get matches to current inputs
     let matches = meals.filter(meal => {
          const regex = new RegExp(`^${text}`, 'gi');
          return meal.strIngredient.match(regex)
     });
     
     if(text.length === 0) {
          matches = [];
     }

     outputHtml(matches);
     
}

function outputHtml(matches) {
     if(matches.length > 0){
          const html = matches.map(match => `
               <li class="indi-data">${match.strIngredient}</li>
          `).join('');
          dataList.innerHTML = html;
     }
     else{
          dataList.style.display = 'none';
     }
}

dataList.addEventListener('click', e => {
     const newText = e.target.innerText;
     inputText.value = newText;
     getMealList(e);
})


function getMealList(e){
     e.preventDefault();
     let searchInputTxt = document.getElementById('search-input').value.trim();
     fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
     .then(response => response.json())
     .then(data => {
          let html = '';
          if(data.meals){
               data.meals.forEach(meal => {
                    html += `
                         <div class="meal-item" data-id="${meal.idMeal}">
                         <div class="meal-img">
                              <img src="${meal.strMealThumb}" alt="food">
                         </div>
                         <div class="meal-name">
                              <h3>${meal.strMeal}</h3>
                              <a href="#" class="recipe-btn">Get recipe</a>
                         </div>
                    </div>
                    `;
               });
               mealList.classList.remove('notFound');
          }else{
               html = "Sorry, we didn't find any meal!";
               mealList.classList.add('notFound');
          }
          

          mealList.innerHTML = html;
          dataList.style.display = 'none';
     });
     
}


// get recipe of the meal
function getMealRecipe(e){
     if(e.target.classList.contains('recipe-btn')){
          let mealItem = e.target.parentElement.parentElement;
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
          .then(response => response.json())
          .then(data => mealRecipeModal(data.meals));
     }

     e.preventDefault();
     
}

//create a modal
function mealRecipeModal(meal){
     meal = meal[0];
     let html = `
     <h2 class="recipe-title">${meal.strMeal}</h2>
     <p class="recipe-category">${meal.strCategory}</p>
     <div class="recipe-instruct">
          <h3>Instuctions:</h3>
          <p>${meal.strInstructions}</p>
     </div>
     <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="">
     </div>
     <div class="recipe-link">
          <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
     </div>
     `;
     mealDetailsContent.innerHTML = html;
     mealDetailsContent.parentElement.classList.add('showRecipe');
}

function closebtn(){
     mealDetailsContent.parentElement.classList.remove('showRecipe');
}