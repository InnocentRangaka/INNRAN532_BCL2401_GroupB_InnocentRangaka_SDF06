
const body = document.querySelector("body");

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

let showPreviewImage = function(galleryImages,viewBox) {
	let viewedImage = viewBox.querySelector("picture img");

	galleryImages.forEach(function(img){
		img.removeAttribute('zoomable');
	});

	viewBox.classList.add('view');
	body.classList.add('no-scroll');

	viewBox.querySelector("picture").scrollTop = 0;
	viewedImage.src = viewImageHref;
	viewedImage.setAttribute('data-index', viewImageTabIndex);
	
	viewBox.querySelector("picture").setAttribute('style',  `height: ${window.innerHeight}px`);
	viewedImage.setAttribute('height',  `${window.innerHeight}px`);
	viewedImage.style.transform = `scale(1)`;
	viewedImage.removeAttribute('width');
	viewedImage.removeAttribute('style', 'width');
	
	viewedImage.classList.add('zoomable');
	viewedImage.addEventListener('click', function(e){
		e.target.style.width = '';
		e.target.style.height = '';
		e.target.removeAttribute('height');
	});

	if(viewedImage.parentElement.querySelector('.preview-zoom i').classList.contains('fa-search-minus')){
		viewedImage.parentElement.querySelector('.preview-zoom i').classList.add('fa-search-plus');
		viewedImage.parentElement.querySelector('.preview-zoom i').classList.remove('fa-search-minus');
	}
}
let hidePreviewImage = function(galleryImages,viewBox) {
	let viewedImage = viewBox.querySelector("picture img");

	viewBox.classList.remove('view');
	body.classList.remove('no-scroll');

	viewedImage.src = '';
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

// Function to manage the view image overlay
let viewImageOverlay = function(state='') {
	let galleryImages = document.querySelectorAll(".gallery > div > .gallery-image");
	let viewBox = document.querySelector(".view-box");

	if((viewBox.classList.contains('view') || state == true) || (state == 'add' || state == 'show')){
		showPreviewImage(galleryImages,viewBox);
	}
	if((!viewBox.classList.contains('view') || state == false) || (state == 'remove' || state == 'delete')){
		hidePreviewImage(galleryImages,viewBox);
	}

	let targetEl;
	let targetElType;
	let targetElClasses;
	let targetElParent;
	let targetElParents;
	let zoomableImage;
	let zoomableImageHeight;
	let zoomableImageWidth;
	let zoomElement;
	const windowHeight = window.innerHeight;
	const windowWidth = window.innerWidth;

	let zoomImage = function(e, action=''){
		targetEl = e.target;
		targetElType = e.target.localName;
		targetElClasses = e.target.classList;
		targetElParent = e.target.parentElement;
		
		if(targetElType !== 'img'){
			targetElParents = e.target.parentElement.parentElement;
			zoomableImage = targetElParents.querySelector('img');
			zoomableImageHeight = zoomableImage.clientHeight;
			zoomableImageWidth = zoomableImage.clientWidth;
		}

		if(targetElType == 'img'){
			targetElParents = e.target.parentElement;
			zoomableImage = targetElParents.querySelector('img');
			zoomableImageHeight = windowHeight;
			zoomableImageWidth = '';
		}

		zoomElement = targetElParent.querySelector('.preview-zoom i');

		let isZoomIn = targetElClasses.contains('fa-search-plus');
		const isZoomOut = targetElClasses.contains('fa-search-minus');
		const zoomAction = action.toLocaleLowerCase();
		let isZoomable = (targetElClasses.contains('zoomable'))? true : false;

		let zoomIn = function(){
			targetElParents.style.width = '';
			targetElParents.style.height = '';
			targetElParents.removeAttribute('style','height');
			targetElParents.removeAttribute('height');
			viewBox.querySelector("picture").removeAttribute('style',  `height`);
			viewBox.querySelector("picture").removeAttribute('style',  `width`);

			zoomableImage.style.width = '';
			zoomableImage.style.height = '';
			zoomableImage.removeAttribute('height');

			if(zoomableImageHeight > windowHeight){
				zoomableImage.height = windowHeight + 'px';
				zoomableImage.style.height = windowHeight + 'px';
				zoomableImage.style.top = 0;
				// targetElParents.style.height = windowHeight + 'px';
				// targetElParents.width = windowWidth + 'px';
			}
			else if(zoomableImageWidth <= windowWidth){
				zoomableImage.width = (zoomableImageWidth - (windowWidth * .20)) + 'px';
				zoomableImage.style.width = (windowWidth - (windowWidth * .20)) + 'px';
				// targetElParents.style.width = (windowWidth - (windowWidth * .20)) + 'px';
			}

			zoomableImage.classList.remove('zoomable');

			if(zoomElement.classList.contains('fa-search-plus')){
				zoomElement.classList.add('fa-search-minus');
				zoomElement.classList.remove('fa-search-plus');
			}
		}
		let zoomOut = function(){
			targetElParents.style.width = '';
			targetElParents.style.height = '';
			targetElParents.removeAttribute('width');

			zoomableImage.style.width = '';
			zoomableImage.style.height = '';
			zoomableImage.removeAttribute('width');
			zoomableImage.scrollTop = 0;

			if(zoomableImageHeight >= windowHeight){
				zoomableImage.height = windowHeight + 'px';
				zoomableImage.style.height = windowHeight + 'px';
				zoomableImage.style.top = 0;
				targetElParents.style.height = windowHeight + 'px';
			}

			else if(zoomableImageWidth <= windowWidth){
				zoomableImage.width = (zoomableImageWidth - (windowWidth * .20)) + 'px';
				zoomableImage.style.width = (windowWidth - (windowWidth * .20)) + 'px';
				targetElParents.style.width = (windowWidth - (windowWidth * .20)) + 'px';
			}

			zoomableImage.classList.add('zoomable');

			if(zoomElement.classList.contains('fa-search-minus')){
				zoomElement.classList.add('fa-search-plus');
				zoomElement.classList.remove('fa-search-minus');
			}
		}


		if(isZoomIn && zoomAction == 'in'){
			zoomIn();
		}
		if(isZoomOut && zoomAction == 'out'){
			zoomOut();
		}
		if(isZoomable && zoomAction == 'in' && targetElType == 'img'){
			targetElClasses.remove('zoomable');
			zoomIn();
		}
		if(!isZoomable && zoomAction == 'out' && targetElType == 'img'){
			targetElClasses.add('zoomable');
			zoomOut();
		}
	}
	
	viewBox.addEventListener('click', function(e){
		targetEl = e.target;
		targetElType = e.target.localName;
		targetElClasses = e.target.classList;
		targetElParent = e.target.parentElement;
		targetElParents = e.target.parentElement.parentElement;

		if(targetElType !== 'img'){
			const zoomAction = (e.target.classList.contains('fa-search-plus'))? 'in' : ((e.target.classList.contains('fa-search-minus'))? 'out' : 'none');
			
			if(zoomAction !== 'none'){zoomImage(e, zoomAction);}
			if(zoomAction == 'none') {
				
				let galleryItems = document.querySelectorAll('.gallery > .gallery-item');
				let pictureElement = (targetElType == 'picture')? targetEl : 
										((targetElType == 'span')? targetElParents : targetElParent);
				pictureElement = (pictureElement.localName == 'picture')? pictureElement : 
									((targetElType == 'i' && targetEl.classList.contains('fa'))? targetElParents.parentElement : targetElParent.querySelector('picture'));
				
				let imageElement = pictureElement.querySelector('img');
				let isPreviousClick = targetElParent.classList.contains('previous');
				let isNextClick= targetElParent.classList.contains('next');
				let isCancelPreview = targetElParent.classList.contains('cancel-preview');
				
				if(isPreviousClick || isNextClick){
					let targetIndex = document.querySelector(".view-box").querySelector('img').getAttribute('data-index');
					let goBy = (isNextClick)? 1 : -1;
					let newTargetIndex = parseInt(targetIndex) + goBy;
					let newTarget = document.querySelector(`.gallery > .gallery-item[tabindex="${newTargetIndex}"]`);
					if(newTarget !== null){
						newTargetSrc = newTarget.querySelector('img').src;
						
						let viewedImage = viewBox.querySelector("picture img");
						document.querySelectorAll('.gallery > .gallery-item > img').forEach(function(img){
							img.removeAttribute('zoomable');
						});

						viewBox.querySelector("picture").scrollTop = 0;
						viewedImage.src = newTargetSrc;
						viewedImage.setAttribute('data-index', newTargetIndex);
						
						viewBox.querySelector("picture").setAttribute('style',  `height: ${window.innerHeight}px`);
						viewedImage.setAttribute('height',  `${window.innerHeight}px`);
						
						viewedImage.classList.add('zoomable');
						viewedImage.addEventListener('click', function(e){
							viewedImage.style.width = '';
							viewedImage.removeAttribute('width');
						});
					}
				}
				else if(isCancelPreview){
					let galleryImages = document.querySelectorAll(".gallery > div > .gallery-image");
					let viewBox = document.querySelector(".view-box");
					hidePreviewImage(galleryImages,viewBox);
				}
				else{return;}
			}
		}
		else if(targetElType == 'img'){
			// e.target.style.width = '';
			// e.target.style.height = '';
			// let zoomElement = e.target.parentElement.querySelector('.preview-zoom i');

			
			let isZoomable = (targetElClasses.contains('zoomable'))? true : false;

			if(isZoomable){
				zoomImage(e, 'in');
			}
			else {
				zoomImage(e, 'out');
			}
		}
	});
	
}


// Function for resizing and adjusting gallery images
let imgResize = function() {
  // Get main layout width
  let igLayoutWidth = document.querySelector(".ig-layout").clientWidth;

  // Calculate image width based on window size and scaling factor
  let widthPercent = (77.05 / 445);
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
		viewImageTabIndex = e.target.parentElement.tabIndex;
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

	if (active !== true) { // If not already loading
		active = true;
  
		// Convert galleryItems to an array
		const galleryItems = Array.from(document.querySelectorAll(".gallery > .gallery-item"));
  
		loader.classList.add('loading'); // Show loading indicator
  
		let lastIndex = galleryItems.length; // Index for new items
		const otherItems = [];
  
		setTimeout(() => { // Simulate loading delay
		  for (let i = 0; i < 12; i++) { // Create 12 new items
			const imgItem = document.createElement('div');
			const item = galleryItems[i];
			lastIndex++;
  
			imgItem.className = item.className; // Assign classes
			imgItem.tabIndex = lastIndex; // Set tabindex for accessibility
			imgItem.innerHTML = item.innerHTML; // Copy content
			otherItems.push(imgItem); // Add to collection
		  }
  
		  const gallery = document.querySelector(".gallery"); // Access gallery element
		  otherItems.forEach(e => gallery.appendChild(e)); // Append new items
		  
		  loader.classList.remove('loading'); // Hide loading indicator
		  isGalleryTabs();
		}, 3000); // 3-second delay
	  }

	viewImageOverlay();
}

window.addEventListener('scroll', function() {
	"use strict"; // Enforce strict JavaScript mode for error prevention
  
	// Get the offset position of the "loader" element, adjusted for a 80px buffer
	let top = `${Math.floor((document.querySelector(".loader").offsetTop) - Math.floor(document.querySelector(".loader").offsetTop * (1 - .35)))}`;
	let loader = document.querySelector(".loader");

	// If the current scroll position is past the top threshold:
	if (Math.floor(window.scrollY) >= top) {
	  // Trigger image loading
	  loadingImages();
	}
	else{
		active = false;
		loader.classList.remove('loading'); // Hide loader if scrolled up
	}
	isGalleryTabs();
	imageOverlay();
  });
  
