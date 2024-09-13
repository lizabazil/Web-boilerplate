/* const testModules = require('./test-module');
require('../css/app.css');

/** ******** Your code here! *********** */
document.addEventListener('DOMContentLoaded', function () {
    const buttonsAddTeacher = document.querySelectorAll('.button-add-teacher')
    buttonsAddTeacher.forEach(el => el.addEventListener('click', event => {
        openPopup()
    }))


    // take all teacher cards in order to make popup with detailed info about teacher
    const teacherCardsInTop = document.querySelectorAll('.teacher-card')
    teacherCardsInTop.forEach(el => el.addEventListener('click', Event => {
        openDetailedTeacherPopup()
    }))


    const popup = document.getElementById('popupOverlay')

    const closePopup = document.getElementById('closePopup')
    const closeDetailedPopup = document.getElementById('closeDetailedPopup')
    const content = document.getElementById('page-content')

    function openPopup() {
        popupOverlay.style.display = 'inline-block'
        content.classList.add('blurred')
    }

    function closePopupFunc() {
        popupOverlay.style.display = 'none'
        content.classList.remove('blurred')
    }

    closePopup.addEventListener('click', closePopupFunc);
    popupOverlay.addEventListener('click', function (event) {
        if (event.target === popupOverlay) {
            closePopupFunc()
        }
    });

    closeDetailedPopup.addEventListener('click', closeDetailedPopupFunc)
    detailedPopupOverlay.addEventListener('click', function (event) {
        if(event.target === detailedPopupOverlay) {
            closeDetailedPopupFunc()
        }
    })


    function openDetailedTeacherPopup() {
        detailedPopupOverlay.style.display = 'inline-block'
        content.classList.add('blurred')
    }

    function closeDetailedPopupFunc() {
        detailedPopupOverlay.style.display = 'none'
        content.classList.remove('blurred')
    }
});

console.log(testModules.hello);
