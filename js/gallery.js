'use strict';

(function () {
  var ENTER_KEY_CODE = 13; // код кнопки enter
  var ATTRIBUTE_FILTER_NAMES = {'popular': 'likes', 'discussed': 'comments', 'random': 'random'};
  var overlay = document.querySelector('.gallery-overlay'); // окно просмотра полноформатной картинки
  var uploadForm = document.querySelector('#upload-select-image'); // окно формы предпросмотра  и редактирования загруженного изображения
  var pickFile = uploadForm.querySelector('#upload-file'); // input загрузки изображениЯ
  var framingWindow = uploadForm.querySelector('.upload-overlay'); // картинка с фильтрами
  var picturesContainerElement = document.querySelector('.pictures');// контейнер с изображениями
  var filtersElement = document.querySelector('.filters');// радио переключетели сортировки картинок

  // --------------------------------------------------------------------------------------------
  // ------ Закрытие окна по кнопке -------------------------------------------------------------
  // --------------------------------------------------------------------------------------------
  function setCloseBtnListener(btnElem, elemToClose) {
    btnElem.addEventListener('click', function () {
      window.utils.closePopup(elemToClose);
    });
    btnElem.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEY_CODE) {
        window.utils.closePopup(elemToClose);
      }
    });
  }

  // --------------------------------------------------------------------------------------------
  // ------ Назначение обработчиков событий для фото --------------------------------------------
  // ------ открытие окна с предпросмотром  ----------------------------------------------------
  function setPictureListeners(obj, data) {
    obj.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview.fillPictureSample(data);
      window.utils.showPopup(overlay);
    });
  }
  // --------------------------------------------------------------------------------------------
  // ------ Назначение обработчиков событий для всей галереи ------------------------------------
  // --------------------------------------------------------------------------------------------
  function setGalleryListeners(picteresData) {
    var arrayElements = picturesContainerElement.querySelectorAll('.picture');
    var arrayLength = arrayElements.length;
    for (var i = 0; i < arrayLength; i++) {
      setPictureListeners(arrayElements[i], picteresData[i]);
    }
    var closeButton = overlay.querySelector('.gallery-overlay-close');
    setCloseBtnListener(closeButton, overlay);
  }
  // --------------------------------------------------------------------------------------------
  // ------------Обработчики для окна с загруженным изображением --------------------------------
  // --------------------------------------------------------------------------------------------
  function setFramingListeners() {
    pickFile.addEventListener('change', function () {
      window.form.resetImage();
      window.form.resetEffect(window.effectControl.current());
      window.utils.showPopup(framingWindow);
    });
    var closeButton = uploadForm.querySelector('.upload-form-cancel'); // крестик над фото
    setCloseBtnListener(closeButton, framingWindow);
  }
  // --------------------------------------------------------------------------------------------
  // ------------------------ применение фильтров к галерее -------------------------------------
  // --------------------------------------------------------------------------------------------
  var galleryFilterSelect = function (attribute, picturesArray) {
    return picturesArray.slice().sort(function (a, b) {
      if (attribute === 'comments') {
        return b[attribute].length - a[attribute].length;
      } else if (attribute === 'random') {
        return Math.random() - 0.5;
      } else {
        return b[attribute] - a[attribute];
      }
    });
  };

  var galleryFilterApply = function (data) {
    var fragment = window.picture.fillFragment(data);
    while (picturesContainerElement.firstChild) {
      picturesContainerElement.removeChild(picturesContainerElement.firstChild);
    }
    picturesContainerElement.appendChild(fragment);
    setGalleryListeners(data);
  };

  var successXHRExecution = function (response) {
    var galleryFilter = document.querySelector('.filters');
    galleryFilter.addEventListener('change', function (evt) {
      var evtTarget = evt.target;
      var picturesData = response.slice();
      if (evtTarget.type === 'radio') {
        picturesData = galleryFilterSelect(ATTRIBUTE_FILTER_NAMES[evtTarget.value], response);
        window.debounce(galleryFilterApply(picturesData));
      }
    });
    var fragment = window.picture.fillFragment(response);
    picturesContainerElement.appendChild(fragment);
    setGalleryListeners(response);
    filtersElement.classList.remove('filters-inactive');
  };

  // --------------------------------------------------------------------------------------------
  // ----- Запрос загрузки данных ----------------------------------------------------------------
  // --------------------------------------------------------------------------------------------
  window.backend.load(successXHRExecution, window.backend.serverError);

  setFramingListeners();

})();
