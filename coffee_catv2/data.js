// data.js
//
// Shared by both index.html (catalog) and create.html (form).
// This is the ONLY file that talks to localStorage. Both pages call
// these functions instead of touching localStorage directly — that
// way if you ever change how/where recipes are stored, you only
// change it in one place.

const STORAGE_KEY = 'pourlist_recipes';

// Used only the very first time the site runs, so the catalog isn't
// empty on a fresh browser. After that, everything comes from
// localStorage. Kept to a single, simple example — add more of your
// own through the "Add a recipe" page.
const DEFAULT_RECIPES = [
  {
    id: 'default-1',
    name: 'Simple Iced Latte',
    brand: 'Stumptown — Hair Bender',
    type: 'milk',
    ingredients: [
      { name: 'Espresso', amount: '2 shots (36g)' },
      { name: 'Cold milk', amount: '180 ml' },
      { name: 'Ice', amount: '1 cup' }
    ],
    steps: [
      'Fill a glass with ice.',
      'Pour in the cold milk.',
      'Pull two shots of espresso and pour over the top.'
    ],
    note: 'Stir gently once poured so it doesn\u2019t layer too much.'
  }
];

// Reads recipes from localStorage. If nothing has been saved yet
// (first visit), seed it with the defaults so the page isn't blank.
function getRecipes() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    saveRecipes(DEFAULT_RECIPES);
    return DEFAULT_RECIPES;
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Could not parse saved recipes, resetting to defaults.', err);
    saveRecipes(DEFAULT_RECIPES);
    return DEFAULT_RECIPES;
  }
}

// Overwrites the full saved list. localStorage only stores strings,
// so we have to JSON.stringify the array first.
function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

// Adds one new recipe to whatever is currently saved.
function addRecipe(recipe) {
  const recipes = getRecipes();
  recipes.push(recipe);
  saveRecipes(recipes);
}

// Removes one recipe by id.
function deleteRecipe(id) {
  const recipes = getRecipes().filter(recipe => recipe.id !== id);
  saveRecipes(recipes);
}

// Small helper so both pages generate ids the same way, without
// needing a real backend/database.
function generateId() {
  return 'recipe-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}
