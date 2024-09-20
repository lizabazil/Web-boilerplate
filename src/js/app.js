//import { getFormattedUsers } from "src/js/lab2.js";
 /*const testModules = require('./test-module');
require('../css/app.css');*/

import {getFormattedUsers, filterUsers} from "./lab2.js";
import {additionalUsers, randomUserMock} from "./FE4U-Lab2-mock.js";

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


    const teachers = getFormattedUsers(randomUserMock, additionalUsers)
    const container = document.getElementsByClassName('teachers-grid')[0];
    teachers.forEach(teacher => {
        const teacherCard = createTeacherCard(teacher);
        container.appendChild(teacherCard)
    });


    // variables for filtering teachers
    const ageFilter = document.getElementById('ageFilter')
    const countryFilter = document.getElementById('countryFilter')
    const genderFilter = document.getElementById('genderFilter')
    const photoFilter = document.getElementById('photoFilter')
    const favoriteFilter = document.getElementById('favoriteFilter')
    const allFilters = [ageFilter, countryFilter, genderFilter, photoFilter, favoriteFilter]

    allFilters.forEach(current => {
        current.addEventListener('change', function () {
            filterTeachersOnPage(ageFilter.value, countryFilter.value, photoFilter.checked, genderFilter.value, favoriteFilter.checked)
        })
    })


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


    function openPopup() {
        popupOverlay.style.display = 'inline-block'
        content.classList.add('blurred')
    }

    function closePopupFunc() {
        popupOverlay.style.display = 'none'
        content.classList.remove('blurred')
    }

    function openDetailedTeacherPopup(teacher) {
        detailedPopupOverlay.style.display = 'inline-block'
        content.classList.add('blurred')

        // set info about teacher in the popup
        const image = document.querySelector('.detailed-image')
        image.src = teacher.picture_large
        image.alt = teacher.full_name

        const name = document.querySelector('.detailed-name')
        name.textContent = teacher.full_name

        const speciality = document.querySelector('.detailed-speciality')
        speciality.textContent = teacher.course

        const location = document.querySelector('.detailed-location')
        location.textContent = teacher.state + ', ' + teacher.country

        const ageGender = document.querySelector('.detailed-age-gender')
        ageGender.textContent = `${teacher.age}, ${teacher.gender}`

        const email = document.querySelector('.detailed-email a')
        email.href = `mailto:${teacher.email}`
        email.textContent = teacher.email

        const phone = document.querySelector('.detailed-phone')
        phone.textContent = teacher.phone

        const star = document.querySelector('#detailedPopup .star')
        teacher.favorite ? star.style.display = 'block' : star.style.display = 'none'

        const teacherNote = document.querySelector('.detailed-part-2')
        teacherNote.textContent = teacher.note

        const address = `${teacher.country}, ${teacher.state}`
        const googleMapsLink = document.querySelector('.toggle-map')
        googleMapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    }

    function closeDetailedPopupFunc() {
        detailedPopupOverlay.style.display = 'none'
        content.classList.remove('blurred')
    }

    function createTeacherCard(teacher) {
        const card = document.createElement('div')
        card.classList.add('teacher-card')
        const imageContainer = document.createElement('div')
        imageContainer.classList.add('image-container')

        // Додавання зображення вчителя
        const img = document.createElement('img')
        img.src = teacher.picture_thumbnail
        img.alt = teacher.full_name
        imageContainer.appendChild(img)

        const star = document.createElement('div')
        star.classList.add('star')
        teacher.favorite ? star.innerText = '★' : star.innerText = ''
        imageContainer.appendChild(star);

        const firstName = document.createElement('p');
        firstName.classList.add('teacher-name')
        firstName.innerText = teacher.full_name.split(' ')[0]

        const surname = document.createElement('p')
        surname.classList.add('teacher-name')
        surname.innerText = teacher.full_name.split(' ')[1]

        const speciality = document.createElement('p');
        speciality.classList.add('teacher-speciality');
        speciality.innerText = teacher.course;

        const country = document.createElement('p');
        country.classList.add('teacher-country');
        country.innerText = teacher.country;

        card.appendChild(imageContainer);
        card.appendChild(firstName);
        card.appendChild(surname);
        card.appendChild(speciality);
        card.appendChild(country);
        card.addEventListener('click', function () {
            openDetailedTeacherPopup(teacher)
        });
        return card
    }

    function filterTeachersOnPage(chosenAge, chosenCountry, isPhoto, chosenGender, chosenFavorite) {
        if(!chosenFavorite)
            chosenFavorite = undefined

        if(!isPhoto)
            isPhoto = undefined

        let filteredTeachers = filterUsers(teachers, chosenCountry, chosenAge, chosenGender, isPhoto, chosenFavorite)
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }

        // TODO: remove console log
        console.log('FILTERED LOOK HERE')
        console.log(filteredTeachers)
        // show user filtered teachers on the page
        filteredTeachers.forEach(teacher => {
            const teacherCard = createTeacherCard(teacher);
            container.appendChild(teacherCard)
        });
    }
});

//console.log(testModules.hello);
