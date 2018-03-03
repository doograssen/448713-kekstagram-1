'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture-template').content;
  /* ---------- Функция заполнения шаблона ----------------------------*/
  function fillTemplate(obj) {
    var picture = pictureTemplate.cloneNode(true);
    picture.querySelector('img').src = obj.url;
    picture.querySelector('.picture-likes').textContent = obj.likes;
    picture.querySelector('.picture-comments').textContent = obj.comments.length;
    return picture;
  }

  /* ---------- Функция заполнения страницы фотографиями --------------*/
  window.picture = {
    getPicturesFragment: function (arr) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < arr.length; i++) {
        fragment.appendChild(fillTemplate(arr[i]));
      }
      return fragment;
    }
  };
})();
