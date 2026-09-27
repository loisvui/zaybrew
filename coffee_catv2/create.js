// create.js
//
// Only runs on create.html. Handles two things:
//   1. Letting the user add more than one ingredient row.
//   2. Turning the form into a recipe object and saving it (data.js).

document.addEventListener('DOMContentLoaded', () => {
  const addIngredientBtn = document.querySelector('.add-ingredient-btn');
  const ingredientInputs = document.querySelector('.ingredient-inputs');
  const form = document.querySelector('.recipe-form');

  addIngredientBtn.addEventListener('click', () => {
    ingredientInputs.appendChild(buildIngredientRow());
  });

  form.addEventListener('submit', handleSubmit);
});

// Creates one blank "name / amount" input pair, with a remove button
// so the user isn't stuck with rows they added by mistake.
function buildIngredientRow() {
  const row = document.createElement('div');
  row.className = 'ingredient-row';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Ingredient name';
  nameInput.className = 'ingredient-name';

  const amountInput = document.createElement('input');
  amountInput.type = 'text';
  amountInput.placeholder = 'Amount';
  amountInput.className = 'ingredient-amount';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-ingredient-btn';
  removeBtn.textContent = '×';
  removeBtn.setAttribute('aria-label', 'Remove ingredient');
  removeBtn.addEventListener('click', () => row.remove());

  row.append(nameInput, amountInput, removeBtn);
  return row;
}

function handleSubmit(event) {
  event.preventDefault(); // stop the browser's default full-page reload

  const recipe = readFormValues();

  if (!recipe.name) {
    showStatus('Give the recipe a name before saving.', 'error');
    return;
  }

  if (recipe.ingredients.length === 0) {
    showStatus('Add at least one ingredient.', 'error');
    return;
  }

  addRecipe(recipe);
  showStatus(`Saved "${recipe.name}" to your catalog.`, 'success');
  event.target.reset();
  resetIngredientRows();
}

// Reads every field currently on the page and shapes it into the same
// recipe object structure used in data.js / catalog.js.
function readFormValues() {
  const name = document.getElementById('recipe-name').value.trim();
  const brand = document.getElementById('recipe-brand').value.trim();
  const type = document.getElementById('recipe-type').value;
  const stepsRaw = document.getElementById('recipe-steps').value;
  const note = document.getElementById('recipe-note').value.trim();

  const ingredients = [];
  document.querySelectorAll('.ingredient-row').forEach(row => {
    const ingName = row.querySelector('.ingredient-name').value.trim();
    const ingAmount = row.querySelector('.ingredient-amount').value.trim();
    if (ingName) {
      ingredients.push({ name: ingName, amount: ingAmount });
    }
  });

  // Split the textarea into one step per non-empty line.
  const steps = stepsRaw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return {
    id: generateId(),
    name,
    brand,
    type,
    ingredients,
    steps,
    note
  };
}

// After a successful save, collapse the ingredient rows back down to
// a single blank one instead of leaving five empty rows on screen.
function resetIngredientRows() {
  const ingredientInputs = document.querySelector('.ingredient-inputs');
  ingredientInputs.innerHTML = '';
  ingredientInputs.appendChild(buildIngredientRow());
}

function showStatus(message, kind) {
  const statusEl = document.querySelector('.form-status');
  statusEl.textContent = message;
  statusEl.className = `form-status ${kind}`;
  statusEl.hidden = false;
}
