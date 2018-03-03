'use strict';
// --------------------------------------------------------------------------------------------
// --------------------------------Модуль контрола с эффектами---------------------------------
// --------------------------------------------------------------------------------------------
(function () {
  var INITIAL_PICTURE_EFFECT = 'none';
  var currentEffect = INITIAL_PICTURE_EFFECT;
  var targetEffect;
  var getCurrentEffect = function () {
    return currentEffect;
  };

  var setCurrentEffect = function (effect) {
    currentEffect = effect;
  };

  var getTargetEffect = function () {
    return targetEffect;
  };

  var setTargetEffect = function (effect) {
    targetEffect = effect;
  };

  var setImageEffect = function (handler) {
    return function (evt) {
      var evtTarget = evt.target;
      if (evtTarget.type === 'radio') {
        setTargetEffect(evtTarget.value);
        if (getTargetEffect !== getCurrentEffect()) {
          handler(getCurrentEffect(), getTargetEffect());
          setCurrentEffect(targetEffect);
        }
      }
    };
  };

  window.effectControl = {
    initializeFilters: function (controlElement, applyEffect) {
      controlElement.addEventListener('click', setImageEffect(applyEffect));
    },
    resetFilters: function (applyEffect) {
      var effect = getCurrentEffect();
      if (effect !== INITIAL_PICTURE_EFFECT) {
        applyEffect(getCurrentEffect(), INITIAL_PICTURE_EFFECT);
        setCurrentEffect(INITIAL_PICTURE_EFFECT);
      }
    },
    current: getCurrentEffect,
  };
})();
