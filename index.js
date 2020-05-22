'use strict';
//to do wednesday: fix code issues(brings wrong list???????)done!, finish rendering done for one api!, fetch other api,
//render other api,  finish js! ask opinions, do css!

///https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key= latest bestseller list of books

//https://cors-anywhere.herokuapp.com/ ******
//to enable cors... pu tthis somewher, where?
//jQuery.ajaxPrefilter(function(options) {
//    if (options.crossDomain && jQuery.support.cors) {
//        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
//    }
//});

function bookBuyLink(bookTitle) {
    let bookSearch =  encodeURIComponent(bookTitle);
    let bookdiveRequest = 'https://www.bookdepository.com/search?searchTerm=' + bookSearch + '&search=Find+book';
    return bookdiveRequest;
}

function renderPage(responseJson) {
    console.log('renderPage ran!', responseJson);
    $('.js-results-ul').html('');
    for (let i = 0;i<responseJson.Similar.Results.length;i++) {
        $('.js-results-ul').append(
            `<li class='result-li'>
            <h3 class='book-title'><img src='https://www.netclipart.com/pp/m/175-1753052_barnetts-reading-book-icon-flat-design.png' alt='book vector' class='book-vector'>${responseJson.Similar.Results[i].Name}</h3>
            <p class='book-teaser'>${responseJson.Similar.Results[i].wTeaser}</p>
            <a href='${responseJson.Similar.Results[i].wUrl}' target='_blank'><button>learn more on wiki</button></a>
            <a href='${bookBuyLink(responseJson.Similar.Results[i].Name)}' target='_blank'><button>buy it here!</button></a>
            
            </li>`
        );
        $('.js-results').removeClass('hidden');
    };
 //  similar.results[i].wUrl = wikipedia link?
/*   google books: 
buyLink .description, .pageCount, mainCategory/ categories, authors[can be range]
 averageRating,ratingsCount, imageLinks (thumbnail, small...)
 GET https://www.googleapis.com/books/v1/volumes/zyTCAlFPjgYC?key=yourAPIKey 

  !  for each result (max 10?)
   ! resultsul.append(
    !    section book-result with: 
     !   book title, 
      £  author
      £  rating(stars), count
      !  synopsis
      £ categpries  genres 
        link to more reviews
       googlebooks .buyLink link to buy it
        extra: search for recommendations for this book/amazon excerpt from the book?   
    )      */
}



function fetchFunc() {
    let tastediveRequest = 'https://cors-anywhere.herokuapp.com/' +  formatTasteDiveRequest();
    console.log(tastediveRequest);
    fetch(tastediveRequest) /*,  {
        headers: new Headers({
            'Access-Control-Allow-Origin': 'file:///C:/Users/mushk/coding/bloc/API-Hack-Capstone/index.html?' })
    }) */
    .then (response => {
        if (response.ok) {
            return response.json();
            
        } throw new Error(response.statusMessage)
    })
    .then(
        responseJson => {
            console.log('second .then', responseJson);
            renderPage(responseJson)
        })
    .catch(err =>
        {$('.js-fail-page').removeClass('hidden');
        $('.js-error').text(err);
        console.log(err)
    })
}


function formatTasteDiveRequest() { //do for other api!!!      i took out: 
    //format each of the requests and save to variables
    const apiKey = '352618-ThumbsUp-8LNCY7RC'
    const userInput = $('.js-book-input').val();
    const tastedive = 'https://tastedive.com/api/similar?limit=10&info=1&type=books&q=book:';
    let userInputReady = encodeURIComponent(userInput);
    console.log(userInput, userInputReady, '= user input ready ')
    let tastediveRequest = tastedive + userInputReady + '&k=' + apiKey;
    console.log(tastediveRequest);
    return tastediveRequest;
}

function fetchCurrent() {
}
// https://www.goodreads.com/book/title.FORMAT  for book reviews

    /* i need to take the title from fetchfunc, 
    then insert that to new request call
    , then fetch it, 
    then insert it into button in html

    */
//or google books api has avg review and numreviews and description,  book img and buy link:)

function watchpage() {
 // make  fetchCurrent(); on start page have recommendations for current bestsellers.
 //https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=Qgs1AcncGyAGofxS7FMaXJ1ZI3GCTpB0
    fetchCurrent(); 
    $('.js-input').on('submit', function(event) {
        event.preventDefault();
        fetchFunc();
        console.log('watchpage ran', console.log($('body')));
    })

    /*
     when submit clicked,
     event.preventdefault
    format api requests (all of them )
    fetch (all of them) (function which will fetch all oof them)   */
}


$(watchpage())
