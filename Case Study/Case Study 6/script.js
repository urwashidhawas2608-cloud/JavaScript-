// Helper: show a message or result inside an output box
function show(id, html) {
    document.getElementById(id).innerHTML = html;
}

// Helper: stop user text from being treated as HTML
function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Helper: one "label: value" line of output
function line(label, value) {
    return `<div class="row"><strong>${label}</strong><span>${value}</span></div>`;
}

// 1. Basic String Operations
// length, toUpperCase(), toLowerCase(), charAt(), trim()
function performBasicOperations() {
    const str = document.getElementById("basicString").value;

    if (str.trim() === "") {
        show("basicOutput", "Please enter a string.");
        return;
    }

    show("basicOutput",
        line("Original String:", escapeHTML(str)) +
        line("Length:", str.length) +
        line("Uppercase:", escapeHTML(str.toUpperCase())) +
        line("Lowercase:", escapeHTML(str.toLowerCase())) +
        line("First Character:", escapeHTML(str.charAt(0))) +
        line("Last Character:", escapeHTML(str.charAt(str.length - 1))) +
        line("After trim():", escapeHTML(str.trim()))
    );
}

// 2. String Methods
// substring(), indexOf(), includes(), split(), replace()
function performStringMethods() {
    const str = document.getElementById("methodString").value;
    const search = document.getElementById("searchText").value;
    const target = document.getElementById("replaceText").value;
    const replacement = document.getElementById("replacement").value;

    if (str.trim() === "") {
        show("methodOutput", "Please enter a string.");
        return;
    }

    const sub = str.substring(0, 5);
    const index = search !== "" ? str.indexOf(search) : "Enter text to search";
    const found = search !== "" ? str.includes(search) : "Enter text to search";
    const parts = str.trim().split(" ").join(" | ");
    const replaced = target !== ""
        ? str.replace(target, replacement)
        : "Enter text to replace";

    show("methodOutput",
        line("substring(0, 5):", escapeHTML(sub)) +
        line("indexOf():", escapeHTML(String(index))) +
        line("includes():", escapeHTML(String(found))) +
        line("split():", escapeHTML(parts)) +
        line("replace():", escapeHTML(replaced))
    );
}

// 3. Case Study: Reverse a String (also checks for a palindrome)
function reverseString() {
    const str = document.getElementById("reverseInput").value;

    if (str.trim() === "") {
        show("reverseOutput", "Please enter a string.");
        return;
    }

    const reversed = str.split("").reverse().join("");
    const isPalindrome = str.toLowerCase() === reversed.toLowerCase();

    show("reverseOutput",
        line("Reversed String:", escapeHTML(reversed)) +
        line("Palindrome:", isPalindrome ? "Yes" : "No")
    );
}

// 4. Case Study: Count Vowels in a Paragraph
function countVowels() {
    const paragraph = document.getElementById("paragraphInput").value;

    if (paragraph.trim() === "") {
        show("vowelOutput", "Please enter a paragraph.");
        return;
    }

    const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    let letters = 0;

    for (const ch of paragraph.toLowerCase()) {
        if (ch >= "a" && ch <= "z") {
            letters++;
            if (ch in counts) {
                counts[ch]++;
            }
        }
    }

    const total = counts.a + counts.e + counts.i + counts.o + counts.u;
    const breakdown = Object.entries(counts)
        .map(([v, n]) => `${v.toUpperCase()}: ${n}`)
        .join(" &nbsp; ");

    show("vowelOutput",
        line("Number of Vowels:", total) +
        line("Breakdown:", breakdown) +
        line("Consonants:", letters - total) +
        line("Words:", paragraph.trim().split(/\s+/).length)
    );
}

// Connect the buttons to their functions
document.getElementById("basicBtn").addEventListener("click", performBasicOperations);
document.getElementById("methodBtn").addEventListener("click", performStringMethods);
document.getElementById("reverseBtn").addEventListener("click", reverseString);
document.getElementById("vowelBtn").addEventListener("click", countVowels);
