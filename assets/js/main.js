// To make images retina, add a class "2x" to the img element

function isRetina() {
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
					  (min--moz-device-pixel-ratio: 1.5),\
					  (-o-min-device-pixel-ratio: 3/2),\
					  (min-resolution: 1.5dppx)";

	if (window.devicePixelRatio > 1)
		return true;

	if (window.matchMedia && window.matchMedia(mediaQuery).matches)
		return true;

	return false;
};

function retina() {

	if (!isRetina())
		return;

	let retina = document.querySelectorAll("img[class='2x']");
	retina.forEach(element => {
		let path = element.getAttribute("src");

		path = path.replace(".png", "@2x.png");
		path = path.replace(".jpg", "@2x.jpg");
		element.setAttribute("src", path);
	});
};

function setDarkMode(isDark) {
	var darkBtn = document.getElementById("darkBtn");
	var lightBtn = document.getElementById("lightBtn");
	if (isDark) {
		lightBtn.style.display = "inline-block";
		darkBtn.style.display = "none";
		localStorage.setItem("preferredTheme", "dark");
	} else {
		lightBtn.style.display = "none";
		darkBtn.style.display = "inline-block";
		localStorage.removeItem("preferredTheme");
	}
	document.body.classList.toggle("dark-mode");
}

document.addEventListener(
	"DOMContentLoaded",
	function() {
		retina();
		var darkThemeSelected = localStorage.getItem('preferredTheme') === 'dark';

    // Get buttons
    var darkBtn = document.getElementById("darkBtn");
    var lightBtn = document.getElementById("lightBtn");
    
    // Set their initial visibility based on the preferred theme
    if (darkThemeSelected) {
      darkBtn.style.display = "none";
      lightBtn.style.display = "inline-block";
    } else {
      darkBtn.style.display = "inline-block";
      lightBtn.style.display = "none";
    }
	},
	false
);

window.onload = (event) => {
	var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

	if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in
		window.IntersectionObserverEntry.prototype) {
		let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					let smallImage = entry.target
					let lazyParentImageDiv = smallImage.parentElement;

					//add effect blurring with effect transition
					smallImage.classList.add('loaded');

					// Load large image
					var largeImage = new Image();
					largeImage.src = lazyParentImageDiv.getAttribute('data-large');
					let alt = lazyParentImageDiv.getAttribute('data-alt');
					largeImage.onload = function () {
						largeImage.classList.add('loaded');
						largeImage.alt = alt;
						largeImage.setAttribute('aria-label', alt);
            largeImage.setAttribute('width', lazyParentImageDiv.offsetWidth);
            largeImage.setAttribute('height', '100%');
						smallImage.replaceWith(largeImage);
					};
          lazyParentImageDiv.setAttribute('style', 'border: none;');
					largeImage.classList.remove("lazy");
					if(entry.intersectionRatio > 0){
						lazyImageObserver.unobserve(smallImage);
					}
				}
			});
		});

		lazyImages.forEach(function (lazyImage) {
			lazyImageObserver.observe(lazyImage);
		});
	}
};
