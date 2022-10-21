const searchInput = document.querySelector(".page__search-input");
const searchContainer = document.querySelector(".page__search-container");
const resultContainer = document.querySelector(".page__results");

let repositoriesArray;

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

async function getSearchResponse(searchValue) {
  try {
    return await fetch(
      `https://api.github.com/search/repositories?q=${searchValue}&per_page=5`
    );
  } catch (e) {
    console.log(e);
  }
}

async function createNewSubmenu() {
  const searchValue = searchInput.value;
  try {
    if (searchValue) {
      const result = await getSearchResponse(searchValue);
      const response = await result.json();
      renderSubmenu(response);
    } else renderSubmenu();
  } catch (e) {
    console.log(e);
  }
}

function handleSubmenuClick(event) {
  let a = event.target.closest("a");
  if (!a) return;
  let id = a.id;
  addRepository(id);
  renderSubmenu();
}

function addRepository(id) {
  repositoriesArray.items.forEach((repository) => {
    if (repository.id == id) {
      renderCard(repository);
    }
  });
}

function handleCardRemoving(event) {
  let button = event.target.closest("button");
  if (!button) return;
  let card = button.closest("li");
  card.remove();
}

function renderCard(repository) {
  const card = document.createElement("li");
  card.classList.add("page__results-item");
  const textContainer = document.createElement("div");
  textContainer.classList.add("page__item-text");
  const closeButton = document.createElement("button");
  closeButton.classList.add("page__item-remove");
  const cardName = document.createElement("p");
  cardName.classList.add(`page__item-content`, `page__item-content_type_name`);
  cardName.textContent = `Name: ${repository.name}`;
  const cardOwner = document.createElement("p");
  cardOwner.classList.add(
    `page__item-content`,
    `page__item-content_type_owner`
  );
  cardOwner.textContent = `Owner: ${repository.owner.login}`;
  const cardStars = document.createElement("p");
  cardStars.classList.add(
    `page__item-content`,
    `page__item-content_type_stars`
  );
  cardStars.textContent = `Stars: ${repository.stargazers_count}`;
  textContainer.appendChild(cardName);
  textContainer.appendChild(cardOwner);
  textContainer.appendChild(cardStars);
  card.appendChild(textContainer);
  card.appendChild(closeButton);
  resultContainer.appendChild(card);
}

function renderSubmenu(repositories) {
  repositoriesArray = repositories;
  let submenu = document.querySelector(".page__search-submenu");
  const newSubmenu = document.createElement("ul");
  newSubmenu.classList.add("page__search-submenu");
  if (repositoriesArray) {
    repositoriesArray.items.forEach((repository) => {
      const item = renderSubmenuItem(repository);
      newSubmenu.appendChild(item);
    });
  }
  submenu.replaceWith(newSubmenu);
}

function renderSubmenuItem(item) {
  const menuItem = document.createElement("li");
  menuItem.classList.add("page__submenu-item");
  const menuLink = document.createElement("a");
  menuLink.classList.add("page__submenu-link");
  menuLink.textContent = item.name;
  menuLink.id = item.id;
  menuItem.appendChild(menuLink);
  return menuItem;
}

const debouncedRender = debounce(createNewSubmenu, 300);

searchInput.addEventListener("input", debouncedRender);
searchContainer.addEventListener("click", (e) => handleSubmenuClick(e));
resultContainer.addEventListener("click", (e) => handleCardRemoving(e));
