document.addEventListener('DOMContentLoaded', () => {

    const nodeApiUrl = 'http://localhost:6985/api';

    // Variables login
    const loginForm = document.querySelector('#loginForm');
    const loginEmail = document.querySelector('[name="loginEmail"]');
    const loginPassword = document.querySelector('[name="loginPassword"]');

    // Variables register
    const registerForm = document.querySelector('#registerForm');
    const registerName = document.querySelector('[name="registerName"]');
    const registerEmail = document.querySelector('[name="registerEmail"]');
    const registerPassword = document.querySelector('[name="registerPassword"]');

    const userNav = document.querySelector("header nav");

    // Variable search books
    const searchForm = document.querySelector('#searchForm');
    const searchFormData = document.querySelector('#searchFormData');
    const searchButton = document.querySelector('#searchButton');

    // Variable books
    const bookList = document.querySelector('#bookList');



    /* 
        Display functions
    */

    const displayNav = (name, id) => {
        userNav.innerHTML = `
                <h2 user-id="${id}">Hello ${name}</h2>
                <div style="display:flex">
                    <button id="profilBtn">Mon profil</button>
                    <button id="logoutBtn">Déconnexion</button>
                </div>
            `;

        userNav.classList.remove('hidden');

        document.querySelector('#logoutBtn').addEventListener('click', () => {
            // Delete LocalStorage
            localStorage.removeItem('token');
            userNav.innerHTML = '';
            searchForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            loginForm.classList.remove('hidden');
        })

        document.querySelector('#profilBtn').addEventListener('click', () => {
                window.location.href = '/profil/';
        })
    }


    const moreInfoBook = (books) => {
        for (let book of books) {
            book.addEventListener("click", event => {
                const bookTitle = book.getAttribute("bookTitle").toLowerCase().replace(/ /g, "-").replace(/,/g, "");
                const bookId = book.getAttribute("bookId");
                localStorage.setItem('bookId', bookId);
                window.location.href = `/book/${bookTitle}`;

            });
        }
    }

    const displayBookList = collection => {
        searchFormData.value = '';
        bookList.innerHTML = '';
        const userId = document.querySelector('nav h2').getAttribute('user-id');
        for (let item of collection) {
            bookList.innerHTML += `
                    <article style="display:flex">
                        <div>
                            <figure>
                                <img src = "${item.volumeInfo.imageLinks.thumbnail}"
                                alt = "${item.volumeInfo.title}" >
                                <figcaption book-id="${item.id}">${item.volumeInfo.title}</figcaption>
                            </figure>
                            <button class="more-book" bookId="${item.id}" bookTitle="${item.volumeInfo.title}"> Plus d'info </button>
                        </div>
                        <div>
                            <p>Ajouter à une liste :</p>
                            <ul class="add-to-list">
                                <li><button class="favorite" user-id="${userId}" book-id="${item.id}">Mes favoris</button></li>
                                <li><button class="have_read" user-id="${userId}"  book-id="${item.id}">Mes livres lus</button></li>
                                <li><button class="reading" user-id="${userId}"  book-id="${item.id}">Mes lectures en cours</button></li>
                                <li><button class="to_buy" user-id="${userId}"  book-id="${item.id}">A acheter</button></li>
                                <li><button class="to_sell" user-id="${userId}"  book-id="${item.id}">A vendre</button></li>
                            </ul>
                        </div>
                    </article>
                `;
        };
        let oneBookButton = document.querySelectorAll('.more-book');
        console.log(oneBookButton);
        moreInfoBook(oneBookButton);

        let buttonsAddToList = document.querySelectorAll(".add-to-list li button")
        console.log(buttonsAddToList);
        addToBookmarks(buttonsAddToList);
    };

    const addToBookmarks = buttonsAddToList => {

        for (let buttonAddToList of buttonsAddToList) {
            buttonAddToList.addEventListener("click", event => {
                event.preventDefault();
                console.log(buttonAddToList);
                let userId = buttonAddToList.getAttribute("user-id");
                console.log(userId);
                let bookId = buttonAddToList.getAttribute("book-id");
                console.log(bookId);
                let option = buttonAddToList.getAttribute("class");
                console.log(option);

                new FETCHrequest(`${nodeApiUrl}/bookmarks`, 'POST', {
                        user_id: userId,
                        book_id: bookId,
                        options: option
                    })
                    .fetch()
                    .then(fetchData => {
                        console.log(fetchData);
                    })
                    .catch(fetchError => {
                        console.log(fetchError);
                    })
            });
        }

        
    }


    /*
        Display auth user info
    */


    const checkUserToken = () => {
        new FETCHrequest(
                `${nodeApiUrl}/profil`,
                'GET',
                null,
                localStorage.getItem('token')
            )
            .fetch()
            .then(fetchData => {
                searchForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
                loginForm.classList.add('hidden');
                displayNav(fetchData.data.name, fetchData.data._id);
            })
            .catch(fetchError => {
                console.log(fetchError);
            })
    };

    /*
        Form functions
    */

    registerForm.addEventListener('submit', event => {
        event.preventDefault();

        let formError = 0;

        if (registerEmail.value.length < 5) {
            formError++
        };
        if (registerPassword.value.length < 5) {
            formError++
        };

        if (formError === 0) {
            new FETCHrequest(`${nodeApiUrl}/register`, 'POST', {
                    name: registerName.value,
                    email: registerEmail.value,
                    password: registerPassword.value,
                })
                .fetch()
                .then(fetchData => {
                    console.log(fetchData)
                })
                .catch(fetchError => {
                    console.log(fetchError)
                })
        } else {
            displayError('Check mandatory fields')
        }
    });

    loginForm.addEventListener('submit', event => {
        // Stop event propagation
        event.preventDefault();

        // Check form data
        let formError = 0;

        if (loginEmail.value.length < 5) {
            formError++
        };
        if (loginPassword.value.length < 5) {
            formError++
        };

        if (formError === 0) {
            new FETCHrequest(`${nodeApiUrl}/login`, 'POST', {
                    email: loginEmail.value,
                    password: loginPassword.value
                })
                .fetch()
                .then(fetchData => {
                    console.log(fetchData)
                    localStorage.setItem('token', fetchData.data.token);
                    checkUserToken();
                })
                .catch(fetchError => {
                    console.log(fetchError);
                })
        } else {
            displayError('Check mandatory fields')
        }
    });


    searchButton.addEventListener("click", event => {
        event.preventDefault();
        new FETCHrequest(`${nodeApiUrl}/books/search`, 'POST', {
                keywords: searchFormData.value
            })
            .fetch()
            .then(fetchData => {
                displayBookList(fetchData.items);
            })
            .catch(fetchError => {
                console.log(fetchError)
            })
    });




    //check if user is connected
    if (localStorage.getItem('token') !== null) {
        checkUserToken();

    } else {
        console.log("null")
    };
})