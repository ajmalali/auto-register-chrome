document.addEventListener("DOMContentLoaded", function() {
    console.log("in script.js");
    let rows = document.querySelectorAll('table tbody tr');
    let crns = rows[2].innerText;
    console.log(crns);
});