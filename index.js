const searchInput = document.querySelector(".page__search-input");
const container = document.querySelector(".page__search-container");

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

function renderSubmenu(data) {
  let submenu = document.querySelector(".page__search-submenu");
  const newSubmenu = document.createElement("ul");
  newSubmenu.classList.add("page__search-submenu");
  if (data) {
    data.items.forEach((repository) => {
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

const debouncedRender = debounce(createNewSubmenu, 300);

searchInput.addEventListener("input", debouncedRender);
