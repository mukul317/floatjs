const M = window.M;
const yearElem = document.getElementById("year");
if (yearElem) {
    yearElem.innerText = new Date().getFullYear();
}
document.addEventListener("DOMContentLoaded", function () {
    const elems = document.querySelectorAll(".sidenav");
    const instances = M.Sidenav.init(elems, {});
});
