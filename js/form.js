'use strict';

(function () {
  var MAX_COMMENT_LENGTH = 140;
  var MIN_HASHTAG_LENGTH = 2;
  var MAX_HASHTAG_LENGTH = 20;
  var MIN_PERCENTAGE_SIZE = 25;
  var MAX_PERCENTAGE_SIZE = 100;
  var PERCENTAGE_SIZE_INDENT = 25;
  var INITIAL_PICTURE_EFFECT = 'none';
  var INCREMENT_FLAG = 1;
  var DECREMENT_FLAG = -1;
  var uploadForm = document.querySelector('#upload-select-image');
  var framingWindow = uploadForm.querySelector('.upload-overlay');
  var effectNumberInput = framingWindow.querySelector('.upload-effect-level-value');
  var effectControls = framingWindow.querySelector('.upload-effect-controls');
  var hashTagInput = uploadForm.querySelector('.upload-form-hashtags');
  var incrementSizeButton = framingWindow.querySelector('.upload-resize-controls-button-inc');
  var decrementSizeButton = framingWindow.querySelector('.upload-resize-controls-button-dec');
  var frameSize = framingWindow.querySelector('.upload-resize-controls-value');
  var imageSample = uploadForm.querySelector('.effect-image-preview');
  var comment = framingWindow.querySelector('.upload-form-description');
  var hashTagString = {
    pistureHashtags: [],
    tagsCount: 0,
    tagChecks: {
      count: false,
      hash: false,
      length: false,
      dublicate: false
    },
    message: '',
    initTagsString: function () {
      var string = hashTagInput.value.replace(/\s+/g, ' ');
      string = string.trim();
      this.pistureHashtags = string.split(' ');
      this.tagsCount = this.pistureHashtags.length;
      this.tagChecks.count = this.validateCount();
      this.tagChecks.hash = this.validateHash();
      this.tagChecks.length = this.validateLength();
      this.tagChecks.dublicate = this.validateDublicat(this.pistureHashtags);
      this.setMessage();
    },
    validateCount: function () {
      return (this.tagsCount <= 5);
    },
    validateHash: function () {
      var correctHash = true;
      var i = 0;
      var arraylength = this.pistureHashtags.length;

      while ((i < arraylength) && (correctHash)) {
        correctHash = (this.pistureHashtags[i].lastIndexOf('#') === 0);
        i++;
      }
      return correctHash;
    },
    validateLength: function () {
      var i = 0;
      var hashtagCorrectLength = true;
      while (i < this.tagsCount) {
        var length = this.pistureHashtags[i].length;
        if ((length < MIN_HASHTAG_LENGTH) || (length > MAX_HASHTAG_LENGTH)) {
          hashtagCorrectLength = false;
          break;
        }
        i++;
      }
      return hashtagCorrectLength;
    },
    validateDublicat: function (arr) {
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        var str = arr[i].toLowerCase();
        if (str in obj) {
          return true;
        } else {
          obj[str] = true; // запомнить строку в виде свойства объекта
        }
      }
      return false;
    },
    setMessage: function () {
      this.message = '';
      if (!this.tagChecks.hash) {
        this.message = 'Проверьте правильность ввода хештегов';
      } else if (!this.tagChecks.count) {
        this.message = 'Максимальное количество хештегов - пять';
      } else if (!this.tagChecks.length) {
        this.message = 'Тег должен быть не длиннее 20-ти символов и не короче одного';
      } else if (this.tagChecks.dublicate) {
        this.message = 'Теги должны быть уникальными';
      }
    }
  };

  var imagePreview = {
    currentEffect: INITIAL_PICTURE_EFFECT,
    getResizeFunction: function (modifier) {
      var border;
      if (modifier === INCREMENT_FLAG) {
        border = MAX_PERCENTAGE_SIZE;
      } else if ((modifier === DECREMENT_FLAG)) {
        border = MIN_PERCENTAGE_SIZE;
      }
      return function () {
        var size = parseInt(frameSize.value, 10);
        if (size !== border) {
          size = size + modifier * PERCENTAGE_SIZE_INDENT;
          frameSize.value = size + '%';
          imageSample.style.transform = 'scale(' + size / 100 + ')';
        }
      };
    },
    getImageEffectClass: function (effect) {
      return 'effect-' + effect;
    },
    setImageEffect: function (sourceClass, targetClass) {
      if (imageSample.classList.contains(sourceClass)) {
        imageSample.classList.remove(sourceClass);
        if (imageSample.style.filter) {
          imageSample.style.filter = '';
        }
      }
      if (targetClass !== INITIAL_PICTURE_EFFECT) {
        imageSample.classList.add(targetClass);
      }
    },
    resetPreview: function () {
      var size = frameSize.value;
      if (parseInt(size, 10) !== MAX_PERCENTAGE_SIZE) {
        size = MAX_PERCENTAGE_SIZE;
        frameSize.value = size + '%';
        imageSample.style.transform = 'scale(' + size / 100 + ')';
      }
      if (imageSample.style.filter) {
        imageSample.style.filter = '';
      }
      this.currentEffect = INITIAL_PICTURE_EFFECT;
    }
  };


  comment.addEventListener('input', function (evt) {
    var messageText = '';
    var evtTarget = evt.target;
    if (evtTarget.value.length > MAX_COMMENT_LENGTH) {
      messageText = 'Максимальная длина содержимого поля' + MAX_COMMENT_LENGTH;
    }
    evtTarget.setCustomValidity(messageText);
  });

  window.initializeScale(incrementSizeButton, imagePreview.getResizeFunction(INCREMENT_FLAG));
  window.initializeScale(decrementSizeButton, imagePreview.getResizeFunction(DECREMENT_FLAG));

  effectControls.addEventListener('click', function (evt) {
    var evtTarget = evt.target;
    if (evtTarget.type === 'radio') {
      applyImageEffect(evtTarget.value, 10);
      imagePreview.currentEffect = evtTarget.value;
    }
  });

  var applyImageEffect = function (effect, value) {
    switch (effect) {
      case 'chrome':
      case 'sepia':
      case 'heat':
        imageSample.style.filter = effect + '(' + value / 100 + ')';
        break;
      case 'marvin':
        imageSample.style.filter = effect + '(' + value + '%)';
        break;
      case 'phobos':
        imageSample.style.filter = effect + '(' + value + 'px)';
        break;
    }
  };

  window.initializeFilters(effectControls, applyImageEffect);

  hashTagInput.addEventListener('change', function (evt) {
    hashTagString.initTagsString();
    evt.target.setCustomValidity(hashTagString.message);
  });

  var resetForm = function () {
    imagePreview.resetPreview();
    window.utils.closePopup(framingWindow);
  };


  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(uploadForm), resetForm, window.backend.showServerError);
  });

  window.form = {
    effect: imagePreview.currentEffect,
    resetImage: function () {
      imagePreview.resetPreview();
    }
  };
})();
