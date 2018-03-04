'use strict';
// --------------------------------------------------------------------------------------------
// --------------------------------Модуль контрола масштабирования ----------------------------
// --------------------------------------------------------------------------------------------
(function () {
  var MIN_PERCENTAGE_SIZE = 25;
  var MAX_PERCENTAGE_SIZE = 100;
  var PERCENTAGE_SIZE_INDENT = 25;
  var INC_FLAG = 1;
  var DEC_FLAG = -1;
  var currentValue;

  var setCurrentValue = function (value) {
    currentValue = value;
  };

  var getCurrentValue = function () {
    return currentValue;
  };

  var adjustEffect = function (controlValueInput, modifier, handler) {
    var border;
    if (modifier === INC_FLAG) {
      border = MAX_PERCENTAGE_SIZE;
    } else if ((modifier === DEC_FLAG)) {
      border = MIN_PERCENTAGE_SIZE;
    }
    return function () {
      var size = getCurrentValue();
      if (size !== border) {
        setCurrentValue(size + modifier * PERCENTAGE_SIZE_INDENT);
        controlValueInput.value = getCurrentValue() + '%';
        handler(getCurrentValue());
      }
    };
  };

  window.scaleControl = {
    initializeScale: function (controlElement, resizeFunction) {
      var incrementSizeElement = controlElement.querySelector('.upload-resize-controls-button-inc');
      var decrementSizeElement = controlElement.querySelector('.upload-resize-controls-button-dec');
      var frameSize = controlElement.querySelector('.upload-resize-controls-value');
      incrementSizeElement.addEventListener('click', adjustEffect(frameSize, INC_FLAG, resizeFunction));
      decrementSizeElement.addEventListener('click', adjustEffect(frameSize, DEC_FLAG, resizeFunction));
    },
    resetScale: function (controlElement, resizeFunction) {
      var frameSize = controlElement.querySelector('.upload-resize-controls-value');
      setCurrentValue(MAX_PERCENTAGE_SIZE);
      if (frameSize.value !== getCurrentValue()) {
        frameSize.value = getCurrentValue() + '%';
        if (resizeFunction && typeof resizeFunction === 'function') {
          resizeFunction(getCurrentValue());
        }
      }
    }
  };
})();
