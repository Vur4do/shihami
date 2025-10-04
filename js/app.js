// image background------------------------------------
function ibg() {

	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}

ibg();
// ---------------------------------------------------


// adding header height offset top to first block ===============
const headerHeightOffsetTopBlocks = document.querySelectorAll('.header-height-offset-top');
const header = document.querySelector('.header');

document.addEventListener('DOMContentLoaded', function () {
	if (headerHeightOffsetTopBlocks.length > 0) {
		headerHeightOffsetTopBlocks.forEach(item => {
			item.style.marginTop = header.offsetHeight + 'px';
		});
	}
});
// ===============================================================


// header menu ============================================
const headerMenuIcon = document.querySelector('.header-menu__icon');
const headerMenuBody = document.querySelector('.header-menu__body');
const body = document.body;
const wrapper = document.querySelector('.wrapper');
const menuElements = headerMenuBody.querySelectorAll('a');

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const isTablet = window.matchMedia("(max-width: 992px)").matches;

// Set inert for menu elements when menu is closed
if (isTablet) {
	menuElements.forEach(element => {
		element.inert = true;
	});
}

function toggleInert(isMenuOpen) {
	// We find all the items that can get focus
	const allFocusableElements = document.querySelectorAll(
		'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
	);

	if (isMenuOpen) {
		allFocusableElements.forEach(element => {
			// If the item is not inside the menu - blocking
			if (!header.contains(element)) {
				element.inert = true;
			} else {
				element.inert = false;
			}
			headerMenuIcon.inert = false;
		});

		setTimeout(() => {
			menuElements[0]?.focus();
		}, 100);
	} else {
		// We unlock everything
		allFocusableElements.forEach(element => {
			element.inert = false;
		});

		// We block the menu on mobile
		if (window.matchMedia("(max-width: 768px)").matches) {
			menuElements.forEach(element => {
				element.inert = true;
			});
		}
	}
}

headerMenuIcon.addEventListener('click', () => {
	const isExpanded = headerMenuIcon.getAttribute('aria-expanded') === 'true';
	const willBeExpanded = !isExpanded;

	headerMenuIcon.classList.toggle('active');
	headerMenuBody.classList.toggle('active');
	body.classList.toggle('locked');

	headerMenuIcon.setAttribute('aria-expanded', String(!isExpanded));

	// Apply the inert attribute according to menu status
	toggleInert(willBeExpanded);
});

// Track the Escape key to close the menu
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && headerMenuBody.classList.contains('active')) {
		headerMenuIcon.classList.toggle('active');
		headerMenuBody.classList.toggle('active');
		body.classList.toggle('locked');
		headerMenuIcon.setAttribute('aria-expanded', 'false');

		toggleInert(false);
		headerMenuIcon.focus(); // Turn the focus on the menu button
	}
});
// ===============================================================


// header menu navigation ========================================
document.addEventListener("DOMContentLoaded", () => {
	const links = document.querySelectorAll('a[href^="#"]'); // всі посилання, що ведуть на #id
	const isHome = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname === "/my-project/";

	links.forEach(link => {
		link.addEventListener("click", e => {
			e.preventDefault();
			const targetId = link.getAttribute("href").substring(1); // типу "contacts"

			if (!isHome) {
				// редірект на index.html з якірцем
				window.location.href = "index.html" + "#" + targetId;
			}

			const targetElement = document.getElementById(targetId);
			const elementPosition = targetElement.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.scrollY;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});

			if (isTablet) {
				const isExpanded = headerMenuIcon.getAttribute('aria-expanded') === 'true';
				const willBeExpanded = !isExpanded;

				headerMenuIcon.classList.toggle('active');
				headerMenuBody.classList.toggle('active');
				body.classList.toggle('locked');

				headerMenuIcon.setAttribute('aria-expanded', String(!isExpanded));

				toggleInert(willBeExpanded);
			}

			// Додайте це після scrollTo
			setTimeout(() => {
				if (!targetElement.hasAttribute('tabindex')) {
					targetElement.setAttribute('tabindex', '-1');
				}
				targetElement.focus();
			}, 700); // Чекаємо завершення smooth scroll
		});
	});
});
// ===============================================================


// header on scroll ==============================================
function handleScroll() {
	// We get the position of the top of the screen relative to the document
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	// We check the condition: whether the upper part of the screen of half of the first block reached
	if (scrollTop >= 20) {
		header.classList.add('smaller-paddings');
	} else {
		header.classList.remove('smaller-paddings');
	}
}

document.addEventListener('DOMContentLoaded', function () {
	// Check whether there are items
	if (header) {
		// A function to handle the clamp
		handleScroll();

		// ДWe seize a handicraft hand -made with optimization (Throttling)
		let ticking = false;

		// We listen to the events of the scroll
		window.addEventListener('scroll', () => {
			if (!ticking) {
				requestAnimationFrame(function () {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		});

		// We call the function right to initial verification
		handleScroll();
	}
});
// ==============================================================



// Dynamic Adapt 
// HTML data-da="where(uniq class name),when(breakpoint),position(digi),type (min, max)"
// e.x. data-da="item,767,last,max"

class DynamicAdapt {
	// масив об'єктів
	elementsArray = [];
	daClassname = '_dynamic_adapt_';

	constructor(type) {
		this.type = type;
	}

	init() {
		// масив DOM-елементів
		this.elements = [...document.querySelectorAll('[data-da]')];

		// наповнення elementsArray об'єктами
		this.elements.forEach((element) => {
			const data = element.dataset.da.trim();
			if (data !== '') {
				const dataArray = data.split(',');

				const oElement = {};
				oElement.element = element;
				oElement.parent = element.parentNode;
				oElement.destination = document.querySelector(`.${dataArray[0].trim()}`);
				oElement.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
				oElement.place = dataArray[2] ? dataArray[2].trim() : 'last';
				oElement.type = dataArray[3] ? dataArray[3].trim() : this.type;

				// Зберігаємо початковий індекс та створюємо маркер для позиції
				oElement.originalIndex = this.indexInParent(oElement.parent, oElement.element);
				oElement.placeholder = this.createPlaceholder(element);

				this.elementsArray.push(oElement);
			}
		});

		this.arraySort(this.elementsArray);

		// масив унікальних медіа-запитів
		this.mediaArray = [];
		this.elementsArray.forEach(({ breakpoint, type }) => {
			const mediaQuery = `(${type}-width: ${breakpoint}px)`;
			const mediaString = `${mediaQuery},${breakpoint},${type}`;

			if (!this.mediaArray.some(item => item === mediaString)) {
				this.mediaArray.push(mediaString);
			}
		});

		// задання відслідковування медіа запиту
		// і виклик обробника при першому запуску
		this.mediaArray.forEach((media) => {
			const mediaSplit = media.split(',');
			const mediaQuerie = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];
			const mediaType = mediaSplit[2];

			// масив об'єктів з підходящим брейкпоінтом та типом
			const elementsFilter = this.elementsArray.filter(
				({ breakpoint, type }) => breakpoint === mediaBreakpoint && type === mediaType
			);

			mediaQuerie.addEventListener('change', () => {
				this.mediaHandler(mediaQuerie, elementsFilter);
			});
			this.mediaHandler(mediaQuerie, elementsFilter);
		});
	}

	// Створення placeholder для збереження позиції
	createPlaceholder(element) {
		const placeholder = document.createElement('div');
		placeholder.style.display = 'none';
		placeholder.classList.add(`${this.daClassname}placeholder`);
		placeholder.setAttribute('data-da-placeholder', 'true');
		element.parentNode.insertBefore(placeholder, element);
		return placeholder;
	}

	// Основна функція
	mediaHandler(mediaQuerie, elementsFilter) {
		if (mediaQuerie.matches) {
			elementsFilter.forEach((oElement) => {
				if (!oElement.element.classList.contains(this.daClassname)) {
					this.moveTo(oElement.place, oElement.element, oElement.destination);
				}
			});
		} else {
			elementsFilter.forEach((oElement) => {
				if (oElement.element.classList.contains(this.daClassname)) {
					this.moveBack(oElement);
				}
			});
		}
	}

	// Функція переміщення
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname);

		if (place === 'last' || place >= destination.children.length) {
			destination.append(element);
			return;
		}
		if (place === 'first') {
			destination.prepend(element);
			return;
		}

		// Перевірка чи place є числом
		const numericPlace = parseInt(place);
		if (!isNaN(numericPlace) && destination.children[numericPlace]) {
			destination.children[numericPlace].before(element);
		} else {
			destination.append(element);
		}
	}

	// Функція повернення
	moveBack(oElement) {
		const { element, placeholder } = oElement;

		element.classList.remove(this.daClassname);

		// Повертаємо елемент на місце placeholder
		if (placeholder && placeholder.parentNode) {
			placeholder.parentNode.insertBefore(element, placeholder);
		} else {
			// Fallback: повертаємо в початкового батька
			oElement.parent.appendChild(element);
		}
	}

	// Функція отримання індексу всередині батьківського елемента
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}

	// Функція сортування масиву за breakpoint та place
	arraySort(arr) {
		if (this.type === 'min') {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return -1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return 1;
					}
					return parseInt(a.place) - parseInt(b.place);
				}
				return parseInt(a.breakpoint) - parseInt(b.breakpoint);
			});
		} else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return 1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return -1;
					}
					return parseInt(b.place) - parseInt(a.place);
				}
				return parseInt(b.breakpoint) - parseInt(a.breakpoint);
			});
		}
	}

	// Метод для очистки placeholder'ів (опціонально)
	destroy() {
		// Повертаємо всі елементи на початкові місця
		this.elementsArray.forEach((oElement) => {
			if (oElement.element.classList.contains(this.daClassname)) {
				this.moveBack(oElement);
			}
			// Видаляємо placeholder
			if (oElement.placeholder && oElement.placeholder.parentNode) {
				oElement.placeholder.parentNode.removeChild(oElement.placeholder);
			}
		});

		// Очищуємо масиви
		this.elementsArray = [];
		this.mediaArray = [];
	}
}

// Ініціалізація
const da = new DynamicAdapt('max');
da.init();
//================================================================



// back to top button =================================
const backToTopBtn = document.getElementById("backToTopBtn");

if (backToTopBtn) {
	// показуємо кнопку після скролу вниз
	window.addEventListener("scroll", () => {
		if (window.scrollY > 300) {
			backToTopBtn.classList.add('visible');
		} else {
			backToTopBtn.classList.remove('visible');
		}
	});

	// A smooth cliff upwards
	backToTopBtn.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	});
}
// ========================================================


// collection slider ======================================
if (document.querySelector('.collection__slider')) {
	const collectionSlider = new Swiper('.collection__slider', {
		effect: "coverflow",
		grabCursor: true,
		centeredSlides: true,
		loop: true,
		slidesPerView: 'auto',
		speed: 800,
		touchRatio: 1,
		touchAngle: 45,
		keyboard: false,
		coverflowEffect: {
			rotate: 0,
			stretch: 0,
			depth: 110,
			modifier: 3.5,
		},
		autoplay: {
			delay: 2000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		breakpoints: {
			0: {
				coverflowEffect: {
					depth: 300,
				},
				autoplay: {
					disableOnInteraction: true,
				},
				speed: 600,
			},
			425: {
				coverflowEffect: {
					depth: 250,
				},
			},
			500: {
				coverflowEffect: {
					depth: 150,
					modifier: 3.5,
				},
				autoplay: {
					disableOnInteraction: false,
				},
			},
			768: {
				coverflowEffect: {
					depth: 110,
				},
			},
		},
		on: {
			init: function () {
				// Викликаємо після повної ініціалізації
				setTimeout(() => {
					updateVisibleSlides(this);
				}, 100);
				updateSlidesTabindex(this);
				setupKeyboardNavigation(this);
			},
			slideChange: function () {
				// Додаємо затримку для стабілізації позицій
				setTimeout(() => {
					updateVisibleSlides(this);
				}, 50);
				updateSlidesTabindex(this);
			},
			slideChangeTransitionEnd: function () {
				// Додатковий виклик після завершення анімації
				updateVisibleSlides(this);
			},
			touchEnd: function () {
				// Оновлення після завершення свайпу
				setTimeout(() => {
					updateVisibleSlides(this);
				}, 100);
			},
		},
	});

	// Початкове оновлення
	setTimeout(() => {
		updateVisibleSlides(collectionSlider);
	}, 100);
}

function setupKeyboardNavigation(swiper) {
	const swiperContainer = swiper.el;

	swiperContainer.addEventListener('keydown', (e) => {
		// Перевіряємо, чи фокус на посиланні всередині слайдера
		if (!swiperContainer.contains(document.activeElement)) return;

		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			swiper.slidePrev();
			const activeSlide = swiper.slides[swiper.activeIndex];
			const link = activeSlide?.querySelector('a');
			link.focus();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			swiper.slideNext();
			const activeSlide = swiper.slides[swiper.activeIndex];
			const link = activeSlide?.querySelector('a');
			link.focus();
		}
	});
}

function updateSlidesTabindex(swiper) {
	swiper.slides.forEach((slide, index) => {
		const link = slide.querySelector('.collection__item-link');
		if (link) {
			link.tabIndex = index === swiper.activeIndex ? 0 : -1;
		}
	});
}

function updateVisibleSlides(swiper) {
	if (!swiper || !swiper.slides) return;

	const slides = swiper.slides;
	const activeIndex = swiper.activeIndex;
	// const visibleRange = window.matchMedia("(max-width: 425px)").matches ? 1 : 3;
	const visibleRange = 3;

	slides.forEach((slide, index) => {
		slide.classList.remove('visible');

		// Check whether the slide is in the active area
		if (slide.classList.contains('swiper-slide-active') ||
			slide.classList.contains('swiper-slide-prev') ||
			slide.classList.contains('swiper-slide-next')) {
			slide.classList.add('visible');
		}

		// Additional check for adjacent slides on large screens
		if (visibleRange > 1) {
			const distance = Math.abs(index - activeIndex);
			if (distance <= visibleRange && distance > 0) {
				// Check whether slide is not a duplicate loop
				if (!slide.classList.contains('swiper-slide-duplicate')) {
					slide.classList.add('visible');
				}
			}
		}
	});
}
//====================================================


// adding like to nft card ==============================
const likesBtns = document.querySelectorAll('.nft-card__likes');

if (likesBtns.length > 0) {
	likesBtns.forEach(btn => {
		btn.addEventListener('click', function () {
			this.classList.toggle('liked');
		});
	});
}
//====================================================


// form selects ======================================
const dropdowns = document.querySelectorAll('.form-select');

if (dropdowns.length > 0) {
	dropdowns.forEach(dropdown => {
		const dropdownBtn = dropdown.querySelector('.form-select__button');
		const dropdownList = dropdown.querySelector(".form-select__list");
		const dropdownListItems = dropdownList.querySelectorAll(".form-select__list-item");
		const dropdownInput = dropdown.querySelector(".form-select__input-hidden");

		let currentFocusIndex = -1;

		dropdownBtn.addEventListener('click', function () {
			dropdownList.classList.toggle('form-select__list--visible');
			this.classList.add('form-select__button--active');

			// Скидаємо фокус при відкритті
			if (dropdownList.classList.contains('form-select__list--visible')) {
				currentFocusIndex = -1;
				removeAllFocus();
			}
		});

		dropdownListItems.forEach((item, index) => {
			if (item.classList.contains('form-select__list-item--selected')) {
				dropdownBtn.innerText = item.innerHTML;
				dropdownInput.value = item.dataset.value;
			}
			item.addEventListener('click', function (e) {
				e.stopPropagation();
				dropdownBtn.innerText = this.innerText;
				dropdownBtn.focus();
				dropdownInput.value = this.dataset.value;
				dropdownList.classList.remove('form-select__list--visible');

				// Оновлюємо вибраний елемент
				dropdownListItems.forEach(el => el.classList.remove('form-select__list-item--selected'));
				this.classList.add('form-select__list-item--selected');
			});
		});

		// Функція для видалення фокусу з усіх елементів
		function removeAllFocus() {
			dropdownListItems.forEach(item => {
				item.classList.remove('form-select__list-item--focused');
			});
		}

		// Функція для додавання фокусу
		function addFocus(index) {
			if (index >= 0 && index < dropdownListItems.length) {
				removeAllFocus();
				dropdownListItems[index].classList.add('form-select__list-item--focused');
				// Прокручуємо до елемента, якщо потрібно
				dropdownListItems[index].scrollIntoView({ block: 'nearest' });
			}
		}

		// Обробка клавіатури
		dropdown.addEventListener('keydown', (e) => {
			const isOpen = dropdownList.classList.contains('form-select__list--visible');

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (!isOpen) {
					dropdownList.classList.add('form-select__list--visible');
					dropdownBtn.classList.add('form-select__button--active');
					currentFocusIndex = 0;
				} else {
					currentFocusIndex++;
					if (currentFocusIndex >= dropdownListItems.length) {
						currentFocusIndex = 0;
					}
				}
				addFocus(currentFocusIndex);
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (!isOpen) {
					dropdownList.classList.add('form-select__list--visible');
					dropdownBtn.classList.add('form-select__button--active');
					currentFocusIndex = dropdownListItems.length - 1;
				} else {
					currentFocusIndex--;
					if (currentFocusIndex < 0) {
						currentFocusIndex = dropdownListItems.length - 1;
					}
				}
				addFocus(currentFocusIndex);
			} else if (e.key === 'Enter') {
				e.preventDefault();
				if (isOpen && currentFocusIndex >= 0) {
					dropdownListItems[currentFocusIndex].click();
				} else if (!isOpen) {
					dropdownList.classList.add('form-select__list--visible');
					dropdownBtn.classList.add('form-select__button--active');
				}
			}
		});

		document.addEventListener('click', (e) => {
			if (e.target !== dropdownBtn) {
				dropdownList.classList.remove('form-select__list--visible');
				dropdownBtn.classList.remove('form-select__button--active');
				currentFocusIndex = -1;
				removeAllFocus();
			}
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Tab' || e.key === 'Escape') {
				dropdownList.classList.remove('form-select__list--visible');
				dropdownBtn.classList.remove('form-select__button--active');
				currentFocusIndex = -1;
				removeAllFocus();
			}
		});
	});
}
//====================================================


// user avatar and background changing ===============
// Changing the background image
const coverUpload = document.getElementById('coverUpload');
const coverInput = document.getElementById('coverInput');
const coverPreview = document.getElementById('coverPreview');

if (coverUpload && coverInput && coverPreview) {
	coverUpload.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			coverInput.click();
		}
	});

	coverInput.addEventListener('change', (e) => {
		const file = e.target.files[0];
		if (file) {
			const url = URL.createObjectURL(file);
			coverPreview.style.backgroundImage = `url(${url})`;
		}
	});
}

// Avatar change
const avatarUpload = document.getElementById('avatarUpload');
const avatarInput = document.getElementById('avatarInput');
const avatarPreviewImg = document.getElementById('avatarPreview');

if (avatarInput && avatarUpload && avatarPreviewImg) {
	avatarUpload.addEventListener('click', () => avatarInput.click());
	avatarUpload.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			avatarInput.click();
		}
	});

	avatarInput.addEventListener('change', (e) => {
		const file = e.target.files[0];
		if (file) {
			const url = URL.createObjectURL(file);
			avatarPreviewImg.src = url;
		}
	});
}
//====================================================


// from drop zone ======================================
const formDropZones = document.querySelectorAll('.form-drop-zone');
if (formDropZones.length > 0) {
	formDropZones.forEach(dropZone => {
		const dropZoneContent = document.querySelector(".form-drop-zone__content");
		const fileInput = dropZone.querySelector(".form-drop-zone__input");
		const browseBtn = dropZone.querySelector(".form-drop-zone__browse-btn");
		const preview = document.querySelector(".form-drop-zone__preview");
		const previewDesc = document.querySelector(".form-drop-zone__preview-desc");
		const previewImg = document.querySelector(".form-drop-zone__preview-image");
		const previewCloseBtn = document.querySelector(".form-drop-zone__preview-close");

		// Допустимі типи файлів
		const allowedTypes = [
			'image/png',
			'image/jpg',
			'image/jpeg',
			'image/gif',
			'video/mp4',
			'video/quicktime' // .mov файли
		];

		const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mov'];

		// Функція перевірки типу файлу
		function isValidFileType(file) {
			const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
			return allowedTypes.includes(file.type) && allowedExtensions.includes(fileExtension);
		}

		// Open file dialogue when click
		browseBtn.addEventListener("click", () => fileInput.click());

		// Drag file
		dropZone.addEventListener("dragover", (e) => {
			e.preventDefault();
			dropZone.classList.add("dragover");
		});

		dropZone.addEventListener("dragleave", () => {
			dropZone.classList.remove("dragover");
		});

		dropZone.addEventListener("drop", (e) => {
			e.preventDefault();
			dropZone.classList.remove("dragover");
			if (e.dataTransfer.files.length) {
				const file = e.dataTransfer.files[0];
				if (isValidFileType(file)) {
					fileInput.files = e.dataTransfer.files;
					updatePreview(file);
				} else {
					showError("Invalid file type. Please upload PNG, JPG, GIF, MP4, or MOV files only.");
				}
			}
		});

		// Choice through the button
		fileInput.addEventListener("change", () => {
			if (fileInput.files.length) {
				const file = fileInput.files[0];
				if (isValidFileType(file)) {
					updatePreview(file);
				} else {
					showError("Invalid file type. Please upload PNG, JPG, GIF, MP4, or MOV files only.");
					fileInput.value = ''; // Очищаємо input
				}
			}
		});

		previewCloseBtn.addEventListener('click', () => {
			previewImg.innerHTML = "";
			previewDesc.innerHTML = "";
			dropZoneContent.classList.remove('hidden');
			preview.classList.remove('visible');
			preview.classList.remove('error');
			fileInput.value = ''; // Очищаємо input
		});

		// Функція відображення помилки
		function showError(message) {
			previewImg.innerHTML = message;
			previewDesc.innerHTML = "";
			dropZoneContent.classList.add('hidden');
			preview.classList.add('visible');
			preview.classList.add('error');
		}

		// Preview
		function updatePreview(file) {
			// Перевірка розміру файлу (max 100MB)
			if (file.size > 104857600) {
				showError("Maximum file size 100MB");
				return;
			}

			preview.classList.remove('error');
			previewImg.innerHTML = "";
			previewDesc.innerHTML =
				"File name: " + file.name +
				", <br><br>file size: " + returnFileSize(file.size) + ".";
			dropZoneContent.classList.add('hidden');
			preview.classList.add('visible');

			if (file.type.startsWith("image/")) {
				const img = document.createElement("img");
				img.src = URL.createObjectURL(file);
				previewImg.appendChild(img);
			} else if (file.type.startsWith("video/")) {
				const video = document.createElement("video");
				video.src = URL.createObjectURL(file);
				video.controls = true;
				previewImg.appendChild(video);
			} else {
				previewImg.innerHTML = `Selected file: <br>${file.name}`;
			}
		}

		function returnFileSize(number) {
			if (number < 1024) {
				return number + " bytes";
			} else if (number > 1024 && number < 1048576) {
				return (number / 1024).toFixed(1) + " KB";
			} else if (number > 1048576) {
				return (number / 1048576).toFixed(1) + " MB";
			}
		}
	});
}

// const formDropZones = document.querySelectorAll('.form-drop-zone');

// if (formDropZones.length > 0) {
// 	formDropZones.forEach(dropZone => {
// 		const dropZoneContent = document.querySelector(".form-drop-zone__content");
// 		const fileInput = dropZone.querySelector(".form-drop-zone__input");
// 		const browseBtn = dropZone.querySelector(".form-drop-zone__browse-btn");
// 		const preview = document.querySelector(".form-drop-zone__preview");
// 		const previewDesc = document.querySelector(".form-drop-zone__preview-desc");
// 		const previewImg = document.querySelector(".form-drop-zone__preview-image");
// 		const previewCloseBtn = document.querySelector(".form-drop-zone__preview-close");

// 		// Open file dialogue when click
// 		browseBtn.addEventListener("click", () => fileInput.click());

// 		// Drag file
// 		dropZone.addEventListener("dragover", (e) => {
// 			e.preventDefault();
// 			dropZone.classList.add("dragover");
// 		});

// 		dropZone.addEventListener("dragleave", () => {
// 			dropZone.classList.remove("dragover");
// 		});

// 		dropZone.addEventListener("drop", (e) => {
// 			e.preventDefault();
// 			dropZone.classList.remove("dragover");

// 			if (e.dataTransfer.files.length) {
// 				fileInput.files = e.dataTransfer.files;
// 				updatePreview(fileInput.files[0]);
// 			}
// 		});

// 		// Choice through the button
// 		fileInput.addEventListener("change", () => {
// 			if (fileInput.files.length) {
// 				updatePreview(fileInput.files[0]);
// 			}
// 		});

// 		previewCloseBtn.addEventListener('click', () => {
// 			previewImg.innerHTML = "";
// 			previewDesc.innerHTML = "";
// 			dropZoneContent.classList.remove('hidden');
// 			preview.classList.remove('visible');
// 			preview.classList.remove('error');
// 		});

// 		// Preview
// 		function updatePreview(file) {
// 			//return if the file size is larger than 100MB
// 			if (file.size > 104857600) {
// 				previewImg.innerHTML = "Maximum file size 100MB";
// 				previewDesc.innerHTML = "";
// 				dropZoneContent.classList.add('hidden');
// 				preview.classList.add('visible');
// 				preview.classList.add('error');
// 				return;
// 			}
// 			preview.classList.remove('error');
// 			previewImg.innerHTML = "";
// 			previewDesc.innerHTML =
// 				"File name: " + file.name +
// 				", <br><br>file size: " + returnFileSize(file.size) + ".";
// 			dropZoneContent.classList.add('hidden');
// 			preview.classList.add('visible');
// 			if (file.type.startsWith("image/")) {
// 				const img = document.createElement("img");
// 				img.src = URL.createObjectURL(file);
// 				previewImg.appendChild(img);
// 			} else {
// 				previewImg.innerHTML = `Selected file: <br>${file.name}`;
// 			}
// 		}

// 		function returnFileSize(number) {
// 			if (number < 1024) {
// 				return number + "bytes";
// 			} else if (number > 1024 && number < 1048576) {
// 				return (number / 1024).toFixed(1) + "KB";
// 			} else if (number > 1048576) {
// 				return (number / 1048576).toFixed(1) + "MB";
// 			}
// 		}
// 	});
// }
//====================================================

