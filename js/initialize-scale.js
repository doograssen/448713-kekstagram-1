'use strict';

(function () {

  window.initializeScale = function (controlElement, resizeFunction) {
    controlElement.addEventListener('click', function () {
      resizeFunction();
    });
  };
})();
