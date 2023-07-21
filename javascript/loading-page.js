document.addEventListener("DOMContentLoaded", function() {
    const loader = document.getElementById("loader");
    const duration = 3000;
    function hideLoader() {
        loader.style.display = "none";
    }
    setTimeout(hideLoader, duration);
});