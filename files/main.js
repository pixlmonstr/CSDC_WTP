class ElementCreator {
    constructor(tag) {
        this.element = document.createElement(tag);
    }

    id(id) {
        this.element.id = id;
        return this;
    }

    class(clazz) {
        this.element.class = clazz;
        return this;
    }

    text(content) {
        this.element.innerHTML = content;
        return this;
    }

    with(name, value) {
        this.element.setAttribute(name, value)
        return this;
    }

    listener(name, listener) {
        this.element.addEventListener(name, listener)
        return this;
    }

    append(child) {
        child.appendTo(this.element);
        return this;
    }

    prependTo(parent) {
        parent.prepend(this.element);
        return this.element;
    }

    appendTo(parent) {
        parent.append(this.element);
        return this.element;
    }

    insertBefore(parent, sibling) {
        parent.insertBefore(this.element, sibling);
        return this.element;
    }
}

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

    /* If you want to know more about this form of getters, read this:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get */
    get id() {
        return this._id;
    }

    set id(id) {
        this._id = "id" + id;
    }

    get cartId() {
        return `cart-${this._id}`;        
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

        new ElementCreator("li").id(book.cartId)
            .append(new ElementCreator("span").text(book.title))
            .append(new ElementCreator("span").text(`${book.quantity} Pcs. \u2014 ${this.round(book.quantity * book.price)}\u20AC`))
            .append(new ElementCreator('span').text('🐢').listener('click', () => {
                this.delete(book);
                this.showSum();
            }))
            .appendTo(document.querySelector("aside ul"))
    }

    calculateSum() {
        let sum = 0;
        for (let book of this.books) {
            sum += book.quantity * book.price;
        }
        return this.round(sum);
    }

    round(amount) {
        return Math.round((amount + Number.EPSILON) * 100) / 100;
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

    addToDOM(category, books) {

        for (const section of document.querySelectorAll("section")) {
            section.remove();
        }

        this.addCategoryToDOM(category);
                                
        for (const book of books) {
            this.addBookToDOM(category, Object.assign(new Book(), book));
        }        
    }

    addCategoryToDOM(category) {
        new ElementCreator("section")
            .id(category.name)
            .append(new ElementCreator("h1").text(category.title))
            .insertBefore(document.querySelector("main"), document.querySelector("main > a[href]"))
    }

    addBookToDOM(category, book) {
        let selectCreator = new ElementCreator("select");
        for (let i = 1; i <= BookStore.MAX_QUANTITY; i++) {
            selectCreator.append(new ElementCreator("option").with("value", i).text(i))
        }

        new ElementCreator("article")
            .id(book.id)
            .append(new ElementCreator("h3").text(book.title))
            .append(new ElementCreator("img").with("src", book.cover).with("alt", "Cover of '" + book.title + "'"))
            .append(new ElementCreator("p")
                .append(new ElementCreator("label").text("Quantity:")
                    .append(selectCreator))
                .append(new ElementCreator("input").with("type", "button").with("value", "Add to cart")
                    .listener("click", () => book.addTo(this.cart))))
            .append(new ElementCreator("p").text("Price: " + book.price + "\u20AC"))
            .append(new ElementCreator("p").text(book.description))
            .appendTo(document.querySelector(`section#${category.name}`));
    }
}

document.addEventListener("DOMContentLoaded", function (event) {

    const bookStore = new BookStore();

    fetch('/api/categories')
        .then(response => response.json())
        .then(categories => categories.forEach(category => {
            new ElementCreator("li")
                .append(new ElementCreator("a").with('href', `#${category.name}`).text(category.title).listener('click', () => {
                    fetch(`/api/categories/${category.name}/books`)
                        .then(response => response.json())
                        .then(books => bookStore.addToDOM(category, books));
                }))
                .appendTo(document.querySelector('nav ul'));
        }))
        .then(() => {
            document.querySelector('nav li:nth-child(2)').querySelector('a').click();
        });

    /* --- Task 1 ---
     * (1) Use the fetch API to retrieve the book categories from the backend
     * and insert a link for each category in the DOM, e.g.,
     * 
     * <li>
     *   <a href="#javascript">JavaScript</a>
     * </li>
     * 
     * Make sure that the categories in the nav element appear in the same
     * order in which they are returned by the server.
     * 
     * (2) Add a click listener to the link, which, when activated, loads
     * the books for the selected category from the server. When the data
     * is received, use bookStore.addToDOM(category, books) to add the 
     * books to the DOM.
     * 
     * (3) Then, programatically click the first link to load the books of
     * the first category.
     */

});

