const M = window.M;
const defaultPage = "about";

const scrollInView = id => {
    try {
        const element = document.getElementById(id);
        if (element) {
            const scrollTimer = setTimeout(() => {
                element.scrollIntoView({ behavior: "smooth", inline: "nearest" });
                clearTimeout(scrollTimer);
            }, 500);
        }
    } catch (err) {
        console.warn(err.message);
    }
};

const getPageId = (url) => {
    try {
        const ref = url ? url : window.location.href;
        return ref.split("#").pop();
    } catch (err) {
        console.warn(err.message);
        return defaultPage;
    }
};

window.addEventListener("hashchange", function (e) {
    scrollInView(getPageId(e.newURL));
});

window.addEventListener("DOMContentLoaded", function () {
    const linkList = document.querySelectorAll(".menu-link");
    const elems = document.querySelectorAll(".sidenav");
    const instances = M.Sidenav.init(elems, {
        draggable: true,
        preventScrolling: true
    });
    if (linkList && linkList.length > 0) {
        linkList.forEach(item => item.addEventListener("click", () => {
            instances[0].close();
            scrollInView(getPageId());
        }));
    }
    scrollInView(getPageId());
});
