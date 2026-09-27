// catalog.js
//
// Only runs on index.html. Its one job: take whatever recipes are in
// storage (see data.js) and turn them into HTML on the page.

const TYPE_LABELS = {
  milk: 'Milk drink',
  black: 'Black coffee',
  cold: 'Cold brew'
};

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
});

function renderCatalog() {
  const recipes = getRecipes();
  const grid = document.querySelector('.catalog-grid');
  const emptyState = document.querySelector('.empty-state');
  const count = document.querySelector('.section-heading .count');

  grid.innerHTML = '';

  count.textContent = recipes.length === 1
    ? '1 recipe'
    : `${recipes.length} recipes`;

  if (recipes.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  recipes.forEach(recipe => {
    grid.appendChild(buildRecipeCard(recipe));
  });
}

// Builds one <article class="recipe-card"> element from a recipe
// object. Using document.createElement + small helper functions here
// instead of one giant innerHTML string, so it's easier to follow
// piece by piece.
function buildRecipeCard(recipe) {
  const card = document.createElement('article');
  card.className = 'recipe-card';

  const top = document.createElement('div');
  top.className = 'card-top';

  const tag = document.createElement('span');
  tag.className = `tag tag-${recipe.type}`;
  tag.textContent = TYPE_LABELS[recipe.type] || recipe.type;

  const title = document.createElement('h3');
  title.textContent = recipe.name;

  const brand = document.createElement('p');
  brand.className = 'brand';
  brand.textContent = recipe.brand;

  top.append(tag, title, brand);

  const details = document.createElement('details');
  details.className = 'recipe-details';

  const summary = document.createElement('summary');
  summary.textContent = 'Ingredients & steps';

  const body = document.createElement('div');
  body.className = 'details-body';
  body.append(
    buildIngredientList(recipe.ingredients),
    buildStepList(recipe.steps)
  );

  if (recipe.note) {
    const note = document.createElement('p');
    note.className = 'note';
    note.textContent = `Note: ${recipe.note}`;
    body.appendChild(note);
  }

  details.append(summary, body);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete recipe';
  deleteBtn.addEventListener('click', () => {
    const confirmed = confirm(`Delete "${recipe.name}"? This can't be undone.`);
    if (confirmed) {
      deleteRecipe(recipe.id);
      renderCatalog();
    }
  });

  card.append(top, details, deleteBtn);
  return card;
}

function buildIngredientList(ingredients) {
  const wrapper = document.createDocumentFragment();

  const heading = document.createElement('h4');
  heading.textContent = 'Ingredients';

  const list = document.createElement('ul');
  list.className = 'ingredient-list';

  ingredients.forEach(item => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = item.name;
    const amount = document.createElement('span');
    amount.textContent = item.amount;
    li.append(name, amount);
    list.appendChild(li);
  });

  wrapper.append(heading, list);
  return wrapper;
}

function buildStepList(steps) {
  const wrapper = document.createDocumentFragment();

  const heading = document.createElement('h4');
  heading.textContent = 'Steps';

  const list = document.createElement('ol');
  list.className = 'step-list';

  steps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    list.appendChild(li);
  });

  wrapper.append(heading, list);
  return wrapper;
}
