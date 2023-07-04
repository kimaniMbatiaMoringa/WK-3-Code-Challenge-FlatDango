const init = () =>{
    fetch('http://localhost:3000/films')
    .then(function(res){
        return res.json()
    })
    .then(function(object){
        object.forEach(function({id,title,poster, description, capacity, tickets_sold}){                //For each of the movie objects in the object array:
            let movieListDiv = document.getElementById('movieList')                                     //Creates a div for the movie object
            

            let movieItem = document.createElement('li')                                                //creates a list element to store each movie object as part of a list
            movieItem.style.hover = "background-color: yellow"
            

            let moviePoster = document.createElement('img')                                             //creates an image element to store the poster
            moviePoster.src = poster
            moviePoster.setAttribute("width", "150px", "height", "500px")

            let movieTitle = document.createElement('h5')                                               //creates an h5 element to store the title
            movieTitle.innerText = title

            let movieDescription = document.createElement('p')                                          //creates an p element to store the description
            movieDescription.innerText = description

            let movieSeats = document.createElement('p')                                                //creates an p element to store the available seats
            movieSeats.innerText = `${capacity - tickets_sold} seats are remaining`                     //Prints the available seats based on comparing the movie capacity and the number of tickets sold

            //let buyTicket = document.createElement('button')
            //buyTicket.innerText= "Buy Ticket"

            movieItem.dataset.id = id                                                                   //Sets the id of each of the new created elements to match the id of each movie
            moviePoster.dataset.id = id
            movieDescription.dataset.id = id

            movieItem.append( moviePoster, movieTitle,movieDescription, movieSeats)                     //Appends all the newly created elements to the 

            //movieListDiv.setAttribute('width', "100px")
            movieListDiv.append(movieItem)                                                              //Appends the movieItem to the existing "#movieList" div
            //document.body.appendChild(movieListDiv)

        });
    })

    let movieListDiv = document.getElementById('movieList')

    let selectedMovieURL = `http://localhost:3000/films/${1}`                                           //Sets the default movie to be shown in the firstMovieDisplay to "id:1"
    firstMovieDisplay()                                                                                 //Displays the default movie in the #firstMovieDisplay div

    movieListDiv.addEventListener('click', (event)=>{
        const movieId = event.target.dataset.id                                                         //Gets the id of the element selected (See lines 31-33)
        //alert (movieId)
        selectedMovieURL = `http://localhost:3000/films/${movieId}`                                     //Sets url to match the id of the selected element                                   
        clearFirstMovieDisplay()                                                                        //Clears the firstMovieDisplay of its default values and adds that of the selected movie (See line 49 and)
        firstMovieDisplay()                                                                             
    })

    

    
/**************************************************************** 
    Function Clears the firstMovieDisplay of its default values
*****************************************************************/

    function clearFirstMovieDisplay(){
       let firstMovieDisplay =document.getElementById('firstMovieDisplay')
       firstMovieDisplay.innerHTML=''
    }




/**************************************************************** 
    Function That Prints the selected move on to the #firstMovieDisplay div
*****************************************************************/

    function firstMovieDisplay(){
        fetch(selectedMovieURL)                                                                         //Gets the selected url (See lines 46 and 51)
        .then(function(res){
            return res.json()
        })
        .then(function(object){
            let firstMovieDisplay = document.getElementById('firstMovieDisplay')

            let movieTitle = document.createElement('h1')
            movieTitle.innerText = object.title

            let moviePoster = document.createElement('img')                                              //creates an image element to store the poster
            moviePoster.src = object.poster
            moviePoster.setAttribute("width", "500px", "height", "800px")

            let movieRunTime = document.createElement('p')
            movieRunTime.innerText = object.runtime + " minutes";

            let movieShowtime = document.createElement('p');
            movieShowtime = `starts at ${object.showtime}`

            let ticketsSold = object.tickets_sold

            let movieSeats = document.createElement('p')
            let availableSeats = object.capacity - object.tickets_sold

            if(availableSeats == "0"){
                var movieSoldOut = true
                movieSeats.innerText = "SOLD OUT"
                firstMovieDisplay.append(moviePoster, movieTitle, movieRunTime, movieShowtime, movieSeats)
            }

            else{
                movieSeats.innerText = `${availableSeats} seats are remaining`
                var buyTicket = document.createElement('button')
                buyTicket.innerText= "Buy Ticket"
                firstMovieDisplay.append(moviePoster, movieTitle, movieRunTime, movieShowtime, movieSeats,buyTicket)
            }
            //alert(object.id)
            //firstMovieDisplay.append(moviePoster, movieTitle, movieRunTime, movieShowtime, movieSeats,buyTicket)
        
            //Reduces the number of available tickets
            buyTicket.addEventListener('click', (event)=>{
                alert(`ticket for ${object.title} bought`)
                fetch(selectedMovieURL)
                    .then(function (res){
                        return res.json()
                    })
                    .then(function(object){
                        alert(object.tickets_sold)

                        if(movieSoldOut == true){
                            alert("Movie SOLD OUT!")
                            movieSeats.innerText = "SOLD OUT"
                        }

                        else{
                            return fetch(selectedMovieURL,{
                                method: "PATCH",
                                headers: {
                                    "Content-Type" : "application/json",
                                },
                                body: JSON.stringify({
                                    ...object,
                                    tickets_sold: Number(ticketsSold + 1),
                                })
                            }) 
                        }
                    })
                    .then(response=>response.json())
                    .then((object)=>{
                        let availableSeats = object.capacity - object.tickets_sold
                            movieSeats.innerText = `${availableSeats}(TEST) seats are remaining`
                            window.location.reload();                                                       //reloads the page to restart the init process and print the updated object.tickets_sold

                    }) 

                        //alert(`increasing tickets sold from ${object.tickets_sold}`)
                        //object.tickets_sold = object.tickets_sold +  1
            })
        })
    }


    }

document.addEventListener('DOMContentLoaded', init);

