'use strict'; 

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
            <a class='book-wiki' href='${responseJson.Similar.Results[i].wUrl}' target='_blank'><button>learn more on wiki</button></a>
            <a class='book-buy' href='${bookBuyLink(responseJson.Similar.Results[i].Name)}' target='_blank'><button>buy it here!</button></a>
            
            </li>`
        );
        $('.js-results').removeClass('hidden');
    };
};



function formatTasteDiveRequest(searchID) { 
    console.log('formattastediverequest running');
    const apiKey = '352618-ChayaLen-VGCEXWH6'
    const bookID = searchID;
    const tastedive = 'https://tastedive.com/api/similar?limit=10&info=1&type=books&q=book:';
    //let bookIDReady = encodeURIComponent(bookID);
    let tastediveRequest = tastedive + bookID + '&k=' + apiKey;
    console.log(tastediveRequest);
    return tastediveRequest;
}

function fetchTasteDiveFunc(searchID) {
    console.log('fetchtastediverunning', searchID);
    let tastediveRequest = 'https://cors-anywhere.herokuapp.com/' +  formatTasteDiveRequest(searchID);
    console.log('tastediverequest=', tastediveRequest);
    fetch(tastediveRequest, {
        headers: new Headers({
            'Origin': 'file:///C:/Users/mushk/coding/bloc/API-Hack-Capstone/index.html?' })
    } )
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
    .catch(err => {
        $('.js-fail-page').removeClass('hidden');
        $('.js-error').text(err);
        console.log(err)
    }) 
}

function renderSearchResults(responseJson) {
    console.log('rendersearchresults is running', responseJson);
    $('.js-results-ul').html('');
    $('.js-results-select').removeClass('hidden');
    for (let i = 0;i < responseJson.items.length && 10 ;i++) {
        const { volumeInfo } = responseJson.items[i];
        $('.js-results-ul').append(
            `<li class='search-result-li' >
                <img src=${volumeInfo.imageLinks.smallThumbnail} alt='book vector' class='book-vector'>
                <p class='book-title'>${volumeInfo.title}</p>
                <span>by</span>
                <p class='book-author'>${volumeInfo.authors.map(author => author + '\n')} <br/>
                <p class='description'>${volumeInfo.description}</p>
                <a class='book-wiki' href=${volumeInfo.infoLink} target='_blank' ><button class='book-ul-btn' >learn more about this book</button></a>
                <a class='book-buy' href=${bookBuyLink(volumeInfo.title)} target='_blank' ><button class='book-ul-btn' >buy this book here</button></a> <br/>
                <button class='recommend-btn ${volumeInfo.title} book-ul-btn ' value=${encodeURIComponent(volumeInfo.title)}><h3>more books like this</h3></button>
            </li>`
        );
        $('.js-results').removeClass('hidden');
    }
    
    $('.recommend-btn').click(function() {
        console.log('recommended nutton clicked, this=:', $(this).val() );
        fetchTasteDiveFunc($(this).val()) 
    })
} 


function fetchSearchFunc() {
    let googleApiKey = 'AIzaSyDkjbMzgLOjujChHmKF1DnoKa3KhEaZsbc';
    const userSearchTerm = $('.js-book-input').val(); //works till here
    let googlebooksRequest = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(userSearchTerm) + '&key=' + googleApiKey;
    console.log('googlebooksrequest', googlebooksRequest);

    fetch(googlebooksRequest) 
    .then(response => {
        if (response.ok) {
            return response.json();
        } throw new Error(response.statusMessage)
    })
    .then(
        responseJson => {
            console.log('successfully got google books responsejson');
            renderSearchResults(responseJson)
        }
    ).catch(err => {
        $('.js-fail-page').removeClass('hidden');
        $('.js-error').text(err);
        console.log('fetchsearchfunc error:', err)
    })
}


function renderCurrentBestsellerResults(responseJson) {
    console.log('rendersearchresults is running', responseJson);
    $('.js-results-ul').html('');
    $('.js-results-select').removeClass('hidden');
    for (let i = 0;i < responseJson.num_results ;i++) {
        const { books } = responseJson.results;
        $('.js-results-ul ').append(
            `<li class='search-result-li' >
                <img src=${books[i].book_image} alt='book vector' class='book-vector'>
                <p class='book-title'>${books[i].title}</p>
                <span>by</span>
                <p class='book-author'>${books[i].author} <br/>
                <p class='description'>${books[i].description}</p>
                <a class='book-wiki' href=${books[i].amazon_product_url} target='_blank' ><button class='book-ul-btn'>learn more about this book</button></a>
                <a class='book-buy' href=${bookBuyLink(books[i].title)} target='_blank' ><button class='book-ul-btn'>buy this book here</button></a> <br/>
                <button class='recommend-btn ${books[i].title} book-ul-btn' value=${encodeURIComponent(books[i].title)}><h3>more books like this</h3></button>
            </li>`
        );
        $('.js-results').removeClass('hidden');
    }
    
    $('.recommend-btn').click(function() {
        console.log('recommended nutton clicked, this=:', $(this).val() );
        fetchTasteDiveFunc($(this).val()) 
    })
}
function fetchCurrent() {
    console.log('fetchcurrent function, here i want to fetch current bestsellers (eg) and on page load display them as recommended books');
    fetch('https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=Qgs1AcncGyAGofxS7FMaXJ1ZI3GCTpB0')
    .then(response => {
        if (response.ok) {
            return response.json();
        } throw new Error(response.statusMessage)
    })
    .then(
        responseJson => {
            console.log('successfully got nytimes bestseller responsejson');
            renderCurrentBestsellerResults(responseJson)
        }
    ).catch(err => {
        $('.js-fail-page').removeClass('hidden');
        $('.js-error').text(err);
        console.log('fetchsearchfunc error:', err)
    })
}

function watchpage() {
    fetchCurrent(); 
    $('.js-input').on('submit', event => {
        console.log('jsinput submitted');
        event.preventDefault();
        fetchSearchFunc();
        console.log('watchpage finished');
    });
};


$(watchpage());
