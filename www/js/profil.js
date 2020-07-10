document.addEventListener('DOMContentLoaded', () => {
    const nodeApiUrl = 'http://localhost:6985/api';

    const userNav = document.querySelector("header nav");

    //Bookmarks sections
    const myBookmarks = document.querySelector("#myBookmarks");
    const bookmarksFavorite = document.querySelector("#bookmarksFavorite");
    const bookmarksHaveRead = document.querySelector("#bookmarksHaveRead");
    const bookmarksReading = document.querySelector("#bookmarksReading");
    const bookmarksToBuy = document.querySelector("#bookmarksToBuy");
    const bookmarksToSell = document.querySelector("#bookmarksToSell");

    const displayNav = (name, id) => {
        userNav.innerHTML = `
                <h2 user-id="${id}">Hello ${name}</h2>
                <div style="display:flex">
                    <button id="accueilBtn">Accueil</button>
                    <button id="logoutBtn">Déconnexion</button>
                </div>
            `;

        userNav.classList.remove('hidden');

        document.querySelector('#logoutBtn').addEventListener('click', () => {
            // Delete LocalStorage
            localStorage.removeItem('token');
            window.location.href = '/';

        })

        document.querySelector('#accueilBtn').addEventListener('click', () => {
            window.location.href = '/';
        })
    }

    const checkUserToken = () => {

        new FETCHrequest(
                `${nodeApiUrl}/profil`,
                'GET',
                null,
                localStorage.getItem('token')
            )
            .fetch()
            .then(fetchData => {
                displayNav(fetchData.data.name, fetchData.data._id);
                getBookmarks(fetchData.data._id);
            })
            .catch(fetchError => {
                console.log(fetchError);
            })

    }

    const getBookmarks = userId => {
        console.log(userId);
        new FETCHrequest(`${nodeApiUrl}/profil/bookmarks`, 'POST', {
                userId: userId
            }, localStorage.getItem('token'))
            .fetch()
            .then(fetchData => {
                console.log(fetchData);
                // myBookmarks.innerHTML = '';
                // for (let bookmark of bookmarks) {
                //     myBookmarks.innerHTML += `
                //     <div>
                //         <p>${book_id}</p>
                //         <p>${options}</p>
                //     </div>
                // `;
                // }
            })
            .catch(fetchError => {
                console.log(fetchError)
            })
    }

    checkUserToken();



})