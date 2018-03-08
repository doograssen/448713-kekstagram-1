'use strict';

(function () {
  var MAX_COMMENT_LENGTH = 140;
  var MIN_HASHTAG_LENGTH = 2;
  var MAX_HASHTAG_LENGTH = 20;
  var DEFAULT_PICTURE_EFFECT = 'none';
  var EFFECT_INPUT_MIN_VALUE = '0';
  var START_RANGE_COORDINATE = 0;
  var END_RANGE_COORDINATE = 455;
  var INITIAL_RANGE_COORDINATE = 91;
  var ERROR_MESSAGE = {
    'hash': 'Проверьте правильность ввода хештегов ',
    'count': 'Максимальное количество хештегов - пять ',
    'length': 'Тег должен быть не длиннее 20-ти символов и не короче одного ',
    'duplicate': 'Теги должны быть уникальными '
  };
  var uploadForm = document.querySelector('#upload-select-image');
  var framingWindow = uploadForm.querySelector('.upload-overlay');
  var effectNumberInput = framingWindow.querySelector('.upload-effect-level-value');
  var effectValueLine = framingWindow.querySelector('.upload-effect-level-val');
  var effectLevelLine = framingWindow.querySelector('.upload-effect-level-line');
  var effectRangeElement = framingWindow.querySelector('.upload-effect-level');
  var handleElement = framingWindow.querySelector('.upload-effect-level-pin');
  var effectControls = framingWindow.querySelector('.upload-effect-controls');
  var resizeControls = framingWindow.querySelector('.upload-resize-controls');
  var hashTagInput = uploadForm.querySelector('.upload-form-hashtags');
  var imageSample = uploadForm.querySelector('.effect-image-preview');
  var comment = framingWindow.querySelector('.upload-form-description');

  // --------------------------------------------------------------------------------------------
  // ---------------------------------- валидация строки с хештегами-----------------------------
  // --------------------------------------------------------------------------------------------
  var hashTagString = {
    pictureHashtags: [],
    tagsCount: 0,
    tagChecks: {
      count: false,
      hash: false,
      length: false,
      duplicate: false
    },
    message: '',
    initTagsString: function () {
      var string = hashTagInput.value.replace(/\s+/g, ' ');
      string = string.trim();
      this.pictureHashtags = string.split(' ');
      this.tagsCount = this.pictureHashtags.length;
      this.tagChecks.count = this.validateCount();
      this.tagChecks.hash = this.validateHash();
      this.tagChecks.length = this.validateLength();
      this.tagChecks.duplicate = this.validateDuplicate(this.pictureHashtags);
      this.setMessage();
    },
    validateCount: function () {
      return (this.tagsCount <= 5);
    },
    validateHash: function () {
      var correctHash = true;
      var arrayLength = this.pictureHashtags.length;
      for (var i = 0; correctHash && i < arrayLength; i++) {
        correctHash = (this.pictureHashtags[i].lastIndexOf('#') === 0);
      }
      return correctHash;
    },
    validateLength: function () {
      var hashtagCorrectLength = true;
      for (var i = 0; hashtagCorrectLength && i < this.tagsCount; i++) {
        hashtagCorrectLength = this.pictureHashtags[i].length >= MIN_HASHTAG_LENGTH &&
          this.pictureHashtags[i].length <= MAX_HASHTAG_LENGTH;
      }
      return hashtagCorrectLength;
    },
    validateDuplicate: function (arr) {
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        var str = arr[i].toLowerCase();
        if (str in obj) {
          return true;
        } else {
          obj[str] = true;
        }
      }
      return false;
    },
    setMessage: function () {
      this.message = '';
      for (var check in this.tagChecks) {
        if (this.tagChecks.hasOwnProperty(check) && !this.tagChecks[check]) {
          this.message += ERROR_MESSAGE[check];
        }
      }
    }
  };

  // --------------------------------------------------------------------------------------------
  // -------------------------Функции работы с выбранным изображением ---------------------------
  // --------------------------------------------------------------------------------------------
  var imagePreview = {
    resizeImage: function (size) {
      imageSample.style.transform = 'scale(' + size / 100 + ')';
    },

    applyImageEffect: function (oldEffect, newEffect) {
      var getImageEffectClass = function (effect) {
        return 'effect-' + effect;
      };
      var sourceClass = getImageEffectClass(oldEffect);
      var targetClass = getImageEffectClass(newEffect);
      if (imageSample.classList.contains(sourceClass)) {
        imageSample.classList.remove(sourceClass);
        if (imageSample.style.filter) {
          imageSample.style.filter = '';
        }
      }
      if (targetClass !== 'none') {
        imageSample.classList.add(targetClass);
        effectLevelHandle.displayEffectRangeElement(newEffect);
      }
    },
    resetPreview: function () {
      window.scaleControl.resetScale(resizeControls, this.resizeImage);
      window.effectControl.resetFilters(this.applyImageEffect);
    }
  };

  // --------------------------------------------------------------------------------------------
  // ------------------------------------Регулировка уровня эффекта -----------------------------
  // --------------------------------------------------------------------------------------------
  var effectLevelHandle = {
    EFFECT_INPUT_MAX_VALUES: {'none': 0, 'chrome': 100, 'sepia': 100, 'marvin': 100, 'phobos': 5, 'heat': 300},
    EFFECT_NAMES: {'none': 0, 'chrome': 'grayscale', 'sepia': 'sepia', 'marvin': 'invert', 'phobos': 'blur', 'heat': 'brightness'},
    currentInputMax: 0,
    currentEffectValue: 0,
    currentXCoordinate: 0,
    leftLineBorder: 0,
    rightLineBorder: 0,

    initEffectRangeElement: function (effect) {
      var max = this.EFFECT_INPUT_MAX_VALUES[effect];
      this.currentEffectValue = max * 0.2;
      this.currentInputMax = max;
      effectNumberInput.value = this.currentEffectValue;
      effectNumberInput.setAttribute('max', String(max));
      effectNumberInput.setAttribute('min', EFFECT_INPUT_MIN_VALUE);
      this.setHandlePosition(this.currentEffectValue);
      this.applyImageEffect(effect);
      this.setBorders();
    },

    displayEffectRangeElement: function (effect) {
      if (effect !== DEFAULT_PICTURE_EFFECT) {
        effectRangeElement.style.display = 'block';
        this.initEffectRangeElement(effect);
        return;
      }
      effectRangeElement.style.display = 'none';
    },

    setHandlePosition: function (value) {
      var position = ((value / effectNumberInput.getAttribute('max')) * 100).toFixed(1) + '%';
      handleElement.style.left = position;
      effectValueLine.style.width = position;
    },

    setBorders: function () {
      this.leftLineBorder = effectLevelLine.getBoundingClientRect().left;
      this.rightLineBorder = effectLevelLine.getBoundingClientRect().right;
      this.currentXCoordinate = INITIAL_RANGE_COORDINATE;
    },

    setNextStep: function (x, elem) {
      var value = Math.round(x * this.currentInputMax / END_RANGE_COORDINATE);
      this.currentXCoordinate = x;
      if (this.currentEffectValue !== value) {
        this.currentEffectValue = value;
        effectNumberInput.value = value;
        var posInPercent = (effectNumberInput.value * 100 / effectLevelHandle.currentInputMax).toFixed(1) + '%';
        elem.style.left = posInPercent;
        effectValueLine.style.width = posInPercent;
      }
    },

    applyImageEffect: function (effect) {
      switch (effect) {
        case 'chrome':
        case 'sepia':
        case 'heat':
          imageSample.style.filter = this.EFFECT_NAMES[effect] + '(' + this.currentEffectValue / 100 + ')';
          break;
        case 'marvin':
          imageSample.style.filter = this.EFFECT_NAMES[effect] + '(' + this.currentEffectValue + '%)';
          break;
        case 'phobos':
          imageSample.style.filter = this.EFFECT_NAMES[effect] + '(' + this.currentEffectValue + 'px)';
          break;
      }
    }
  };

  handleElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startXCoordinate = evt.clientX; // координата Х указателя относительно окна

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var cursorX = moveEvt.clientX;
      var nextXCoordinate;
      if (cursorX < effectLevelHandle.leftLineBorder) {
        nextXCoordinate = START_RANGE_COORDINATE;
      } else if (cursorX > effectLevelHandle.rightLineBorder) {
        nextXCoordinate = END_RANGE_COORDINATE;
      } else {
        var shiftX = startXCoordinate - cursorX;
        startXCoordinate = cursorX;
        nextXCoordinate = effectLevelHandle.currentXCoordinate - shiftX;
      }
      if ((nextXCoordinate >= START_RANGE_COORDINATE) && (nextXCoordinate <= END_RANGE_COORDINATE)) {
        effectLevelHandle.setNextStep(nextXCoordinate, evt.target);
        effectLevelHandle.applyImageEffect(window.effectControl.current());
      }
    }

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.addEventListener('resize', function () {
    effectLevelHandle.setBorders();
  });

  effectNumberInput.addEventListener('input', function (evt) {
    effectLevelHandle.setHandlePosition(evt.target.value);
  });

  // --------------------------------------------------------------------------------------------
  // -----------------------------Проверка ввода комментария-------------------------------------
  // --------------------------------------------------------------------------------------------
  comment.addEventListener('input', function (evt) {
    var messageText;
    var evtTarget = evt.target;
    messageText = (evtTarget.value.length > MAX_COMMENT_LENGTH) ? 'Максимальная длина содержимого поля' + MAX_COMMENT_LENGTH : '';
    evtTarget.setCustomValidity(messageText);
  });


  window.scaleControl.initializeScale(resizeControls, imagePreview.resizeImage);
  window.effectControl.initializeFilters(effectControls, imagePreview.applyImageEffect);

  hashTagInput.addEventListener('change', function (evt) {
    hashTagString.initTagsString();
    evt.target.setCustomValidity(hashTagString.message);
  });

  var resetForm = function () {
    var uploadImageInput = uploadForm.querySelector('#upload-file');
    effectLevelHandle.displayEffectRangeElement(DEFAULT_PICTURE_EFFECT);
    uploadImageInput.value = '';
    imagePreview.resetPreview();
    window.utils.closePopup(framingWindow);
  };

  // ------------------------------------------------------------------------------------------
  // ----------------------- Отправка данных --------------------------------------------------
  // ------------------------------------------------------------------------------------------
  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(uploadForm), resetForm, window.backend.serverError);
  });

  // ------------------------------------------------------------------------------------------
  // -------------------- Внешние функции сброса формы-----------------------------------------
  // ------------------------------------------------------------------------------------------
  window.form = {
    resetImage: function () {
      imagePreview.resetPreview();
    },
    resetEffect: function (effect) {
      effectLevelHandle.displayEffectRangeElement(effect);
    }
  };
})();
