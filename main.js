
/* A class representing a category of books. It holds all the books belonging to this category.
 *
 * If you wonder what the three dots in the constructor are all about, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
 */
class Category {
    constructor(title, id, ...books) {
        this.title = title;
        this.id = id;
        this.books = books;
    }
}

/* A class representing a book in one of the categories. It contains getters for the ids
 * that represent the book in the main content and in the shopping cart.
 */
class Book {
    constructor(title, cover, price, description, isbn) {
        this.title = title;
        this.cover = cover;
        this.description = description;
        this.isbn = isbn;
        this.price = price;
    }

    /* If you want to know more about this form of getters, read this:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get */
    get id() {
        return `isbn-${this.isbn}`;
    }

    get cartId() {
        return `cart-isbn-${this.isbn}`;        
    }

    addTo(cart) {
        const quantitySelect = document.querySelector(`#${this.id} select`);
        this.quantity = parseInt(quantitySelect.value);
        cart.update(this);
    }
}

/* The shopping cart. Maintains a list of books, renders the items in the cart
 * and calculates renders the total in the cart. */
class ShoppingCart {
    constructor() {
        this.books = [];
    }

    update(book) {
        if (this.books.find(element => element === book)) {
            this.delete(book);
        }
        this.add(book);
        this.showSum();
    }

    delete(book) {
        const index = this.books.indexOf(book);
        if (index > -1) {
            this.books.splice(index, 1);
            document.getElementById(book.cartId).remove();
        }
    }

    add(book) {
        this.books.push(book);

        /* --- Task3 --- 
         * Create a new li element representing the book in the shopping cart.
         * Include the title of the book, the selected quantity and the total 
         * price for the (quantity * price). Round the total price you
         * calculated using the round(...) method in this class before
         * displaying it.
         * 
         * Important: Make sure to add the id given by the cartId property of
         * the book as the id of your li element.
         * 
         * Finally, add the newly created li element to the ul (unordered list)
         * of the aside element (the shopping cart)
         * 
         * An example of what a link element should look like (although you
         * don't have to implement it exactly this way):
         * 
         * <li id="cart-isbn-978-0596806026">
         *     <span>Html5: Up And Running</span>
         *     <span>3 Pcs. - 74.4�</span>
         * </li>
         */


        let ul = document.querySelector('aside > ul');

        let newLi = document.createElement('li');
        newLi.id = book.cartId;

        let newSpan = document.createElement('span');
        newSpan.innerText = book.title;
        newLi.appendChild(newSpan);

        newSpan = document.createElement('span');
        newSpan.innerText = `${book.quantity} Pcs. - ${Math.round(book.quantity * book.price * 10) / 10}€`;
        newLi.appendChild(newSpan);

        ul.appendChild(newLi);
    }

    calculateSum() {
        let sum = 0;
        for (let book of this.books) {
            sum += book.quantity * book.price;
        }
        return this.round(sum);
    }

    round(amount) {
        /* --- Task 4 --- 
         * Find a way to round the given amount with preision 2 and return the
         * rounded amount. 
         */

        return Math.round(amount * 100) / 100;
    }

    showSum() {
        document.querySelector("#sum").innerHTML = this.calculateSum();
    }
}

/* The BookStore class is what renders the books in the DOM and houses the shopping cart. */
class BookStore {
    /* MAX_QUANTITY is the maximum quantity a user can order. You should use this constant in
     * your code to control the number of options you create in the quantity select elements.
     * 
     * If you want to know more about static properties, read this article:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
     */
    static MAX_QUANTITY = 5;

    // static books = [];
    // static cart = new ShoppingCart();

    constructor() {
        this.cart = new ShoppingCart();
    }

    add(categories) {
        for (const category of categories) {
            this.addCategoryToDOM(category);
            for (const book of category.books) {
                this.addBookToDOM(category, book);
            }
        }
    }

    addCategoryToDOM(category) {
        /* --- Task 1 ---
         * Add code to create a new section element containing an h1 element with the category title
         * and add it to the main element 
         * 
         * Hint: Do not forget to add the category id to the section or else your nav links are not
         *       going to work.
         * 
         * Here's how an example section element should look like:
         * 
         * <section id="html5">
         *     <h1>HTML 5 Books</h1>
         * </section>
         */

        // Select a element "go to top"
        let referenceElement = document.querySelectorAll('main > a');
        referenceElement = referenceElement.item(referenceElement.length - 1);

        // Create new section
        let newSection = document.createElement('section');
        newSection.id = category.id;
        let newH1 = document.createElement('h1');
        newH1.innerText = category.title;
        newSection.appendChild(newH1);

        // Insert new section before link "go to top"
        referenceElement.parentNode.insertBefore(newSection, referenceElement);
    }

    addBookToDOM(category, book) {
        // BookStore.books.push(book);
        /* --- Task 2 --- 
         * Add code to create a new article element containing 
         *   - an h3 with the book title
         *   - the book's image
         *   - a paragraph with the quantity (label and select box) and the button "Add to cart".
         *     On the button, add a listener for the "click" event, which when clicked will call the
         *     addTo(...) method on the book and pass along the shopping cart initialized in the
         *     constructor as a parameter      
         *   - a paragraph with the book's price 
         *   - a paragraph with the book's description.
         * 
         * Finally add the new article element to the section which represents the catgory of the book
         * 
         * Important: Add the id provided by book.id as the id of your article element!
         * 
         * Remember: You can assign attributes to your elements using the properties of the element.
         *           For example, given an img element that you created using 
         *           document.createElement("img") assigned to variable myImage you can set the
         *           following attributes:
         *              myImage.src = ... here goes the url of the image ...
         *              myImage.alt = ... here the alternative next of the image
         * 
         * Here's what an example article (more or less) should look like in the end:
         * 
         * <article id="isbn-978-0596806026">
         *    <h3>Html5: Up And Running</h3>
         *    <img src="images/HTML5_Up_And_Running.jpg" alt="Cover of 'Html5: Up And Running'">
         *    <p>
         *        <label>Quantity:
         *            <select>
         *                <option value="1">1</option>
         *                <option value="2">2</option>
         *                <option value="3">3</option>
         *                <option value="4">4</option>
         *                <option value="5">5</option>
         *            </select>
         *        </label>
         *        <input type="button" value="Add to cart"></p>
         *    <p>Price: 24.8�</p>
         *    <p>If you don't know about the new features available in HTML5, now's the time
         *        to find out. This book provides practical information about how and why the
         *        latest version of this markup language will significantly change the way
         *         you develop for the Web.</p>
         * </article>
         */
        let section = document.getElementById(category.id);

        let newArticle = document.createElement('article');
        newArticle.id = 'isbn-' + book.isbn;

        // Create Header
        let newH3 = document.createElement('h3');
        newH3.innerText = book.title;
        newArticle.appendChild(newH3);

        // Create Image
        let newImg = document.createElement('img');
        newImg.src = book.cover;
        newImg.alt = `Cover of '${book.title}'`;
        newArticle.appendChild(newImg);

        // Create First Paragraph
        let newSelect = document.createElement('select');
        for (let index = 1; index <= BookStore.MAX_QUANTITY; index++) {
            let newOption = document.createElement('option');
            newOption.value = index;
            newOption.innerText = index;
            newSelect.appendChild(newOption);
        }
        
        let newLabel = document.createElement('label');
        newLabel.innerText = 'Quantity: ';
        newLabel.appendChild(newSelect);

        let newInput = document.createElement('input');
        newInput.type = 'button';
        newInput.value = 'Add to cart';
 /*       newInput.addEventListener('click', function() {
            let bookId = this.parentNode.parentNode.id.substring(5);
            BookStore.books.find(b => b.isbn == bookId).addTo(BookStore.cart);
        });
*/
        newInput.addEventListener('click', () => {book.addTo(this.cart)});


        let newP = document.createElement('p');
        newP.appendChild(newLabel);
        newP.appendChild(newInput);
        newArticle.appendChild(newP);

        // Price
        newP = document.createElement('p');
        newP.innerText = `Price: ${book.price}€`; // toFixed(2)
        newArticle.appendChild(newP);

        // Last Paragraph
        newP = document.createElement('p');
        newP.innerText = book.description;
        newArticle.appendChild(newP);

        section.appendChild(newArticle);
    }
}

document.addEventListener("DOMContentLoaded", function (event) {

    let categories = [
        new Category("HTML 5 Books", "html5",
            new Book("Html5: Up And Running", "images/HTML5_Up_And_Running.jpg", 24.80,
                "If you don't know about the new features available in HTML5, now's the time to find out. This book provides practical information about how and why the latest version of this markup language will significantly change the way you develop for the Web.", "978-0596806026"),
            new Book("HTML5: Pocket Reference", "images/HTML5_Pocket_Reference.jpg", 15.90,
                "Need help finding the right HTML5 element or attribute for your web page or application? HTML5 Pocket Reference is the classic reference that web designers and developers have been keeping close at hand for more than thirteen years.", "978-1449363352")
        ),
        new Category("JavaScript Books", "javascript",
            new Book("JavaScript: The Definitive Guide", "images/JavaScript_The_Definitive_Guide.jfif", 47.30,
                "This Fifth Edition is completely revised and expanded to cover JavaScript as it is used in today's Web 2.0 applications. This book is both an example-driven programmer's guide and a keep-on-your-desk reference, with new chapters that explain everything you need to know to get the most out of JavaScript.", "9781449308162"),
            new Book("JavaScript: The Good Parts", "images/JavaScript_The_Good_Parts.jfif", 23.90,
                "Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined.", "0596517742")
        )];

    new BookStore().add(categories)

});
