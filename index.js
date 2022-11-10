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
      if (response.total_count === 0) {
        alert("Репозиторий не найден");
      } else {
        renderSubmenu(response);
      }
    } else renderSubmenu();
  } catch (e) {
    console.log(e);
  }
}

function handleSubmenuClick(event) {
  let a = event.target.closest("a");
  if (!a) return;
  let id = a.id;
  const list = document.querySelectorAll(".page__results-item");
  if (list.length > 0) {
    const listIterable = [...list];
    for (let item of listIterable) {
      if (item.id === id) {
        alert("Такой репозиторий уже есть в списке");
        renderSubmenu();
        searchInput.value = "";
        return;
      }
    }
  }
  addRepository(id);
  renderSubmenu();
}

function addRepository(id) {
  repositoriesArray.items.forEach((repository) => {
    if (repository.id == id) {
      renderCard(repository);
      searchInput.value = "";
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
  card.id = repository.id;
  const textContainer = document.createElement("div");
  textContainer.classList.add("page__item-text");
  const closeButton = document.createElement("button");
  closeButton.classList.add("page__item-remove");
  const cardName = document.createElement("p");
  cardName.classList.add(`page__item-content`);
  cardName.textContent = `Name: ${repository.name}`;
  const cardOwner = document.createElement("p");
  cardOwner.classList.add(`page__item-content`);
  cardOwner.textContent = `Owner: ${repository.owner.login}`;
  const cardStars = document.createElement("p");
  cardStars.classList.add(`page__item-content`);
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
  const menuLinkName = document.createElement("h2");
  menuLinkName.classList.add("page__submenu-name");
  const menuLinkAuthor = document.createElement("p");
  menuLinkAuthor.classList.add("page__submenu-author");
  menuLinkName.textContent = item.name;
  menuLinkAuthor.textContent = item.owner.login;
  menuLink.id = item.id;
  menuLink.appendChild(menuLinkName);
  menuLink.appendChild(menuLinkAuthor);
  menuItem.appendChild(menuLink);
  return menuItem;
}

const debouncedRender = debounce(createNewSubmenu, 300);

searchInput.addEventListener("input", debouncedRender);
searchContainer.addEventListener("click", handleSubmenuClick);
resultContainer.addEventListener("click", handleCardRemoving);

// TODO: 1. добавить оповещение если репозиторий не найден. 2. добавить подпись автора, чтобы не было 10 репов с одним именем
