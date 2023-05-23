import Notiflix from 'notiflix';
import PicturesService from './PicturesService.js';
import LoadMoreBtn from './components/LoadMoreBtn.js';
import refs from './refs.js';
import '../css/styles.css';

const picturesService = new PicturesService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.formEl.addEventListener('submit', onsubmit);
loadMoreBtn.button.addEventListener('click', fetchPictures);
// window.addEventListener('scroll', handleScroll);

async function onsubmit(event) {
  event.preventDefault();
  loadMoreBtn.hide();
  const {
    elements: { searchQuery },
  } = event.currentTarget;
  const value = searchQuery.value.trim();
  if (!value) {
    return;
  } else {
    picturesService.searchQuery = value;
    picturesService.resetPage();
    clearGallery();
    const totalHits = await fetchPictures().finally(() => {
      refs.formEl.reset();
    });
    if (totalHits !== undefined) showTotalHits(totalHits);
  }
}

async function fetchPictures() {
  loadMoreBtn.disable();
  const totalHits = await getPicturesMarkup();
  loadMoreBtn.enable();
  return totalHits;
}

async function getPicturesMarkup() {
  try {
    const { hits, totalHits } = await picturesService.getPictures();
    if (hits.length === 0 && totalHits !== 0) throw new Error('Finish');
    if (hits.length === 0 && totalHits === 0) throw new Error('No such images');
    return createMarkup(hits, totalHits);
  } catch (error) {
    onError(error);
  }
}

function createMarkup(data, totalHits) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b class='info-title'>Likes</b><span class='accent'>${likes}</span>
    </p>
    <p class="info-item">
      <b class='info-title'>Views</b><span class='accent'>${views}</span>
    </p>
    <p class="info-item">
      <b class='info-title'>Comments</b><span class='accent'>${comments}</span>
    </p>
    <p class="info-item">
      <b class='info-title'>Downloads</b><span class='accent'>${downloads}</span>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  updatePicturesList(markup);
  showLoadMoreBtn(totalHits);
  return totalHits;
}

function updatePicturesList(markup) {
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.galleryEl.innerHTML = '';
}

function onError(error) {
  loadMoreBtn.hide();

  if (error.message === 'Finish') {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else if (error.message === 'No such images')
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
}

function showTotalHits(totalHits) {
  if (totalHits === 1)
    Notiflix.Notify.info(`Hooray! We found ${totalHits} image.`);
  else Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
}

function showLoadMoreBtn(totalHits) {
  const per_page = picturesService.per_page;
  if (totalHits < per_page) loadMoreBtn.hide();
  else loadMoreBtn.show();
}
// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     fetchPictures();
//   }
// }

// для  тестування в input
// fdf - 1 photo
// fd - 3 photo;
// fr - 26 photo;
// cat - 500 photo
