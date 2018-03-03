'use strict';

(function () {
  var START_RANGE_COORDINATE = 0;
  var END_RANGE_COORDINATE = 455;
  var EFFECT_INPUT_MAX_VALUES = {'none': 0, 'chrome': 100, 'sepia': 100, 'marvin': 100, 'phobos': 5, 'heat': 300};
  var EFFECT_INPUT_MIN_VALUE = '0';
  var INITIAL_PICTURE_EFFECT = 'none';
  var INITIAL_RANGE_COORDINATE = 91;
  var INITIAL_EFFECT_FACTOR = 0.2;


  window.initializeFilters = function (effectControl, applyImageEffect) {
    var effectNumberInput = effectControl.querySelector('.upload-effect-level-value');
    var effectValueLine = effectControl.querySelector('.upload-effect-level-val');
    var effectLevelLine = effectControl.querySelector('.upload-effect-level-line');
    var effectRangeElement = effectControl.querySelector('.upload-effect-level');
    var handleElement = effectControl.querySelector('.upload-effect-level-pin');

    var currentInputMax = 0;
    var currentEffectValue = 0;
    var currentXCoordinate = 0;
    var leftLineBorder = 0;
    var rightLineBorder = 0;

    var initEffectRangeElement = function (effect) {
      var max = EFFECT_INPUT_MAX_VALUES[effect];
      currentEffectValue = max * INITIAL_EFFECT_FACTOR;
      currentInputMax = max;
      effectNumberInput.value = currentEffectValue;
      effectNumberInput.setAttribute('max', String(max));
      effectNumberInput.setAttribute('min', EFFECT_INPUT_MIN_VALUE);
      setHandlePosition(currentEffectValue);
      applyImageEffect(effect, currentEffectValue);
      setBorders();
    };

    var displayEffectRangeElement = function (effect) {
      if (effect !== INITIAL_PICTURE_EFFECT) {
        effectRangeElement.style.display = 'block';
        initEffectRangeElement(effect);
      } else {
        effectRangeElement.style.display = 'none';
      }
    };

    displayEffectRangeElement();

    var setHandlePosition = function (value) {
      var position = ((value / effectNumberInput.getAttribute('max')) * 100).toFixed(1) + '%';
      handleElement.style.left = position;
      effectValueLine.style.width = position;
    };

    var setBorders = function () {
      leftLineBorder = effectLevelLine.getBoundingClientRect().left;
      rightLineBorder = effectLevelLine.getBoundingClientRect().right;
      currentXCoordinate = INITIAL_RANGE_COORDINATE;
    };

    var setNextStep = function (x, elem) {
      var value = Math.round(x * currentInputMax / END_RANGE_COORDINATE);
      currentXCoordinate = x;
      if (currentEffectValue !== value) {
        currentEffectValue = value;
        effectNumberInput.value = value;
        var posInPercent = (effectNumberInput.value * 100 / currentInputMax).toFixed(1) + '%';
        elem.style.left = posInPercent;
        effectValueLine.style.width = posInPercent;
      }
    };

    window.addEventListener('resize', function () {
      setBorders();
    });

    effectNumberInput.addEventListener('input', function (evt) {
      setHandlePosition(evt.target.value);
    });

    handleElement.addEventListener('mousedown', function (evt) {
      evt.preventDefault();
      var startXCoordinate = evt.clientX; // координата Х указателя относительно окна

      function onMouseMove(moveEvt) {
        moveEvt.preventDefault();
        var cursorX = moveEvt.clientX;
        var nextXCoordinate;
        if (cursorX < leftLineBorder) {
          nextXCoordinate = START_RANGE_COORDINATE;
        } else if (cursorX > rightLineBorder) {
          nextXCoordinate = END_RANGE_COORDINATE;
        } else {
          var shiftX = startXCoordinate - cursorX;
          startXCoordinate = cursorX;
          nextXCoordinate = currentXCoordinate - shiftX;
        }
        if ((nextXCoordinate >= START_RANGE_COORDINATE) && (nextXCoordinate <= END_RANGE_COORDINATE)) {
          setNextStep(nextXCoordinate, evt.target);
          applyImageEffect(currentEffectValue);
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

  };
})();
