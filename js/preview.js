'use strict';
// ------------------------------------------------------------------------------------------
// ---------------------------функция показа окна с одним из фото ---------------------------
// ------------------------------------------------------------------------------------------
(function () {
  var overlay = document.querySelector('.gallery-overlay');
  window.preview = {
    fillPictureSample: function (obj) {
      overlay.querySelector('.gallery-overlay-image').src = obj.url;
      overlay.querySelector('.likes-count').textContent = obj.likes;
      overlay.querySelector('.comments-count').textContent = obj.comments.length;
    }
  };
})();
