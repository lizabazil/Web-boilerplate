import {additionalUsers, randomUserMock} from "./FE4U-Lab2-mock.js";
import {v4 as uuidv4 } from 'uuid';

// list of all courses
const courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"]

function generateUserCourse() {
    return courses[Math.floor((Math.random() * courses.length))]
}

function generateUserBgColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// task 1
function getFormattedUsers(randomUserMock, additionalUsers) {
    let formattedUserMock = randomUserMock.map(currentUser => ({
        "id": uuidv4(),
        "favorite": Math.random() < 0.5, // generating random True/False
        "course": generateUserCourse(),
        "bg_color": generateUserBgColor(),
        "note": `Note about ${currentUser.name.first}`,
        "gender": currentUser.gender,
        "title": `${currentUser.name.title}`,
        "full_name": `${currentUser.name.first} ${currentUser.name.last}`,
        "city": currentUser.location.city,
        "state": currentUser.location.state,
        "country": currentUser.location.country,
        "postcode": currentUser.location.postcode,
        "coordinates": currentUser.location.coordinates,
        "timezone": currentUser.location.timezone,
        "email": currentUser.email,
        "b_date": currentUser.dob.date,
        "age": currentUser.dob.age,
        "phone": currentUser.phone,
        "picture_large": currentUser.picture.large,
        "picture_thumbnail": currentUser.picture.thumbnail
    }))

    // join two arrays (formatted array from randomUserMock and additionalUsers
    let joinedArrays = formattedUserMock.concat(additionalUsers)

    joinedArrays = joinedArrays.filter((obj, index, self) =>
        index === self.findIndex((t) =>
            t.gender === obj.gender && t.title === obj.title && t.full_name === obj.full_name))
    return joinedArrays
}

console.log(getFormattedUsers(randomUserMock, additionalUsers)[0])
console.log(`size of randomUsers = ${randomUserMock.length}`)
console.log(`size of additionalUsers = ${additionalUsers.length}`)
console.log(`size of formatted array = ${getFormattedUsers(randomUserMock, additionalUsers).length}`)