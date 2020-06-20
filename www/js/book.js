document.addEventListener('DOMContentLoaded', () => {

    const nodeApiUrl = 'http://localhost:6985/api';
const googleBookApiUrl = 'https://www.googleapis.com/books/v1/volumes';

    const bookInfo = document.querySelector("#bookInfo");
    const buttonAddToList = document.querySelectorAll(".add-to-list button")
    console.log(buttonAddToList);
    
    const infoBook = InfoBook = () => {
        const bookId = localStorage.getItem('bookId');
        console.log(bookId);
        new FETCHrequest(`${nodeApiUrl}/book/${bookId}`, 'GET', {
                id: bookId
            })
            .fetch()
            .then(fetchData => {
                console.log(fetchData);
                let book = fetchData.items[0];
                 bookInfo.innerHTML += `
                    <article>
                        <figure>
                            <img src = "${book.volumeInfo.imageLinks.thumbnail}"
                            alt = "${book.volumeInfo.title}" >
                            <figcaption book-id="${book.id}">${book.volumeInfo.title}</figcaption>
                        </figure>
                        <button class="more-book" bookId="${book.id}" bookTitle="${book.volumeInfo.title}"> Plus d'info </button>
                    </article>
                `;
            })
            .catch(fetchError => {
                console.log(fetchError)
            })
    }

    infoBook();

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
})