// -----api.js
//   //   q: `${value}`,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: 'true',
//   //   key: '36526850-4de1e998f6db27b12a1d4f142',
// });
// value = 'cat';
function fetchPictures(value, page) {
  return fetch(
    `${BASE_URL}/?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
  });
}

// fetchPictures('cat').then(result => console.log(result));
export default { fetchPictures };
