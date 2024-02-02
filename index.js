// Get a reference to the main gallery element:
let gallery = document.querySelectorAll(".gallery")[0];

// Get arrays of gallery items and images:
let galleryItems = document.querySelectorAll(".gallery-item");
let galleryImages = document.querySelectorAll(".gallery > div > .gallery-image");

// Get a reference to the first gallery image (likely for specific use):
let galleryImage = document.querySelector(".gallery-image");

// Function to assign tabindex values sequentially to elements:
let numberTabIndex = function(elementsArray) {
  let i = 1;

  // Check if elements already have tabindex assigned:
  if (elementsArray.tabIndex == undefined || elementsArray.tabIndex == null) {
    elementsArray.forEach(function(element) {
      // Assign a tabindex value for keyboard navigation:
      element.tabIndex = i;
      i++;
    });
  }
};

// Apply tabindex values to gallery items:
// Ensure keyboard navigation for gallery items (explained previously)
numberTabIndex(galleryItems);

// Handle view image overlay (if applicable)
let imageOverlay = function() {
	let viewBox = document.querySelector(".view-box");
	if(viewBox !== undefined && viewBox !== null){
		if(viewBox.classList.contains('view')){
			viewBox.addEventListener('click', function(e){
				viewImageOverlay(false);
			});
		}
	}
}
imageOverlay();

// Function to manage the view image overlay
let viewImageOverlay = function(state='') {
	let viewBox = document.querySelector(".view-box");
	let viewBoxWidth = window.getComputedStyle(viewBox).getPropertyValue("width");
	let viewBoxHeight = window.getComputedStyle(viewBox).getPropertyValue("height");

	let previewImage = function(state='') {
		let viewedImage = viewBox.querySelector("picture img");
		if(state == 'show'){
			galleryImages.forEach(function(img){
				img.removeAttribute('zoomable');
			});
			viewBox.querySelector("picture").scrollTop = 0;
			viewedImage.src = viewImageHref;
			
			viewBox.querySelector("picture").setAttribute('style',  `height: ${window.innerHeight}px`);
			viewedImage.setAttribute('height',  `${window.innerHeight}px`);
			// viewedImage.style.transform = `scale(1)`;
			
			viewedImage.classList.add('zoomable');
			viewedImage.addEventListener('click', function(e){
				viewedImage.style.width = '';
				viewedImage.style.height = '';
				viewedImage.removeAttribute('height');
			});
		}
		else {
			viewedImage.src = '';
			// viewedImage.style.height = '';
			viewedImage.classList.remove('zoomable');
			galleryImages.forEach(function(img){
				img.removeAttribute('zoomable');
			});
			
			if(viewedImage.parentElement.querySelector('.preview-zoom i').classList.contains('fa-search-minus')){
				viewedImage.parentElement.querySelector('.preview-zoom i').classList.add('fa-search-plus');
				viewedImage.parentElement.querySelector('.preview-zoom i').classList.remove('fa-search-minus');
			}
			else if(viewedImage.parentElement.querySelector('.preview-zoom i').classList.contains('fa-search-plus')){
				viewedImage.parentElement.querySelector('.preview-zoom i').classList.add('fa-search-minus');
				viewedImage.parentElement.querySelector('.preview-zoom i').classList.remove('fa-search-plus');
			}
		}
	}

	if((viewBox.classList.contains('view') || state == true) || (state == 'add' || state == 'show')){
		viewBox.classList.add('view');
		document.querySelector('body').classList.add('no-scroll');
		previewImage('show');
	}
	if((!viewBox.classList.contains('view') || state == false) || (state == 'remove' || state == 'delete')){
		viewBox.classList.remove('view');
		document.querySelector('body').classList.remove('no-scroll');
		previewImage('hide');
	}
	
	viewBox.addEventListener('click', function(e){
		if(e.target.localName !== 'img'){
			console.log(e.target.classList.contains('previous-nav*'));
			if(e.target.classList.contains('fa-search-plus')){
				e.target.parentElement.parentElement.style.width = '';
				e.target.parentElement.parentElement.style.height = '';
				e.target.parentElement.parentElement.removeAttribute('height');

				let zoomableImage = e.target.parentElement.parentElement.querySelector('img');
				zoomableImage.style.width = '';
				zoomableImage.style.height = '';
				zoomableImage.removeAttribute('height');

				if(zoomableImage.clientHeight < window.innerHeight){
					zoomableImage.height = window.innerHeight + 'px';
					zoomableImage.style.height = window.innerHeight + 'px';
					zoomableImage.style.top = 0;
					e.target.parentElement.parentElement.style.height = window.innerHeight + 'px';
				}

				if(zoomableImage.clientWidth > window.innerWidth){
					zoomableImage.width = (zoomableImage.clientWidth - (window.innerWidth * .20)) + 'px';
					zoomableImage.style.width = (window.innerWidth - (window.innerWidth * .20)) + 'px';
					e.target.parentElement.parentElement.style.width = (window.innerWidth - (window.innerWidth * .20)) + 'px';
				}
				zoomableImage.classList.remove('zoomable');
				e.target.classList.remove('fa-search-plus');
				e.target.classList.add('fa-search-minus');
			}
			else if(e.target.classList.contains('fa-search-minus')){
				let targetImage = e.target.parentElement.parentElement.querySelector('img');
				targetImage.style.width = '';
				targetImage.style.height = '';
				targetImage.scrollTop = 0;

				targetImage.setAttribute('style',  `height: ${window.innerHeight}px`);
				targetImage.setAttribute('height',  `${window.innerHeight}px`);
				// viewedImage.style.transform = `scale(1)`;
				
				targetImage.classList.add('zoomable');

				e.target.classList.add('fa-search-plus');
				e.target.classList.remove('fa-search-minus');
			}
			else {
				let pictureElement = (e.target.localName == 'picture')? e.target : ((e.target.localName == 'span')? e.target.parentElement.parentElement : e.target.parentElement);
				pictureElement = (pictureElement.localName == 'picture')? pictureElement : e.target.parentElement.querySelector('picture');
				
				let imageElement = pictureElement.querySelector('img');
				
				pictureElement.style.width = '';
				pictureElement.style.height = '';
				pictureElement.removeAttribute('width');
				pictureElement.removeAttribute('height');
				imageElement.style.width = '';
				imageElement.style.height = '';
				imageElement.removeAttribute('width');
				imageElement.removeAttribute('height');

				viewBox.classList.remove('view');
				document.querySelector('body').classList.remove('no-scroll');
				previewImage('hide');
			}
		}
		else if(e.target.localName == 'img'){
			e.target.style.width = '';
			e.target.style.height = '';
			let zoomElement = e.target.parentElement.querySelector('.preview-zoom i');

			if(!e.target.classList.contains('zoomable')){

				e.target.removeAttribute('style',  'transform');

				if(zoomElement.classList.contains('fa-search-plus')){
					zoomElement.classList.add('fa-search-minus');
					zoomElement.classList.remove('fa-search-plus');
				}
				else if(zoomElement.classList.contains('fa-search-minus')){
					zoomElement.classList.add('fa-search-plus');
					zoomElement.classList.remove('fa-search-minus');
				}
	
				if(!e.target.classList.contains('zoomable')){
					e.target.parentElement.style.height = '';
					e.target.parentElement.removeAttribute('height');
					e.target.classList.add('zoomable');

					e.target.parentElement.style.width = '';
					e.target.removeAttribute('width');
					e.target.style.width = '';
					e.target.parentElement.removeAttribute('width');
					e.target.parentElement.removeAttribute('style',  `width`);
					
					e.target.height = window.innerHeight + 'px';
					e.target.style.height = window.innerHeight + 'px';
					e.target.parentElement.style.height = window.innerHeight + 'px';
					e.target.parentElement.setAttribute('height',  `${window.innerHeight}px`);
				}
			}
			else {
				
				let zoomableImage = e.target;
				
				if(zoomElement.classList.contains('fa-search-plus')){
					zoomElement.classList.add('fa-search-minus');
					zoomElement.classList.remove('fa-search-plus');
				} 

				else if(zoomElement.classList.contains('fa-search-minus')){
					zoomElement.classList.add('fa-search-plus');
					zoomElement.classList.remove('fa-search-minus');
				}
				
				if(e.target.classList.contains('zoomable')){
					e.target.classList.remove('zoomable');

					e.target.style.transform = `scale(1)`;

					e.target.parentElement.setAttribute('width',  `${window.innerWidth}px`);
					e.target.parentElement.setAttribute('style',  `width: ${window.innerWidth}px`)
					
					e.target.parentElement.setAttribute('width',  `${window.innerWidth}px`);
					e.target.parentElement.setAttribute('style',  `width: ${window.innerWidth}px`);
				}
				else if(!e.target.classList.contains('zoomable')){
					e.target.parentElement.style.height = '';
					e.target.parentElement.removeAttribute('height');
					e.target.classList.add('zoomable');

					e.target.parentElement.style.width = '';
					e.target.removeAttribute('width');
					e.target.style.width = '';
					e.target.parentElement.removeAttribute('width');
					e.target.parentElement.removeAttribute('style',  `width`);
					
					e.target.height = window.innerHeight + 'px';
					e.target.style.height = window.innerHeight + 'px';
					e.target.parentElement.style.height = window.innerHeight + 'px';
					e.target.parentElement.setAttribute('height',  `${window.innerHeight}px`);
				}
			}
		}
	});
	
}


// Function for resizing and adjusting gallery images
let imgResize = function() {
  // Get main layout width
  let igLayoutWidth = document.querySelector(".ig-layout").clientWidth;

  // Calculate image width based on window size and scaling factor
  let widthPercent = (77.05 / 320);
  let makeWidth = (window.innerWidth <= 1528)
    ? Math.floor(igLayoutWidth * widthPercent)
    : Math.floor(window.innerWidth * widthPercent);

  // Set grid layout for gallery container
  gallery.style.gridTemplateColumns = `repeat(auto-fill, minmax(${makeWidth}px, 1fr))`;
  gallery.style.gridAutoRows = `${makeWidth}px`;

  // Iterate through each gallery image
  for (let i = 0; i < galleryImages.length; i++) {
    // Update video icons for gallery items (likely for visual consistency)
    let getItemType = galleryImages[i].parentElement.querySelector(".gallery-item-type");
    if (getItemType !== null && getItemType.querySelector("i.fa").classList.contains("fa-video")) {
      getItemType.querySelector("i.fa").classList.remove("fa-video");
      getItemType.querySelector("i.fa").classList.add("fa-video-camera");
    }

    // Resize and position images based on layout and dimensions
    let makeIndex = parseInt(i + 1);
    let parentWidth = galleryImages[i].parentElement.clientWidth;
    let parentHeight = galleryImages[i].parentElement.clientHeight;
    let parentLargeSize = (parentWidth < parentHeight) ? parentHeight : parentWidth;

    if (parentWidth > parentHeight) {
      galleryImages[i].style.width = `${parentWidth}px`;

      if (
        galleryImages[i].clientHeight > galleryImages[i].clientWidth &&
        galleryImages[i].clientHeight > parentLargeSize
      ) {
        galleryImages[i].style.transform = 'scale(1.1) translateY(15%)';

        // Apply special adjustments for specific images
        let avoidImageArr = [8, 10, 11, 12];
        if (avoidImageArr.indexOf(makeIndex) >= 1) {
          galleryImages[i].style.transform = 'translateY(0%)';
        }
      } else if (galleryImages[i].clientHeight <= parentWidth && galleryImages[i].clientHeight < parentLargeSize) {
        galleryImages[i].style.transform = 'scale(1.5)';
      }
    }
  }
};

// Call imgResize on window load and resize events
window.addEventListener("load", function() {
  imgResize();
});
window.addEventListener("resize", function() {
  imgResize();
});

let isGalleryTabs = function () {
	// Select gallery tabs and initialize variables for tab management
	let galleryTabs = document.querySelectorAll('.gallery-nav > a[role="tab"]');
	let tabIndex = 0;

	// Iterate through each gallery tab
	galleryTabs.forEach(function(a){ // used a as element for a tag
		a.tabIndex = (tabIndex + 1);
		tabIndex++;

		a.addEventListener("click", function(){
			window.event.preventDefault();
			
			let getAction = a.href.split('/').filter(function(nE){return nE != '';}).pop();
			let toggleAction = (getAction === 'reels')? 'video' :((getAction === 'tagged')? 'gallery' : 'all');

			if(getAction.length > 0) {
				galleryItems = document.querySelectorAll(".gallery-item");
				galleryItems.forEach(function(image){
					if(toggleAction == 'all'){
						image.style.display = '';
					}
					else {
						let galleryItemType = image.querySelector(".gallery-item-type");
						
						if(galleryItemType !== null){
							if(toggleAction == 'video'){
								let actionName = galleryItemType.querySelector("span").textContent.toLocaleLowerCase();
								if(actionName == 'video'){
									galleryItemType.parentElement.style.display = '';
								}
								else {
									galleryItemType.parentElement.style.display = 'none';
								}
							}
							else if(toggleAction == 'gallery'){
								let actionName = galleryItemType.querySelector("span").textContent.toLocaleLowerCase();
								if(actionName == 'gallery'){
									galleryItemType.parentElement.style.display = '';
								}
								else {
									galleryItemType.parentElement.style.display = 'none';
								}
							}
						}
						else {
							image.style.display = 'none';
						}
					}
				});
			}

			galleryTabs.forEach(function(tab){
				tab.classList.remove('active');
			});
			a.classList.add('active');
		});

		galleryTabs.forEach(function(tab){
			let isTabActive = tab.classList.contains('active');
			if(isTabActive){
				let getAction = tab.id.replace('-tab', '');
				let toggleAction = (getAction === 'reels')? 'video' :((getAction === 'tagged')? 'gallery' : 'all');

				if(getAction.length > 0) {
					galleryItems = document.querySelectorAll(".gallery-item");
					galleryItems.forEach(function(image){
						if(toggleAction == 'all'){
							image.style.display = '';
						}
						else {
							let galleryItemType = image.querySelector(".gallery-item-type");
							
							if(galleryItemType !== null){
								if(toggleAction == 'video'){
									let actionName = galleryItemType.querySelector("span").textContent.toLocaleLowerCase();
									if(actionName == 'video'){
										galleryItemType.parentElement.style.display = '';
									}
									else {
										galleryItemType.parentElement.style.display = 'none';
									}
								}
								else if(toggleAction == 'gallery'){
									let actionName = galleryItemType.querySelector("span").textContent.toLocaleLowerCase();
									if(actionName == 'gallery'){
										galleryItemType.parentElement.style.display = '';
									}
									else {
										galleryItemType.parentElement.style.display = 'none';
									}
								}
							}
							else {
								image.style.display = 'none';
							}
						}
					});
				}
			}
		});
	});
}
isGalleryTabs();


let galleryItemInfo = document.querySelectorAll(".gallery-item-info");

galleryItemInfo.forEach(function(infoDiv){
	
	infoDiv.addEventListener("click", function(e){ // e for event
		let eParent = e.target.parentElement;
		let eSpan = eParent.querySelector('span').textContent;
		let eNum = parseInt(eParent.innerText);
		let eClass = (eSpan.toLocaleLowerCase() == 'likes:')? 'liked' : ((eSpan.toLocaleLowerCase() == 'comments:')? 'comment' : '');
		
		if(e.target.classList.contains('gallery-item-info')){ return;}
		
		eParent.classList.toggle(eClass);

		if(eParent.classList.contains(eClass)){
			let newTC = eParent.innerHTML.replace(eNum, (eNum + 1));
			if(eClass == 'comment'){
				if(confirm("Do you want to comment?")){
					eParent.innerHTML = newTC;
				}
			}
			else {
				eParent.innerHTML = newTC;
			}
		} else {
			if(eClass == 'comment'){
				if(confirm("Do you want to comment?")){
					let newTC = eParent.innerHTML.replace(eNum, (eNum + 1));
					eParent.innerHTML = newTC;
				}
			}
			let newTC = eParent.innerHTML.replace(eNum, (eNum - 1));
			eParent.innerHTML = newTC;
		}
	});
});

// Add click events to gallery items
galleryItems.forEach(function(gi) {
	gi.addEventListener('click', function(e) {
		if (e.target.classList.contains('gallery-item-info')) {
		viewImageHref = e.target.parentElement.querySelector('img').src;
		viewImageOverlay(true); // Open image overlay
		}
	});
});


let active = false; // Flag to prevent multiple calls

// Function for loading more images on scroll
let loadingImages = function(){
	"use strict";
	
	let scrollTop = window.innerHeight * 0.99; // Scroll position near bottom
	let loader = document.querySelector(".loader");

	let top = Math.floor(document.querySelector(".loader").offsetTop) - 80; // Accurate loader position

	if (Math.floor(window.scrollY) > top) { // If scrolled near loader
		if (active !== true) { // If not already loading
		  active = true;
	
		  // Convert galleryItems to an array
		  const galleryItems = Array.from(document.querySelectorAll(".gallery > .gallery-item"));
	
		  loader.classList.add('loading'); // Show loading indicator
		  loader.setAttribute('style', 'opacity: 1;');
	
		  let lastIndex = galleryItems.length; // Index for new items
		  const otherItems = [];
	
		  setTimeout(() => { // Simulate loading delay
			for (let i = 0; i < 12; i++) { // Create 12 new items
			  const imgItem = document.createElement('imgItem');
			  const item = galleryItems[i];
			  lastIndex++;
	
			  imgItem.className = item.className; // Assign classes
			  imgItem.tabIndex = lastIndex; // Set tabindex for accessibility
			  imgItem.innerHTML = item.innerHTML; // Copy content
			  otherItems.push(imgItem); // Add to collection
			}
	
			const gallery = document.querySelector(".gallery"); // Access gallery element
			otherItems.forEach(e => gallery.appendChild(e)); // Append new items
			
			loader.removeAttribute('style', 'opacity: 0;');
			loader.classList.remove('loading'); // Hide loading indicator
			isGalleryTabs();
		  }, 3000); // 3-second delay
		}
	} else {
	loader.removeAttribute('style', 'opacity: 0;');
	loader.classList.remove('loading'); // Hide loader if scrolled up
	}

	viewImageOverlay();
}

window.addEventListener('scroll', function() {
	"use strict"; // Enforce strict JavaScript mode for error prevention
  
	// Get the offset position of the "loader" element, adjusted for a 80px buffer
	let top = Math.floor(document.querySelector(".loader").offsetTop) - 80;
  
	// If the current scroll position is past the top threshold:
	if (Math.floor(window.scrollY) > top) {
	  // Trigger image loading
	  loadingImages();
	}
	else{
		active = false;
	}
	isGalleryTabs();
	imageOverlay();
  });
  
