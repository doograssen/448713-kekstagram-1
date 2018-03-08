'use strict';

(function () {
  var FILE_TYPES = ['jpg', 'jpeg', 'png'];
  var uploadForm = document.querySelector('#upload-select-image'); // окно формы предпросмотра  и редактирования загруженного изображения
  var fileChooser = uploadForm.querySelector('.upload-image input[type=file]');
  var preview = uploadForm.querySelector('.effect-image-preview');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();
    // так как метод endsWith из ES6, а интенсив построен на ES5, то заменил на свою функцию
    var endsWith = function (str, substr) {
      var position = str.length - substr.length;
      return str.indexOf(substr) === position;
    };
    var matches = FILE_TYPES.some(function (it) {
      return endsWith(fileName, it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
