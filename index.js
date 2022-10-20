// function getPost2() {
//   return Promise.resolve().then(() => {
//     return fetch(
//       `https://api.github.com/search/repositories?q=stars%3A%3E0&sort=stars&order=desc&page=1`
//     ).then((response) => response.json());
//   });
// }

// getPost2()
//   .then((post) => console.log(post))
//   .catch((err) => console.log(err));

const searchInput = document.querySelector(".page__search-input");

async function getSearchResult() {
  const searchValue = searchInput.value;
  const result = await fetch(
    `https://api.github.com/search/repositories?${searchValue}`
  );
  const response = await result.json();
  console.log(response);
}

searchInput.addEventListener("input", getSearchResult);
