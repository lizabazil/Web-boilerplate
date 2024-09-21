//import { getFormattedUsers } from "src/js/lab2.js";
 /*const testModules = require('./test-module');
require('../css/app.css');*/

import {getFormattedUsers, filterUsers, sortUsers, validateUser, searchByNameNoteOrAge} from "./lab2.js";
import {additionalUsers, randomUserMock} from "./FE4U-Lab2-mock.js";

const allUsersCountries = new Set()

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



    const notValidatedTeachers = getFormattedUsers(randomUserMock, additionalUsers)
    const teachers = notValidatedTeachers.filter(current => validateUser(current))


    const container = document.getElementsByClassName('teachers-grid')[0];
    teachers.forEach(teacher => {
        // add teacher's country to the set
        allUsersCountries.add(teacher.country)

        // add teacher's card to the page
        const teacherCard = createTeacherCard(teacher);
        container.appendChild(teacherCard)
    });

    addOptionsOfCountries()


    // add listener to button for searching by input
    document.getElementById('searchButton').addEventListener('click', function () {
        const searchValue = document.getElementById('searchInput').value
        document.getElementById('searchInput').value = ''

        const resultOfSearching = searchByNameNoteOrAge(searchValue, teachers)
        removeAllTeachersCardsFromGrid()

        resultOfSearching.forEach(teacher => {
            const teacherCard = createTeacherCard(teacher)
            container.appendChild(teacherCard)
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


    // get table with statistics
    const tableWithStats = document.getElementById('teacherTable')
    const headers = tableWithStats.querySelectorAll('th')
    headers.forEach(currentHeader =>
    currentHeader.addEventListener('click', function () {
        sortAndUpdateStatisticsTable(currentHeader)

        updateSortByIndicator(currentHeader, currentHeader.getAttribute('data-order') === 'desc' ? 'asc' : 'desc')

    }))


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


    function addOptionsOfCountries() {
        // add options of countries
        for(let option of allUsersCountries) {
            const newOption = document.createElement('option')
            newOption.value = option
            newOption.textContent = option
            countryFilter.appendChild(newOption)
        }
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
        removeAllTeachersCardsFromGrid()

        // TODO: remove console log
        console.log('FILTERED LOOK HERE')
        console.log(filteredTeachers)
        // show user filtered teachers on the page
        filteredTeachers.forEach(teacher => {
            const teacherCard = createTeacherCard(teacher);
            container.appendChild(teacherCard)
        });
    }


    function sortAndUpdateStatisticsTable(currentHeader) {
        // remove all rows from the table
        const oldRows = tableWithStats.querySelectorAll('tr:not(:first-child)')
        oldRows.forEach(row => row.remove())

        const col = currentHeader.getAttribute('data-column')
        const sortOrder = currentHeader.getAttribute('data-order')
        console.log(`ORDER SORT BY ${sortOrder}`)

        // get sorted array of teachers
        console.log(`data for sorting => col = ${col}, sortOrder = ${sortOrder}`)
        let sortedTeachers = sortUsers(teachers, col, sortOrder)

        const tBody = tableWithStats.querySelector('tbody')
        // TODO: delete comment
        //tBody.innerHTML = ''

       // const tableRows = Array.from(tableWithStats.querySelectorAll('tbody tr'))
        sortedTeachers.forEach(teacher => {
            const row = document.createElement('tr')

            const nameCell = document.createElement('td')
            nameCell.textContent = teacher.full_name

            const specialityCell = document.createElement('td')
            specialityCell.textContent = teacher.course

            const ageCell = document.createElement('td')
            ageCell.textContent = teacher.age

            const countryCell = document.createElement('td')
            countryCell.textContent = teacher.country

            row.appendChild(nameCell)
            row.appendChild(specialityCell)
            row.appendChild(ageCell)
            row.appendChild(countryCell)

            tBody.appendChild(row);
    })
    }


    function updateSortByIndicator(header, order) {
        console.log(`header ${header} must be changed to ${order}`)
        header.setAttribute('data-order', order)

        // Оновлення поточного індикатора
        if (order === 'asc') {
            header.querySelector('p').textContent = '↑';
        } else {
            header.querySelector('p').textContent = '↓';
        }
    }


    function removeAllTeachersCardsFromGrid() {
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
    }
});

//console.log(testModules.hello);
