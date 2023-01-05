// getting the elements that need to be modified by their id
const text = document.getElementById("username")   // get the input username by its id
const button = document.getElementById("submitID")   // the submit button
const pic = document.getElementById("avatar")
const name = document.getElementById("name")
const address = document.getElementById("addressID")
const city = document.getElementById("cityID")
const bio = document.getElementById("bioID")
const alertObj = document.getElementById("alert")
const alert_text = document.getElementById("alertText")

localStorage.clear()

API_KEY = ""
API_ENDPOINT = "https://api.gisadasdsadadasdasdasdsadsathub.com/users/"

// this function is used to update the Profile info according to the request response
function update(data) {
    //if bio is not null, it will be shown with respect to the newlines
    if (data.bio != null) {
        bioText = data.bio.replaceAll("\n", "<br>")
    }
    // if the user doesn't have a bio, it will be written: No Biography/ it can be empty as well by be changing the line below
    bio.innerHTML = (data.bio == null) ? "No biography" : bioText
    // if the user doesn't have a name, it will be written: No Name/ it can be empty as well by be changing the line below
    name.innerHTML = (data.name == null) ? "No Name" : data.name
    //name.innerHTML = (data.name == null) ? data.login : data.name   // the username can be shown, if the user doesn't have a name
    // if the user doesn't have a blog, it will be written: No Blog Found/ it can be empty as well by be changing the line below
    address.innerHTML = (data.blog === "") ? "No Blog Found" : data.blog
    console.log(data.blog)
    city.innerHTML = (data.location == null) ? "location not specified" : data.location
    pic.src = (data === null) ? "https://h-o-m-e.org/wp-content/uploads/2022/04/Blank-Profile-Picture-1.jpg" : data.avatar_url
    console.log(pic)
}


// sending a request, receiving the response and handling the possible errors
function process(user, update) {
    // get data from the local storage  (key: user)
    let res = localStorage.getItem(user)

    // If it isn't in the local storage, send a fetch request
    if (res == null) {
        fetch(API_ENDPOINT + user)   // path to the resource we want to fetch (github), default method: GET
            .then((res) => {
                /*if(!Response.ok) // in try-catch
                {
                    throw new Error("Failed to fetch the data : ${response.status}")
                }*/

                if (res.status == 200)  // the request has succeeded
                {
                    return res.json()   //return the response in json format
                }
                else if (res.status == 404)   // username not found
                {
                    return Promise.reject(404)
                }
            }).then((data) => {
                // save data to local storage (key:user, value: a JSON string)
                localStorage.setItem(user, JSON.stringify(data))

                // use the update function to show the data on the website   
                update(data)
                // network error
            })
            .catch((err) => {
                if (err == 404) {
                    alert_text.innerHTML = "Username not Found"
                }
                else {
                    alert_text.innerHTML = "Something went wrong!" + err
                }
                alertObj.style.opacity = 1
                setTimeout(() => {
                    alertObj.style.opacity = 0
                }, 2500)
            })
    }
    // the data is already in the local storage
    else {
        res = JSON.parse(res) // convert to a JavaScript object
        update(res)
    }
}


// setting up a function that will be called whenever the user clicks on the submit button
button.addEventListener("click", (event) => {
    event.preventDefault()
    user = text.value
    process(user, update)
})
