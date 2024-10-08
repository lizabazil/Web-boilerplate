/*const testModules = require('./test-module');
require('../css/app.css');*/

import {getFormattedUsers, filterUsers, sortUsers, validateUser, searchByNameNoteOrAge, generateColor} from "./lab2.js";
import {v4 as uuidv4} from 'https://jspm.dev/uuid';
const allUsersCountries = new Set()

document.addEventListener('DOMContentLoaded', function () {
    const buttonsAddTeacher = document.querySelectorAll('.button-add-teacher')
    buttonsAddTeacher.forEach(el => el.addEventListener('click', event => {
        openPopup()
    }))

    let pieChartInstance = null

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

    // buttons to move the list of favorite teachers
    const moveButtonRight = document.getElementById('move-button-right')
    const moveButtonLeft = document.getElementById('move-button-left')


    allFilters.forEach(current => {
        current.addEventListener('change', function () {
            filterTeachersOnPage(ageFilter.value, countryFilter.value, photoFilter.checked, genderFilter.value, favoriteFilter.checked)
        })
    })


    moveButtonRight.addEventListener('click', function () {
        if (startIndex + maxVisibleTeachers < JSON.parse(localStorage.getItem('teachers')).length) {
            startIndex += maxVisibleTeachers
            updateVisibleItemsOfFavoritesTeachers()
        }
    })

    moveButtonLeft.addEventListener('click', function () {
        if (startIndex > 0) {
            startIndex -= maxVisibleTeachers
            updateVisibleItemsOfFavoritesTeachers()
        }
    })


    const container = document.getElementsByClassName('teachers-grid')[0]

    // submit form for adding a teacher
    const formAddTeacher = document.getElementById('form-add-teacher')
    formAddTeacher.addEventListener('submit', function (event) {
        event.preventDefault()
        if (submitFormAndAddTeacher())
            clearFormForAddingTeacher()
    })


    // use localStorage to store all teachers
    // get data from localStorage
    let currentTeachers = JSON.parse(localStorage.getItem("teachers")) || []
    if (currentTeachers.length === 0) {
        fetchRandomTeachers(50).then(res => {
            removeAllTeachersCardsFromGrid()
            addTeachersToLocalStorage(res, false)
            addTeacherCardsOnPage(res, false)
            location.reload()
        })
    } else {
        currentTeachers.forEach(teacher => {
            // add teacher's country to the set
            allUsersCountries.add(teacher.country)
        })
        addTeacherCardsOnPage(currentTeachers)
    }


    function fetchRandomTeachers(amountOfUsers) {
        let arr = []
        const url = 'https://randomuser.me/api/?results=' + amountOfUsers
        return fetch(url)
            .then(response => response.json())
            .then(teachers => {
                arr = teachers.results
                return arr
            })
            .catch(err => console.log(err))
    }


    // add teachers to page and format them if needed
    function addTeacherCardsOnPage(teachersArr, isFormatted = true) {
        if (!isFormatted)
            teachersArr = getFormattedUsers(teachersArr, [])
        teachersArr.forEach(teacher => {
            const currentCard = createTeacherCard(teacher)
            container.appendChild(currentCard)

        })
    }


    // add to localStorage and format them before adding (if needed)
    function addTeachersToLocalStorage(teachers, formatted = true) {
        if (!formatted)
            localStorage.setItem('teachers', JSON.stringify(getFormattedUsers(teachers, [])))
        else localStorage.setItem('teachers', JSON.stringify(teachers))
    }


    container.addEventListener('click', function (event) {
        const card = event.target.closest('.teacher-card')
        if (card) {
            const teacherData = {
                id: card.teacherId,
                full_name: card.teacherFullName,
                course: card.teacherCourse,
                city: card.teacherCity,
                country: card.teacherCountry,
                age: card.teacherAge,
                gender: card.teacherGender,
                email: card.teacherEmail,
                phone: card.teacherPhone,
                favorite: card.teacherFavorite,
                picture_large: card.photo,
                note: card.note,
                coordinates: card.coordinates,
                b_date: card.b_date

            }
            openDetailedTeacherPopup(teacherData)
        }
    })


    addOptionsOfCountriesInFilter()
    addCountriesToTheForm()


    // add listener to button for searching by input
    document.getElementById('searchButton').addEventListener('click', function () {
        const searchValue = document.getElementById('searchInput').value
        document.getElementById('searchInput').value = ''

        currentTeachers = searchByNameNoteOrAge(searchValue, JSON.parse(localStorage.getItem("teachers")))
        removeAllTeachersCardsFromGrid()
        addTeacherCardsOnPage(currentTeachers)

        createPaginationForTable(mainCurrentHeader)
        sortAndUpdateStatisticsTable(mainCurrentHeader)
    })


    closePopup.addEventListener('click', closePopupFunc);
    popupOverlay.addEventListener('click', function (event) {
        if (event.target === popupOverlay) {
            closePopupFunc()
        }
    });

    closeDetailedPopup.addEventListener('click', closeDetailedPopupFunc)
    detailedPopupOverlay.addEventListener('click', function (event) {
        if (event.target === detailedPopupOverlay) {
            closeDetailedPopupFunc()
        }
    })

    // for pagination for table with statistics
    const teachersPerPageTable = 10
    let currentPage = 1

    // get table with statistics
    let mainCurrentHeader
    const tableWithStats = document.getElementById('teacherTable')
    const headers = tableWithStats.querySelectorAll('th')
    headers.forEach(currentHeader =>
        currentHeader.addEventListener('click', function () {
            createPaginationForTable(currentHeader)

            currentPage = 1
            sortAndUpdateStatisticsTable(currentHeader, false)

            mainCurrentHeader = currentHeader
            updateSortByIndicator(currentHeader, currentHeader.getAttribute('data-order') === 'desc' ? 'asc' : 'desc')

        }))


    const buttonNextGrid = document.getElementById('next-grid')


    buttonNextGrid.addEventListener('click', function () {
        fetchAdditional10Users()
    })


    // when the page is loading, the table will be sorted by age of teachers
    createPaginationForTable(tableWithStats.querySelectorAll('th')[2])
    sortAndUpdateStatisticsTable(tableWithStats.querySelectorAll('th')[2])

    function openPopup() {
        popupOverlay.style.display = 'inline-block'
        content.classList.add('blurred')
    }

    function closePopupFunc() {
        popupOverlay.style.display = 'none'
        content.classList.remove('blurred')
    }


    let map

    function openDetailedTeacherPopup(teacher) {
        detailedPopupOverlay.style.display = 'inline-block'
        content.classList.add('blurred')

        // set info about teacher in the popup
        const image = document.querySelector('.detailed-image')
        if (!teacher.picture_large) image.src = "/src/images/default_avatar.jpg"
        else image.src = teacher.picture_large
        image.alt = teacher.full_name

        const name = document.querySelector('.detailed-name')
        name.textContent = teacher.full_name

        const speciality = document.querySelector('.detailed-speciality')
        speciality.textContent = teacher.course

        const teacherLocation = document.querySelector('.detailed-location')
        teacherLocation.textContent = teacher.city + ', ' + teacher.country

        const ageGender = document.querySelector('.detailed-age-gender')
        ageGender.textContent = `${teacher.age}, ${teacher.gender}`

        const email = document.querySelector('.detailed-email a')
        email.href = `mailto:${teacher.email}`
        email.textContent = teacher.email

        const phone = document.querySelector('.detailed-phone')
        phone.textContent = teacher.phone

        const star = document.querySelector('#detailedPopup .star')

        const newStar = star.cloneNode(true)
        star.replaceWith(newStar)

        if (teacher.favorite) {
            newStar.innerText = '★'
        } else {
            newStar.innerText = '☆'
        }

        newStar.addEventListener('click', function () {
            // change the attribute 'favorite' of teacher
            let teachers = JSON.parse(localStorage.getItem("teachers"))
            const teacherIndex = teachers.findIndex(findTeacher =>
                findTeacher.id === teacher.id)

            teachers[teacherIndex].favorite = !teachers[teacherIndex].favorite
            addTeachersToLocalStorage(teachers)

            teacher.favorite = !teacher.favorite

            // change the state of star depending on the new status of teacher (favorite or not)
            if (teacher.favorite) newStar.innerText = '★'
            else newStar.innerText = '☆'

            currentTeachers = teachers
            // to refresh teachers cards on page
            removeAllTeachersCardsFromGrid()
            addTeacherCardsOnPage(currentTeachers)
            updateVisibleItemsOfFavoritesTeachers()
        })


        const teacherNote = document.querySelector('.detailed-part-2')
        teacherNote.textContent = teacher.note

        const dayToBD = document.querySelector('#days-to-bd')
        const b_date = dayjs(teacher.b_date)
        const today = dayjs()
        const currentYear = today.year();

        let nextBirthday = b_date.year(currentYear);

        if (nextBirthday.isBefore(today))
            nextBirthday = nextBirthday.add(1, 'year');

        const daysLeft = nextBirthday.diff(today, 'day');
        dayToBD.textContent = `Days left to next birthday: ${daysLeft}`;

        const buttonShowOnMap = document.getElementById('toggle-map')
        const newButtonShowOnMap = buttonShowOnMap.cloneNode(true)
        buttonShowOnMap.replaceWith(newButtonShowOnMap)

        newButtonShowOnMap.addEventListener('click', async function () {
            document.getElementById('map').style.display = 'block'

            if (map !== undefined)
                map.remove()

             const latitude = teacher.coordinates.latitude;
                const longitude = teacher.coordinates.longitude;

                map = L.map('map').setView([latitude, longitude], 9);

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);

                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup(`${teacher.city}, ${teacher.country}`)
                    .openPopup();

        })

    }


    function closeDetailedPopupFunc() {
        detailedPopupOverlay.style.display = 'none'
        document.getElementById('map').style.display = 'none'
        content.classList.remove('blurred')
    }


    function addOptionsOfCountriesInFilter() {
        // add options of countries
        for (let option of allUsersCountries) {
            const newOption = document.createElement('option')
            newOption.value = option
            newOption.textContent = option
            countryFilter.appendChild(newOption)
        }
    }

    function addCountriesToTheForm() {
        // add options of countries to the form of adding new teacher
        const selectElement = document.getElementById('selectCountry')
        selectElement.innerText = ''
        for (let option of allUsersCountries) {
            const newOption = document.createElement('option')
            newOption.value = option
            newOption.textContent = option
            selectElement.appendChild(newOption)
        }
    }

    function createTeacherCard(teacher) {
        const card = document.createElement('div')
        card.classList.add('teacher-card')
        const imageContainer = document.createElement('div')
        imageContainer.classList.add('image-container')

        const img = document.createElement('img')
        if (!teacher.picture_large) img.src = "/src/images/default_avatar.jpg"
        else
            img.src = teacher.picture_large
        img.alt = teacher.full_name
        img.style.border = `3px solid ${teacher.bg_color}`

        imageContainer.appendChild(img)

        const star = document.createElement('div')
        star.classList.add('star')

        if (teacher.favorite)
            star.innerText = '★'
        else star.innerText = ''

        imageContainer.appendChild(star);

        const firstName = document.createElement('p');
        firstName.classList.add('teacher-name')
        firstName.innerText = teacher.full_name.split(' ')[0]

        const surname = document.createElement('p')
        surname.classList.add('teacher-name')
        surname.innerText = teacher.full_name.split(' ')[1] === undefined ? '' : teacher.full_name.split(' ')[1]


        const speciality = document.createElement('p')
        speciality.classList.add('teacher-speciality')
        speciality.innerText = teacher.course

        const country = document.createElement('p')
        country.classList.add('teacher-country')
        country.innerText = teacher.country

        card.appendChild(imageContainer)
        card.appendChild(firstName)
        card.appendChild(surname)
        card.appendChild(speciality)
        card.appendChild(country)

        // store teacher's info for detailed popup
        card.dataset.id = teacher.id

        card.teacherId = teacher.id
        card.teacherFullName = teacher.full_name
        card.teacherCourse = teacher.course
        card.teacherCity = teacher.city
        card.teacherCountry = teacher.country
        card.teacherAge = teacher.age
        card.teacherGender = teacher.gender
        card.teacherEmail = teacher.email
        card.teacherPhone = teacher.phone
        card.teacherFavorite = teacher.favorite
        card.photo = teacher.picture_large
        card.note = teacher.note
        card.coordinates = teacher.coordinates
        card.b_date = teacher.b_date

        return card
    }

    function filterTeachersOnPage(chosenAge, chosenCountry, isPhoto, chosenGender, chosenFavorite) {
        if (!chosenFavorite)
            chosenFavorite = undefined

        if (!isPhoto)
            isPhoto = undefined

        currentTeachers = filterUsers(JSON.parse(localStorage.getItem("teachers")), chosenCountry, chosenAge, chosenGender, isPhoto, chosenFavorite)
        removeAllTeachersCardsFromGrid()
        addTeacherCardsOnPage(currentTeachers)

        createPaginationForTable(mainCurrentHeader)
        sortAndUpdateStatisticsTable(mainCurrentHeader)
    }

    function createPaginationForTable(currentHeader, changeSortOrder = true) {
        const paginationContainer = document.querySelector('.pages')
        paginationContainer.innerHTML = ''

        const totalPages = Math.ceil(currentTeachers.length / 10)

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button')
            pageButton.textContent = i
            pageButton.classList.add('numbers-of-pages')


            pageButton.addEventListener('click', function () {
                const allPageButtons = paginationContainer.querySelectorAll('.numbers-of-pages')
                allPageButtons.forEach(button => button.classList.remove('current-number-page'))

                pageButton.classList.add('current-number-page')
                currentPage = i
                sortAndUpdateStatisticsTable(currentHeader)
            })

            paginationContainer.appendChild(pageButton)
        }
    }



    function sortAndUpdateStatisticsTable(currentHeader, changeSortOrder = true) {
        // remove all rows from the table
        const oldRows = tableWithStats.querySelectorAll('tr:not(:first-child)')
        oldRows.forEach(row => row.remove())
        /*
        const col = currentHeader.getAttribute('data-column')
        let sortOrder = ''
        if (changeSortOrder) {
            sortOrder = currentHeader.getAttribute('data-order')
        } else sortOrder = currentHeader.getAttribute('data-order') === 'desc' ? 'asc' : 'desc'

         */

        if(currentHeader === undefined)
            currentHeader = tableWithStats.querySelectorAll('th')[2]

        if(pieChartInstance)
            pieChartInstance.destroy()

        let labels
        let data
        // see piechart by country
        if(currentHeader.getAttribute('data-column') === 'country') {
            const countryCount = currentTeachers.reduce((acc, teacher) => {
                const country = teacher.country
                acc[country] = (acc[country] || 0) + 1
                return acc
            }, {})

            labels = Object.keys(countryCount)
            data = Object.values(countryCount)
        }

        // create piechart by course
        else if(currentHeader.getAttribute('data-column') === 'course') {
            const course_count = currentTeachers.reduce((acc, teacher) => {
                const course = teacher.course
                acc[course] = (acc[course] || 0) + 1
                return acc
            }, {})

            labels = Object.keys(course_count)
            data = Object.values(course_count)
        }

        // create piechart by age
        else if(currentHeader.getAttribute('data-column') === 'age') {
            const age_count = currentTeachers.reduce((acc, teacher) => {
                const age = teacher.age

                let ageGroup

                if (age >= 18 && age <= 20) {
                    ageGroup = '18-20'
                } else if (age >= 21 && age <= 30) {
                    ageGroup = '21-30'
                } else if (age >= 31 && age <= 40) {
                    ageGroup = '31-40'
                } else if (age >= 41 && age <= 50) {
                    ageGroup = '41-50'
                } else if (age >= 51 && age <= 60) {
                    ageGroup = '51-60'
                } else if (age >= 61 && age <= 70) {
                    ageGroup = '61-70'
                } else {
                    ageGroup = '71+'
                }

                acc[ageGroup] = (acc[ageGroup] || 0) + 1
                return acc
            }, {})

            labels = Object.keys(age_count)
            data = Object.values(age_count)
        }

        // create piechart, value is the first character in full_name of teacher
        else if(currentHeader.getAttribute('data-column') === 'full_name') {
            const full_name_count = currentTeachers.reduce((acc, teacher) => {
                const full_name = teacher.full_name.charAt(0)
                acc[full_name] = (acc[full_name] || 0) + 1
                return acc
            }, {})

            labels = Object.keys(full_name_count)
            data = Object.values(full_name_count)
        }

        let colors = []
        for(let i = 0; i < labels.length; i++)
            colors.push(generateColor())


        const ctx = document.getElementById('piechart').getContext('2d');
        pieChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels, // countries
                datasets: [{
                    data: data, // amount of teachers in each country
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true
            }
        });

        /*
        // calculations for pagination
        const startIndex = (currentPage - 1) * teachersPerPageTable
        const endIndex = startIndex + teachersPerPageTable

        // get sorted array of teachers
        let sortedTeachers = sortUsers(currentTeachers, col, sortOrder)
        const sortedTeachersToDisplay = sortedTeachers.slice(startIndex, endIndex)

        const tBody = tableWithStats.querySelector('tbody')
        sortedTeachersToDisplay.forEach(teacher => {
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

         */

    }


    function updateSortByIndicator(header, order) {
        header.setAttribute('data-order', order)

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


    // returns true if adding new teacher was successful, otherwise false
    function submitFormAndAddTeacher() {
        const name = document.getElementById('newTeacherName').value
        const speciality = document.getElementById('selectSpeciality').value
        const country = document.getElementById('selectCountry').value
        const city = document.getElementById('newTeacherCity').value
        const email = document.getElementById('newTeacherEmail').value
        const phone = document.getElementById('newTeacherPhone').value
        const dateOfBirth = document.getElementById('newTeacherDate').value
        const gender = document.querySelector('input[name="gender"]:checked').value
        const backgroundColor = document.querySelector('input[type="color"]').value
        const notes = document.getElementById("notes").value


        const newTeacher = {
            id: uuidv4(),
            full_name: name,
            gender: gender,
            course: speciality,
            country: country,
            city: city,
            email: email,
            phone: phone,
            b_date: dateOfBirth,
            age: countAge(dateOfBirth),
            state: 'Undefined',
            bg_color: backgroundColor,
            note: notes
        }

        if (validateUser(newTeacher)) {
            let teachersForNow = JSON.parse(localStorage.getItem("teachers"))
            teachersForNow.push(newTeacher)
            localStorage.setItem("teachers", JSON.stringify(teachersForNow))

            closePopupFunc()
            addNewTeacherToServer(newTeacher)
            return true
        } else
            window.alert('Adding new teacher was unsuccessful.')

        return false
    }

    function addNewTeacherToServer(newTeacher) {
        const url = 'http://localhost:3000/teachers'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTeacher)

        })
            .catch(error => console.log(`Error: ${error}`))
    }


    function clearFormForAddingTeacher() {
        document.getElementById('newTeacherName').value = ''
        document.getElementById('selectSpeciality').value = 'Mathematics'
        document.getElementById('selectCountry').value = ''
        document.getElementById('newTeacherCity').value = ''
        document.getElementById('newTeacherEmail').value = ''
        document.getElementById('newTeacherPhone').value = ''
        document.getElementById('newTeacherDate').value = ''
        document.getElementById('notes').value = ''
    }


    function countAge(dateOfBirth) {
        const pastDate = new Date(dateOfBirth)
        const currentDate = new Date()

        let yearsDifference = currentDate.getFullYear() - pastDate.getFullYear()

        const isBeforeBirthdayThisYear =
            currentDate.getMonth() < pastDate.getMonth() ||
            (currentDate.getMonth() === pastDate.getMonth() && currentDate.getDate() < pastDate.getDate())

        if (isBeforeBirthdayThisYear)
            yearsDifference--

        return yearsDifference
    }

    const maxVisibleTeachers = 5
    let startIndex = 0

    function updateVisibleItemsOfFavoritesTeachers() {
        const containerWithFavorites = document.getElementById('short-teacher-list-bottom')

        // remove previous set of favorite teachers
        const teachersCardsToRemove = containerWithFavorites.querySelectorAll('.teacher-card')
        teachersCardsToRemove.forEach(elem => {
            elem.remove()
        })

        const teachers = JSON.parse(localStorage.getItem('teachers'))
        const favoriteTeachers = _.filter(teachers, teacher => teacher.favorite === true)

        // get the needed amount of favorites
        const visibleTeachers = _.slice(favoriteTeachers, startIndex, startIndex + maxVisibleTeachers)

        _.forEach(visibleTeachers, teacher => {
            const card = createTeacherCard(teacher)
            containerWithFavorites.insertBefore(card, moveButtonRight)

            card.addEventListener('click', function () {
                openDetailedTeacherPopup(teacher)
            })
        })

        // hide buttons in some cases
        moveButtonLeft.style.visibility = startIndex === 0 ? 'hidden' : 'visible'
        moveButtonRight.style.visibility = startIndex + maxVisibleTeachers >= favoriteTeachers.length ? 'hidden' : 'visible'
    }

    function fetchAdditional10Users() {
        removeAllTeachersCardsFromGrid()

        fetchRandomTeachers(10).then(res => {
                res = getFormattedUsers(res, [])
                addTeachersToLocalStorage(JSON.parse(localStorage.getItem('teachers')).concat(res), true)
                currentTeachers = JSON.parse(localStorage.getItem('teachers'))
                addTeacherCardsOnPage(currentTeachers, true)

            createPaginationForTable(mainCurrentHeader)
            sortAndUpdateStatisticsTable(mainCurrentHeader)
            _.forEach(res, current => allUsersCountries.add(current.country))
            addCountriesToTheForm()
            }
        )
    }

    updateVisibleItemsOfFavoritesTeachers()


});


//console.log(testModules.hello);
