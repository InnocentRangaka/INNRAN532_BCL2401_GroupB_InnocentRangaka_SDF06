let gallery = document.querySelectorAll(".gallery")[0];
let galleryItems = document.querySelectorAll(".gallery-item");
let galleryImages = document.querySelectorAll(".gallery > div > .gallery-image");
let galleryImage = document.querySelector(".gallery-image");

let numberTabIndex = function(elementsArray){
    let i = 1;
    if(elementsArray.tabIndex == undefined || elementsArray.tabIndex == null){
        elementsArray.forEach(function(element){
            element.tabIndex = i;
            i++;
		});
	}
}

numberTabIndex(galleryItems);

let imgResize = function() {

    let igLayoutWidth = document.querySelector(".ig-layout").clientWidth;
    let widthPercent = (77.05 / 320);
    let makeWidth = (window.innerWidth <= 1528)? Math.floor(igLayoutWidth * widthPercent) : Math.floor(window.innerWidth * widthPercent);
    gallery.style.gridTemplateColumns = `repeat( auto-fill, minmax(${makeWidth}px, 1fr) )`;
    gallery.style.gridAutoRows = `${makeWidth}px`;
    
    for (let i = 0; i < galleryImages.length; i++) {

		let getItemType = galleryImages[i].parentElement.querySelector(".gallery-item-type");
		
		if(getItemType !== null && getItemType.querySelector("i.fa").classList.contains("fa-video")){
			getItemType.querySelector("i.fa").classList.remove("fa-video");
			getItemType.querySelector("i.fa").classList.add("fa-video-camera")
		}

        let makeIndex = parseInt(i + 1);
        let parentWidth = galleryImages[i].parentElement.clientWidth;
        let parentHeight = galleryImages[i].parentElement.clientHeight;
        let parentLargeSize = (parentWidth < parentHeight)? parentHeight : parentWidth
        
        if(parentWidth > parentHeight){

            galleryImages[i].style.width = `${parentWidth}px`;

            if(galleryImages[i].clientHeight > galleryImages[i].clientWidth && galleryImages[i].clientHeight > parentLargeSize){
                galleryImages[i].style.transform = 'scale(1.1)';
				galleryImages[i].style.transform = 'translateY(15%)';

                let avoidImageArr = [8, 10, 11, 12];
                if(avoidImageArr.indexOf(makeIndex) >= 1){
                    galleryImages[i].style.transform = 'translateY(0%)';
                }
            }

            if(galleryImages[i].clientHeight <= parentWidth && galleryImages[i].clientHeight < parentLargeSize){
                galleryImages[i].style.transform = 'scale(1.5)';
            }
        }
    }
}

window.addEventListener("load", function(){
    imgResize();
});

window.addEventListener("resize", function(){
    imgResize();
});


let galleryTabs = document.querySelectorAll('.gallery-nav > a[role="tab"]');
let tabIndex = 0;
let postsIndexes = [];
let reelsIndexes = [];
let taggedIndexes = [];

galleryTabs.forEach(function(a){ // used a as element for a tag
	a.tabIndex = (tabIndex + 1);
	tabIndex++;

    a.addEventListener("click", function(){
		window.event.preventDefault();
		let getAction = a.href.split('/').filter(function(nE){return nE != '';}).pop();
        let toggleAction = (getAction === 'reels')? 'video' :((getAction === 'tagged')? 'gallery' : 'all');

        if(getAction.length > 0) {
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
			tab.classList.remove('active')
		});

		a.classList.add('active');
    });
});

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

let getGalleryItemInfo

let viewImageHref;
let viewBox = document.querySelector(".view-box");
if(viewBox !== undefined && viewBox !== null){
	if(viewBox.classList.contains('view')){
		viewBox.addEventListener('click', function(e){
			viewImageOverlay(false);
		});
	}
}

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
				else {
					console.log('2');
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

					// e.target.parentElement.style.width = (window.innerWidth * .50) + 'px';
					// e.target.parentElement.setAttribute('width',  `${(window.innerWidth * .50)}px`);
					// e.target.setAttribute('width',  `${(window.innerWidth * .50)}px`);
					// e.target.style.width = (window.innerWidth * .50) + 'px';
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



galleryItems.forEach(function(gi){
	gi.addEventListener('click', function(e){
		if(e.target.classList.contains('gallery-item-info')){
			viewImageHref = e.target.parentElement.querySelector('img').src;
			viewImageOverlay(true);
		}
	});
});


let loadingImages = function(){
	"use strict";
	
	let scrollTop = window.innerHeight * 0.99;
	let loader = document.querySelector(".loader");
	let active = false;
  
	let loaderTop = loader.getBoundingClientRect().top + window.pageYOffset; // Get correct loader position
  
	if (Math.floor(window.scrollY) >= Math.floor(loaderTop)) {
	  if (!active) {
		active = true;
  
		// Ensure galleryItems is an array
		const galleryItems = Array.from(document.querySelectorAll(".gallery > .gallery-item"));
  
		loader.classList.add('loading');
		loader.style.display = 'block';
  
		let lastIndex = galleryItems.length;
		const otherItems = [];
  
		setTimeout(() => {
		  for (let i = 0; i < 12; i++) { // Loop 12 times instead of 13
			const imgItem = document.createElement('imgItem');
			const item = galleryItems[i];
			lastIndex++;
  
			imgItem.className = item.className; // Use className for class assignment
			imgItem.tabIndex = lastIndex;
			imgItem.innerHTML = item.innerHTML;
			otherItems.push(imgItem);
		  }
  
		  const gallery = document.querySelector(".gallery"); // Get gallery element inside loop
		  otherItems.forEach(e => gallery.appendChild(e));
  
		  loader.classList.remove('loading');
		  loader.style.display = 'none';
  
		  active = false;
		}, 3000); // Delay in milliseconds
	  }
	} else {
	  loader.classList.remove('loading');
	  loader.style.display = 'none'; // Hide loader consistently
	}
}

window.addEventListener('scroll', function() {
	"use strict";

	loadingImages();
  });
