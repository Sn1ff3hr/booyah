# Troubleshooting Guide

This guide provides tips for troubleshooting common HTML, CSS, and JavaScript errors, especially in the context of the owner and consumer pages.

## General Approach to Troubleshooting

1.  **Check the Browser Console:** This is your best friend. Open your browser's developer tools (usually by pressing F12) and look at the "Console" tab. Errors will be displayed here, often with line numbers pointing to the problematic code.
2.  **Validate Your HTML and CSS:** Use online validators (like the W3C validator for HTML or Jigsaw for CSS) to catch syntax errors.
3.  **Isolate the Problem:** If you have a complex page, try commenting out sections of your code to see if the error disappears. This helps pinpoint the source.
4.  **"Rubber Ducking":** Explain the problem out loud to someone else, or even to an inanimate object (like a rubber duck). Often, the act of explaining helps you see the solution.
5.  **Search Online:** Copy and paste error messages into a search engine. Chances are, someone has encountered the same problem.

## Common HTML Errors

*   **Typos in Tags or Attributes:** `<div>` vs `<divv>`, `class=` vs `clss=`.
*   **Unclosed Tags:** Forgetting a closing tag like `</div>` or `</span>`. This can mess up the entire page layout.
*   **Incorrect Nesting:** Tags must be closed in the reverse order they were opened. Example: `<div><p>Text</p></div>` (correct) vs `<div><p>Text</div></p>` (incorrect).
*   **Case Sensitivity (for some attributes/values):** While HTML tags are case-insensitive, attribute values (like IDs and classes in CSS/JS) can be.
*   **Linking Issues:**
    *   Incorrect file path in `<link href="styles.css">` or `<script src="script.js">`. Double-check paths relative to your HTML file.
    *   Typo in the filename itself.

## Common CSS Errors

*   **Typos in Property Names or Values:** `color: blue;` vs `colour: blue;` or `margin: 10px;` vs `margin: 10pxx;`.
*   **Missing Semicolons:** Each CSS declaration (property: value) must end with a semicolon.
*   **Selector Specificity:** More specific selectors override less specific ones. If a style isn't applying, it might be overridden by another rule. Use the browser's "Inspect Element" tool to see which styles are active and which are overridden.
*   **Incorrect Class or ID Names:** Ensure the names in your CSS match *exactly* those in your HTML (case-sensitive).
*   **Box Model Issues:** Understanding `padding`, `border`, and `margin` and how they affect element size and spacing is crucial. The "Inspect Element" tool is great for visualizing this.
*   **`display` Property:** Misunderstanding `block`, `inline`, `inline-block`, `flex`, `grid` can lead to layout problems.

## Common JavaScript Errors

*   **Syntax Errors:** Missing parentheses `()`, brackets `[]`, braces `{}`, or semicolons `;`. The browser console will usually point these out.
*   **Typos in Variable or Function Names:** `myVariable` vs `myvariable`. JavaScript is case-sensitive.
*   **`null` or `undefined` Errors:** Trying to access a property or call a method on a variable that hasn't been initialized or an element that doesn't exist.
    *   Example: `document.getElementById('nonExistentElement').innerHTML = '...';`
    *   **Fix:** Always check if an element exists before trying to manipulate it:
        ```javascript
        const myElement = document.getElementById('myId');
        if (myElement) {
          // ...do something with myElement
        } else {
          console.error('Element with ID "myId" not found!');
        }
        ```
*   **Incorrect Function Calls:** Passing the wrong number or type of arguments.
*   **Scope Issues:** Variables defined inside a function are not accessible outside it, unless explicitly returned or made global (generally discouraged).
*   **Asynchronous Operations:** Code involving `fetch`, `setTimeout`, or event listeners can be tricky. Ensure you understand how promises or callbacks work.
*   **Type Errors:** Trying to perform an operation on the wrong data type (e.g., adding a string to a number expecting a sum). Use `parseInt()`, `parseFloat()`, or `Number()` to convert strings to numbers.

## Debugging the Owner & Consumer Pages

### Owner Page (`owner.html`, `owner.js`, `owner.css`)

*   **Calculations Not Working (`owner.js`):**
    *   Check `toFloat()` function: Ensure it correctly parses values. Use `console.log` inside it to see what it's receiving and returning.
    *   Event Listeners: Verify that event listeners on input fields (`subtotal`, `vat`, `quantity`, `futureSelling`) are correctly attached and calling `updateCalculatedFields()`.
    *   Field IDs: Double-check that all `document.getElementById(...)` calls match the IDs in `owner.html`. A typo here is a common mistake.
    *   `toFixed(2)`: This is for display. Ensure the actual numbers used in calculations are correct before formatting.
*   **Table Not Populating (`owner.js`):**
    *   Form Submission: Ensure `productForm.onsubmit` is correctly preventing default submission and that `updateCalculatedFields()` is called.
    *   Element Selection: `document.querySelector('#inventoryTable tbody')` must correctly select the table body.
    *   ID Mapping: The `map(id => ...)` part relies on correct element IDs.
*   **Image Preview Not Working (`owner.js`):**
    *   `cameraBtn` and `uploadImg` event listeners: Check they are correctly set up.
    *   `FileReader` logic: Use `console.log` within `r.onload` to check `e.target.result`.

### Consumer Page (`consumer.html`, `consumer.js`, `consumer.css`)

*   **Products Not Rendering (`consumer.js`):**
    *   `products` array: Ensure it's correctly defined.
    *   `renderProducts()` function:
        *   `document.getElementById('productGrid')`: Check if the element exists.
        *   Looping: Use `console.log(p, i)` inside the `forEach` loop to inspect product data.
        *   Dynamic HTML: Check for typos or syntax errors in the template literal creating `card.innerHTML`.
*   **Carousel Not Scrolling (`consumer.js`):**
    *   `scrollCarousel()`: `console.log(direction, scrollAmount)` to check inputs.
    *   `grid.scrollBy`: Verify `productGrid` is correctly selected.
*   **Quantity Update/Order Summary Not Working (`consumer.js`):**
    *   `updateQty()`: `console.log(index, change, products[index].qty)` to debug.
    *   `updateSummary()`:
        *   `document.getElementById` calls for `subtotal`, `vat`, `total`.
        *   Logic for calculating subtotal and VAT.
*   **Modal Not Opening/Closing (`consumer.js`):**
    *   `openModal()` / `closeModal()`: Check `modalOverlay` and `modalImage` selections.
    *   `display: 'flex'` vs `display: 'none'`: Ensure these are being toggled correctly.
    *   Event listeners for escape key and overlay click.
*   **Language Toggle Not Working (`consumer.js`):**
    *   `toggleLang()`: Check element selections (`langBtn`, `title`, etc.) and `textContent` updates.

## Using Browser Developer Tools

*   **Elements Panel:** Inspect the HTML structure (DOM), see applied CSS, and even edit HTML/CSS live to test changes.
*   **Console Panel:** View errors, logs (`console.log()`), and run JavaScript commands.
*   **Sources Panel:** View loaded files (HTML, CSS, JS), set breakpoints in JavaScript to pause execution and inspect variables.
*   **Network Panel:** See all network requests (images, CSS, JS files). Check for 404 (Not Found) errors if files aren't loading.

By systematically checking these points, you can resolve most common web development issues.

## Troubleshooting the Current (Manual) Setup

**As of the last update, `npm` (Node Package Manager) was not functional in the environment. This has prevented the installation and use of tools like ESLint, Prettier, and Tailwind CSS.**

The project has been configured *conceptually* for these tools:
*   `package.json` lists the intended dependencies and scripts.
*   Configuration files (`.eslintrc.js`, `tailwind.config.js`, `postcss.config.js`) have been created.
*   A `src/input.css` file contains Tailwind directives.
*   HTML files (`owner.html`, `consumer.html`) have comments indicating where Tailwind's output CSS would be linked.

**Current Limitations & How to Proceed When `npm` is Working:**

1.  **No Automated Linting/Formatting:**
    *   **Problem:** ESLint and Prettier are not installed, so `npm run lint` or `npm run format` will not work.
    *   **Solution (once `npm` works):**
        1.  Open your terminal in the project root.
        2.  Run `npm install` (or `npm ci`) to install all dependencies listed in `package.json`.
        3.  After installation, you should be able to run `npm run lint` and `npm run format`.

2.  **Tailwind CSS Not Being Processed:**
    *   **Problem:** `owner.css` and `consumer.css` are still providing the styles. The Tailwind directives in `src/input.css` are not being compiled into `dist/output.css`.
    *   **Solution (once `npm` works):**
        1.  Ensure `npm install` has been run successfully.
        2.  Run `npm run build:css` (or `npm run build`). This should invoke PostCSS to process `src/input.css` using `tailwind.config.js` and output the result to `dist/output.css`.
        3.  Once `dist/output.css` is generated:
            *   Uncomment the line `<link rel="stylesheet" href="dist/output.css">` in `owner.html` and `consumer.html`.
            *   You can then start refactoring the HTML to use Tailwind utility classes.
            *   Gradually, you can remove styles from `owner.css` and `consumer.css` as you replace them with Tailwind utilities. Eventually, these old CSS files might be deleted.

## Common Tailwind CSS Issues (General Advice for Future Use)

*   **Classes Not Applying:**
    *   **Purging:** Tailwind removes unused CSS in production builds. If you add classes dynamically with JavaScript or have typos, they might be purged. Ensure your `tailwind.config.js` `content` array correctly lists all files that contain Tailwind classes (`.html`, `.js`, `.vue`, etc.).
    *   **Typos:** Tailwind class names are specific. `bg-blue-500` is correct, `bg-blue500` or `bg-Blue-500` is not.
    *   **Specificity:** While Tailwind tries to keep specificity low, ensure your custom CSS (if any) isn't accidentally overriding Tailwind classes with higher specificity. Use browser dev tools to inspect.
    *   **Incorrect File Path for Output CSS:** Make sure your HTML files are linking to the correct path where your Tailwind-processed CSS is generated (e.g., `dist/output.css`).
    *   **Build Process Not Run:** If you make changes to `tailwind.config.js` or add new classes, you might need to re-run your build process (e.g., `npm run build:css`).
*   **Configuration Not Working:**
    *   If you extend the theme in `tailwind.config.js`, ensure you're using the correct syntax.
    *   Restart your development server/build process after changing `tailwind.config.js`.

## PWA and Service Worker Issues

*   **Service Worker Not Registering:**
    *   Check browser console for errors during registration in `owner.html` or `consumer.html`.
    *   Ensure `service-worker.js` is in the correct path (root for `./service-worker.js`).
    *   PWAs require HTTPS (except for `localhost`). If testing on a remote server, ensure it's HTTPS.
*   **Caching Problems:**
    *   During development, you might need to "Update on reload" for the service worker in browser dev tools (Application > Service Workers) to see changes immediately.
    *   Incorrect file paths in `URLS_TO_CACHE` in `service-worker.js`.
    *   The cache version (`CACHE_NAME`) might need updating if you make significant changes to cached assets to ensure the new assets are fetched and cached.
