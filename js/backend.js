'use strict';

(function () {
  var SEND_URL = 'https://js.dump.academy/kekstagram';
  var DATA_URL = 'https://js.dump.academy/kekstagram/data';
  var TIME_OUT = 10000;
  /* --------------функция  с общими данными для создания запроса --------------*/
  var setupXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIME_OUT; // 10s
    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) { // Загрузка данных
      var xhr = setupXHR(onLoad, onError);
      xhr.open('GET', DATA_URL);
      xhr.send();
    },
    save: function (data, onLoad, onError) { // отпрвка данных
      var xhr = setupXHR(onLoad, onError);

      xhr.open('POST', SEND_URL);
      xhr.send(data);
    },
    showServerError: function (errorMessage) { // функция обратного вызова возникновения ошибки  при выполнении запроса
      var errorMessageBlock = document.createElement('div');
      var errorText = document.createElement('p');
      errorMessageBlock.appendChild(errorText);
      errorMessageBlock.classList.add('error-message-block');
      errorText.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorMessageBlock);
    }
  };
})();
