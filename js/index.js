// Создание и рендер разметки по массиву данных galleryItems из app.js и предоставленному шаблону. \/
// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// Открытие модального окна по клику на элементе галереи.
// Подмена значения атрибута src элемента img.lightbox__image.
// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
// Очистка значения атрибута src элемента img.lightbox__image.
// Это необходимо для того, чтобы при следующем открытии модального окна,
//     пока грузится изображение, мы не видели предыдущее.

// Закрытие модального окна по клику на div.lightbox__overlay.
// Закрытие модального окна по нажатию клавиши ESC.
// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

import { galleryItems } from "./app.js";

const refs = {
  galleryEl: document.querySelector(".js-gallery"),
  modalEl: document.querySelector(".js-lightbox"),
  overlayEl: document.querySelector(".lightbox__overlay"),
  modalImgEl: document.querySelector(".lightbox__image"),
  modalCloseBtn: document.querySelector('button[data-action="close-lightbox"]'),
};

refs.galleryEl.insertAdjacentHTML("beforeEnd", createGalleryMurkup(galleryItems));
refs.galleryEl.addEventListener("click", onImageClick);
document.addEventListener("keydown", onESCKeydown);
document.addEventListener("keydown", onArrowPress);

function createGalleryMurkup(galleryItems) {
  return galleryItems
    .map(
      ({ preview, original, description }) => `
    <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`,
    )
    .join("");
}

function onImageClick(e) {
  if (e.target.nodeName !== "IMG") {
    return;
  }

  e.preventDefault();
  refs.modalEl.classList.add("is-open");
  refs.modalImgEl.src = e.target.closest(".gallery__link").href;
  refs.modalImgEl.alt = e.target.alt;

  refs.modalCloseBtn.addEventListener("click", onModalCloseBtnClick);
  refs.overlayEl.addEventListener("click", onModalCloseBtnClick);
  // findCurrentImgIndex();
}

function onModalCloseBtnClick() {
  refs.modalEl.classList.remove("is-open");
  refs.modalImgEl.src = "";
  refs.modalImgEl.alt = "";
  refs.modalCloseBtn.removeEventListener("click", onModalCloseBtnClick);
  refs.overlayEl.removeEventListener("click", onModalCloseBtnClick);
}

function onESCKeydown(e) {
  if (e.code !== "Escape") {
    return;
  }
  onModalCloseBtnClick();
}

let currentImgIndex = 0;
function onArrowPress() {
  if (refs.modalEl.classList.contains("is-open")) {
    const currentImgSrc = refs.modalImgEl.src;
    currentImgIndex = galleryItems.indexOf(galleryItems.find(item => item.original === currentImgSrc));
    // console.log(currentImgIndex);
  }
  if (event.code === "ArrowRight") turnRight(currentImgIndex);
  if (event.code === "ArrowLeft") turnLeft(currentImgIndex);
}

function turnRight(currentImgIndex) {
  if (currentImgIndex === galleryItems.length - 1) return;
  const nextImg = galleryItems[currentImgIndex + 1];
  refs.modalImgEl.src = nextImg.original;
  refs.modalImgEl.alt = nextImg.description;
}

function turnLeft(currentImgIndex) {
  if (currentImgIndex === 0) return;
  const previosImg = galleryItems[currentImgIndex - 1];
  refs.modalImgEl.src = previosImg.original;
  refs.modalImgEl.alt = previosImg.description;
}
