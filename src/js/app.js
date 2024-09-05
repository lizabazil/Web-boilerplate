/* const testModules = require('./test-module');
require('../css/app.css');

/** ******** Your code here! *********** */
document.addEventListener('DOMContentLoaded', function () {
    const buttonsAddTeacher = document.querySelectorAll('.button-add-teacher')
    buttonsAddTeacher.forEach(el => el.addEventListener('click', event => {
        openPopup()
    }))

    const popupOverlay = document.getElementById('popupOverlay');

    const popup = document.getElementById('popup');

    const closePopup = document.getElementById('closePopup');
    
    function openPopup() {
        popupOverlay.style.display = 'inline-block';

    }

    function closePopupFunc() {
        popupOverlay.style.display = 'none';
    }

    openPopup();
    closePopup.addEventListener('click', closePopupFunc);
    popupOverlay.addEventListener('click', function (event) {
        if (event.target === popupOverlay) {
            closePopupFunc();
        }
    });
});

console.log(testModules.hello);
