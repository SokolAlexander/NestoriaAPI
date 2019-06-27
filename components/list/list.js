export class List {
    constructor(htmlEl) {
        this.el = htmlEl;
        this.maxCount = 20;
        this.currentCount = 0;
        this.data = [{
            title: '1_______________________________________1',
            price_formatted: 10
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        }];
        this._render();
        this._initEvents();
    }

    _render() {
        this.el.innerHTML = '';
        this.currentCount = 0;
        this.ul = document.createElement('ul');
        this._appendLis();
        this.el.appendChild(this.ul);
        this._createModal();
        this._appendButton();

    }

    _appendLis() {
        let i = this.currentCount;
        while ((i < this.maxCount + this.currentCount)&&(i< this.data.length)) {
            let li = document.createElement('li');
            li.dataset.index = i;
            let divWrap = this._addDiv(['wrap'],'');
            let divTitle = this._addDiv(['title'], this.data[i].title);
            let divPrice = this._addDiv(['price'], this.data[i].price_formatted);
            let divKeywords = this._addDiv(['keywords'], this.data[i].keywords);

            divWrap.appendChild(divTitle);
            divWrap.appendChild(divPrice);

            li.appendChild(divWrap);
            li.appendChild(divKeywords);

            this.ul.appendChild(li);

            i++;
        }

        this.currentCount = i;
    }

    _addDiv(CssClasses, innerText) {
        let div = document.createElement('div');
        div.innerText = innerText;

        CssClasses.forEach(CssClass => {
            div.classList.add(CssClass); 
        });

        return div;
    }

    _appendButton() {
        let button = document.createElement('a');
        button.classList.add('button', 'show-more');
        button.innerText = 'show more';
        this.el.appendChild(button);
    }

    _showMore() {
        let request = new CustomEvent('requestData', 
            {bubbles: true, detail: {page: ++this.currentPage}});
        this.el.dispatchEvent(request);
    }

    _initEvents() {
        this.el.addEventListener('click', (e) => {
            if (e.target.classList.contains('button')) {
                this._showMore();
            } else if (e.target.classList.contains('modal-overlay')) {
                this._hideModal();
            } else this._checkForLi(e.target);
        })
    }

    /**
     * calls displayDetails if click was on li or li's chilnode
     * @param {*} target 
     */
    _checkForLi(target) {
        while (target !== this.el) {
            if (target.tagName === 'LI') {
                this._displayModal(target.dataset.index);
                break;
            } else target = target.parentNode;
        }
    }

    _displayModal(index) {
        this.modal.innerHTML = '';
        let modalInsideDiv = this._fillModal(index);
        this.modal.appendChild(modalInsideDiv);
        this.modalOverlay.classList.remove('modal-closed');
        this.modal.classList.remove('modal-closed');
    }

    _fillModal(index) {
        let newDiv = this._addDiv(['modal-guts'], '');

        let titleWrap = this._addDiv(['title-wrap'], '');
        let clearfix = this._addDiv(['clearfix'], '');
        let titleDiv = this._addDiv(['modal-title', 'title'], this.data[index].title);
        let priceDiv = this._addDiv(['modal-price', 'price'], this.data[index].price_formatted);
        titleWrap.appendChild(titleDiv);
        titleWrap.appendChild(priceDiv);
        titleWrap.appendChild(clearfix);

        let imgWrap = this._addDiv(['modal-img-wrap'], '');
        let img = document.createElement('img');
        img.setAttribute('src', this.data[index].img_url);
        imgWrap.appendChild(img);

        let info = `Property: ${this.data[index].property_type}
        Bathrooms: ${this.data[index].bathroom_number}
        Bedrooms: ${this.data[index].bedroom_number}

        ${this.data[index].summary}`;
        let textWrap = this._addDiv(['modal-text-wrap'], info);

        let linkToLister = document.createElement('a');
        linkToLister.href = this.data[index].lister_url;
        linkToLister.innerText = 'learn more';
        textWrap.appendChild(linkToLister);

        newDiv.appendChild(titleWrap);
        newDiv.appendChild(imgWrap);
        newDiv.appendChild(textWrap);

        return newDiv
    }

    _hideModal() {
        this.modalOverlay.classList.add('modal-closed');
        this.modal.classList.add('modal-closed');
    }

    _createModal() {
        this.modalOverlay = this._addDiv(['modal-overlay', 'modal-closed'], '');
        this.modal = this._addDiv(['modal', 'modal-closed'], '');
        this.el.appendChild(this.modalOverlay);
        this.el.appendChild(this.modal);
    }

    addData(response) {
        console.log(this.data[0]);
        this.data = this.data.concat(response.listings);
        console.log(this.data[0]);
        this._appendLis();
    }

    setData(response) {
        this.data = response.listings;
        this.currentPage = response.page;
        this._render();
    }
}


// [
//     {
//       "bathroom_number": 2,
//       "bedroom_number": 2,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "OnTheMarket.com",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/2_bedroom_flat_to_rent_111780051009249734.jpg",
//       "img_width": 400,
//       "keywords": "Shared Garden, Furnished, Kitchen, Lift, Porter, Modern, Reception",
//       "latitude": 51.4921,
//       "lister_name": "Alexander Lewis",
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780051009249734/title/5/1-1?serpUid=&pt=1&ot=2&l=chelsea&did=105_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.170957,
//       "price": 748,
//       "price_currency": "£",
//       "price_formatted": "£748",
//       "price_high": 748,
//       "price_low": 748,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "size": 0,
//       "size_type": "net",
//       "summary": "This two bedroom two bathroom apartment is located in the heart of ...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/2_bedroom_flat_to_rent_111780051009249734.jpg",
//       "thumb_width": 80,
//       "title": "Pelham Court, Fulham Road , Chelsea , SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 2,
//       "bedroom_number": 2,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/2_bedroom_flat_to_rent_in_pelham_court_fulham_road_chelsea_sw3_london_111780038960407164.jpg",
//       "img_width": 400,
//       "keywords": "Shared Garden, Raised Ground, Refurbished, Double Bedroom, Kitchen, Porter, Modern, Reception",
//       "latitude": 51.4922,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780038960407164/title/5/1-2?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.170815,
//       "price": 768,
//       "price_currency": "£",
//       "price_formatted": "£768",
//       "price_high": 768,
//       "price_low": 768,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 2,
//       "size": 0,
//       "size_type": "net",
//       "summary": "No tenancy or administrative feesthis newly refurbished 2 double be...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/2_bedroom_flat_to_rent_in_pelham_court_fulham_road_chelsea_sw3_london_111780038960407164.jpg",
//       "thumb_width": 80,
//       "title": "Pelham Court, Fulham Road, Chelsea, London SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 5,
//       "bedroom_number": 5,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Movebubble",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/chelsea_embankment_sw3_111780135632071520.jpg",
//       "img_width": 400,
//       "keywords": "Furnished, Refurbished, Lift, Reception",
//       "latitude": 51.48386,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780135632071520/title/5/1-3?serpUid=&pt=1&ot=2&l=chelsea&did=370848_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.16046,
//       "price": 3939,
//       "price_currency": "£",
//       "price_formatted": "£3,939",
//       "price_high": 3939,
//       "price_low": 3939,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 5,
//       "size": 0,
//       "size_type": "net",
//       "size_unit": "0",
//       "summary": "Complete with direct lift access, river views, large double recepti...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/chelsea_embankment_sw3_111780135632071520.jpg",
//       "thumb_width": 80,
//       "title": "Chelsea Embankment, SW3 - Furnished",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 5,
//       "bedroom_number": 5,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "OnTheMarket.com",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/5_bedroom_house_to_rent_111780053797340546.jpg",
//       "img_width": 400,
//       "keywords": "Garden, Reception",
//       "latitude": 51.486393,
//       "lister_name": "Knight Frank",
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780053797340546/title/5/1-4?serpUid=&pt=1&ot=2&l=chelsea&did=105_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.170579,
//       "price": 8227,
//       "price_currency": "£",
//       "price_formatted": "£8,227",
//       "price_high": 8227,
//       "price_low": 8227,
//       "price_type": "weekly",
//       "property_type": "house",
//       "size": 0,
//       "size_type": "net",
//       "summary": "5 bedroom house to rent in glebe place, chelsea sw3 this unique hou...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/5_bedroom_house_to_rent_111780053797340546.jpg",
//       "thumb_width": 80,
//       "title": "Glebe Place, Chelsea,London, SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": "",
//       "bedroom_number": 2,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "OnTheMarket.com",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/2_bedroom_apartment_to_rent_111780053723796930.jpg",
//       "img_width": 400,
//       "keywords": "Shared Garden, Lift, Porter, Modern, Edwardian",
//       "latitude": 51.4921,
//       "lister_name": "Alexander Lewis",
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780053723796930/title/5/1-5?serpUid=&pt=1&ot=2&l=chelsea&did=105_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.170957,
//       "price": 698,
//       "price_currency": "£",
//       "price_formatted": "£698",
//       "price_high": 698,
//       "price_low": 698,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "size": 0,
//       "size_type": "net",
//       "summary": "A selection of apartments located in the sought after location of s...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/2_bedroom_apartment_to_rent_111780053723796930.jpg",
//       "thumb_width": 80,
//       "title": "Pelham Court, Fulham Road, Chelsea , London, SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 2,
//       "bedroom_number": 3,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "OnTheMarket.com",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/3_bedroom_apartment_to_rent_111780051403343615.jpg",
//       "img_width": 400,
//       "keywords": "En suite, Furnished, Double Bedroom, Kitchen, Lift, Reception",
//       "latitude": 51.4923,
//       "lister_name": "Bective Leslie Marsh",
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780051403343615/title/5/1-6?serpUid=&pt=1&ot=2&l=chelsea&did=105_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.161324,
//       "price": 848,
//       "price_currency": "£",
//       "price_formatted": "£848",
//       "price_high": 848,
//       "price_low": 848,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "size": 0,
//       "size_type": "net",
//       "summary": "A and recently furnished three bedroom flat postioned on the top tw...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/3_bedroom_apartment_to_rent_111780051403343615.jpg",
//       "thumb_width": 80,
//       "title": "Draycott Place, Chelsea SW3 - Lift",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": 1,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/1_bedroom_flat_to_rent_in_sloane_avenue_chelsea_sw3_london_111780039443316637.jpg",
//       "img_width": 400,
//       "keywords": "Lift, Porter, Modern, Reception",
//       "latitude": 51.4923,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780039443316637/title/5/1-7?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.164931,
//       "price": 539,
//       "price_currency": "£",
//       "price_formatted": "£539",
//       "price_high": 539,
//       "price_low": 539,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 1,
//       "size": 0,
//       "size_type": "net",
//       "summary": "A modern living space with open-plan reception room, this smart one...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/1_bedroom_flat_to_rent_in_sloane_avenue_chelsea_sw3_london_111780039443316637.jpg",
//       "thumb_width": 80,
//       "title": "Sloane Avenue, Chelsea, London SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": 1,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/1_bedroom_flat_to_rent_in_nell_gwynn_house_sloane_avenue_chelsea_sw3_london_111780040002594125.jpg",
//       "img_width": 400,
//       "keywords": "Kitchen, Porter, Modern",
//       "latitude": 51.4923,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780040002594125/title/5/1-8?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.164931,
//       "price": 768,
//       "price_currency": "£",
//       "price_formatted": "£768",
//       "price_high": 768,
//       "price_low": 768,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 1,
//       "size": 0,
//       "size_type": "net",
//       "summary": "Detailed descriptionshort let. This modern apartment boasts a good ...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/1_bedroom_flat_to_rent_in_nell_gwynn_house_sloane_avenue_chelsea_sw3_london_111780040002594125.jpg",
//       "thumb_width": 80,
//       "title": "Nell Gwynn House, Sloane Avenue, Chelsea SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": "",
//       "bedroom_number": 0,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "OnTheMarket.com",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/studio_to_rent_111780050409996464.jpg",
//       "img_width": 400,
//       "keywords": "Wood Floor, Kitchen, Lift",
//       "latitude": 51.4923,
//       "lister_name": "Chestertons",
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780050409996464/title/5/1-9?serpUid=&pt=1&ot=2&l=chelsea&did=105_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.167418,
//       "price": 349,
//       "price_currency": "£",
//       "price_formatted": "£349",
//       "price_high": 349,
//       "price_low": 349,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "size": 0,
//       "size_type": "net",
//       "summary": "A superb studio apartment that has been completed to a high standar...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/studio_to_rent_111780050409996464.jpg",
//       "thumb_width": 80,
//       "title": "Chelsea Cloisters, Sloane Avenue, London",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": 1,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/1_bedroom_flat_to_rent_in_woodfall_street_chelsea_sw3_london_111780039450108297.jpg",
//       "img_width": 400,
//       "keywords": "Kitchen, Cul-de-Sac",
//       "latitude": 51.4887,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780039450108297/title/5/1-10?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.162111,
//       "price": 399,
//       "price_currency": "£",
//       "price_formatted": "£399",
//       "price_high": 399,
//       "price_low": 399,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 1,
//       "size": 0,
//       "size_type": "net",
//       "summary": "Located in a quiet chelsea backwater yet minutes from m&s on the ki...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/1_bedroom_flat_to_rent_in_woodfall_street_chelsea_sw3_london_111780039450108297.jpg",
//       "thumb_width": 80,
//       "title": "Woodfall Street, Chelsea SW3, London,",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": "",
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/studio_flat_to_rent_in_sloane_avenue_mansions_sloane_avenue_chelsea_sw3_london_111780037667756579.jpg",
//       "img_width": 400,
//       "keywords": "Refurbished, Wood Floor, Kitchen, Lift, Porter",
//       "latitude": 51.4917,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780037667756579/title/5/1-11?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.164049,
//       "price": 349,
//       "price_currency": "£",
//       "price_formatted": "£349",
//       "price_high": 349,
//       "price_low": 349,
//       "price_type": "weekly",
//       "property_type": "house",
//       "room_number": 0,
//       "size": 0,
//       "size_type": "net",
//       "summary": "Quietly situated to the rear of the building, the flat has recently...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/studio_flat_to_rent_in_sloane_avenue_mansions_sloane_avenue_chelsea_sw3_london_111780037667756579.jpg",
//       "thumb_width": 80,
//       "title": "Sloane Avenue Mansions, Sloane Avenue, Chelsea SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": 4,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/1_bedroom_flat_to_rent_in_wiltshire_close_chelsea_sw3_london_111780039756736523.jpg",
//       "img_width": 400,
//       "keywords": "",
//       "latitude": 51.4933,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780039756736523/title/5/1-12?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.163855,
//       "price": 200,
//       "price_currency": "£",
//       "price_formatted": "£200",
//       "price_high": 200,
//       "price_low": 200,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 1,
//       "size": 0,
//       "size_type": "net",
//       "summary": "I'm pleased to offer you this comfy room. Tube line/stations:- 4 mi...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/1_bedroom_flat_to_rent_in_wiltshire_close_chelsea_sw3_london_111780039756736523.jpg",
//       "thumb_width": 80,
//       "title": "Wiltshire Close, Chelsea SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": "",
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/studio_flat_to_rent_in_sloane_avenue_chelsea_sw3_london_111780040477448017.jpg",
//       "img_width": 400,
//       "keywords": "",
//       "latitude": 51.4924,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780040477448017/title/5/1-13?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.167437,
//       "price": 549,
//       "price_currency": "£",
//       "price_formatted": "£549",
//       "price_high": 549,
//       "price_low": 549,
//       "price_type": "weekly",
//       "property_type": "house",
//       "room_number": 0,
//       "size": 0,
//       "size_type": "net",
//       "summary": "Short let. Offering bright and accommodation within a secure reside...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/studio_flat_to_rent_in_sloane_avenue_chelsea_sw3_london_111780040477448017.jpg",
//       "thumb_width": 80,
//       "title": "Sloane Avenue, Chelsea, London SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 2,
//       "bedroom_number": 3,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/3_bedroom_flat_to_rent_in_beaufort_street_chelsea_sw3_london_111780038789547089.jpg",
//       "img_width": 400,
//       "keywords": "",
//       "latitude": 51.4833,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780038789547089/title/5/1-14?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.174945,
//       "price": 1446,
//       "price_currency": "£",
//       "price_formatted": "£1,446",
//       "price_high": 1446,
//       "price_low": 1446,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 3,
//       "size": 0,
//       "size_type": "net",
//       "summary": "Short let. This and bright three bedroom apartment is situated clos...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/3_bedroom_flat_to_rent_in_beaufort_street_chelsea_sw3_london_111780038789547089.jpg",
//       "thumb_width": 80,
//       "title": "Beaufort Street, Chelsea, London SW3",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 2,
//       "bedroom_number": 3,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "OnTheMarket.com",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/3_bedroom_house_to_rent_111780050854674134.jpg",
//       "img_width": 400,
//       "keywords": "Kitchen, Reception",
//       "latitude": 51.486256,
//       "lister_name": "Knight Frank",
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780050854674134/title/5/1-15?serpUid=&pt=1&ot=2&l=chelsea&did=105_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.181474,
//       "price": 1097,
//       "price_currency": "£",
//       "price_formatted": "£1,097",
//       "price_high": 1097,
//       "price_low": 1097,
//       "price_type": "weekly",
//       "property_type": "house",
//       "size": 0,
//       "size_type": "net",
//       "summary": "3 bedroom house to rent in chelsea sw10 available with a zero depos...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/3_bedroom_house_to_rent_111780050854674134.jpg",
//       "thumb_width": 80,
//       "title": "Redcliffe Road, Chelsea, London, SW10",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": "",
//       "bedroom_number": 0,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "OnTheMarket.com",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/studio_to_rent_111773470454342406.jpg",
//       "img_width": 400,
//       "keywords": "Garden, Wood Floor, Lift, Porter, Modern",
//       "latitude": 51.4885,
//       "lister_name": "Ruck & Ruck",
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111773470454342406/title/5/1-16?serpUid=&pt=1&ot=2&l=chelsea&did=105_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.168637,
//       "price": 424,
//       "price_currency": "£",
//       "price_formatted": "£424",
//       "price_high": 424,
//       "price_low": 424,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "size": 0,
//       "size_type": "net",
//       "summary": "Newly decorated, and modern well-planned studio flat on the second ...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/studio_to_rent_111773470454342406.jpg",
//       "thumb_width": 80,
//       "title": "Chelsea, South Kensington, Sloane Square",
//       "updated_in_days": 1,
//       "updated_in_days_formatted": "first seen yesterday"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": 1,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/1_bedroom_flat_to_rent_in_chelsea_manor_street_sw3_london_111402596194818452.jpg",
//       "img_width": 400,
//       "keywords": "Furnished",
//       "latitude": 51.4887,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111402596194818452/title/5/1-17?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.168289,
//       "price": 1728,
//       "price_currency": "£",
//       "price_formatted": "£1,728",
//       "price_high": 1728,
//       "price_low": 1728,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 1,
//       "size": 0,
//       "size_type": "net",
//       "summary": "Ideally located for those looking to be in the heart of chelsea, wi...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/1_bedroom_flat_to_rent_in_chelsea_manor_street_sw3_london_111402596194818452.jpg",
//       "thumb_width": 80,
//       "title": "Chelsea Manor Street, London SW3",
//       "updated_in_days": 1,
//       "updated_in_days_formatted": "first seen yesterday"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": 2,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/2_bedroom_flat_to_rent_in_fulham_road_chelsea_walk_kensington_chelsea_sw10_london_111780029538175918.jpg",
//       "img_width": 400,
//       "keywords": "Wood Floor, Double Bedroom, Kitchen, Modern, Reception",
//       "latitude": 51.4839,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780029538175918/title/5/1-18?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.184986,
//       "price": 509,
//       "price_currency": "£",
//       "price_formatted": "£509",
//       "price_high": 509,
//       "price_low": 509,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 2,
//       "size": 0,
//       "size_type": "net",
//       "summary": "Please quote asp 30635a two bedroom flat to rent in chelsea sw10. T...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/2_bedroom_flat_to_rent_in_fulham_road_chelsea_walk_kensington_chelsea_sw10_london_111780029538175918.jpg",
//       "thumb_width": 80,
//       "title": "Fulham Road, Chelsea Walk, Kensington & Chelsea, London SW10",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 1,
//       "bedroom_number": 1,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/1_bedroom_flat_to_rent_in_coleridge_square_chelsea_sw10_london_111780032221960535.jpg",
//       "img_width": 400,
//       "keywords": "Garden, Furnished, Balcony, Refurbished, Wood Floor, Kitchen, Porter, Swimming Pool, Reception",
//       "latitude": 51.4806,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780032221960535/title/5/1-19?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.18728,
//       "price": 509,
//       "price_currency": "£",
//       "price_formatted": "£509",
//       "price_high": 509,
//       "price_low": 509,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 1,
//       "size": 0,
//       "size_type": "net",
//       "summary": "This 4th floor one-bedroom apartment is situated in bredin house, w...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/1_bedroom_flat_to_rent_in_coleridge_square_chelsea_sw10_london_111780032221960535.jpg",
//       "thumb_width": 80,
//       "title": "Coleridge Square, Chelsea SW10",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     },
//     {
//       "bathroom_number": 2,
//       "bedroom_number": 2,
//       "car_spaces": 0,
//       "commission": 0,
//       "construction_year": 0,
//       "datasource_name": "Findproperly",
//       "img_height": 300,
//       "img_url": "https://imgs.nestimg.com/2_bedroom_flat_to_rent_in_redcliffe_gardens_chelsea_sw10_london_111780038496832821.jpg",
//       "img_width": 400,
//       "keywords": "Garden, En suite, High Ceilings, Modern",
//       "latitude": 51.486,
//       "lister_url": "https://www.nestoria.co.uk/detail/0000000111780038496832821/title/5/1-20?serpUid=&pt=1&ot=2&l=chelsea&did=114_default&t_sec=9&t_or=45&t_pvid=null&utm_source=api&utm_medium=external",
//       "listing_type": "rent",
//       "location_accuracy": 9,
//       "longitude": -0.186316,
//       "price": 623,
//       "price_currency": "£",
//       "price_formatted": "£623",
//       "price_high": 623,
//       "price_low": 623,
//       "price_type": "weekly",
//       "property_type": "flat",
//       "room_number": 2,
//       "size": 0,
//       "size_type": "net",
//       "summary": "Zero deposit available. Long let 2 bedroom flat offering a and inte...",
//       "thumb_height": 60,
//       "thumb_url": "https://imgs.nestimg.com/medium/2_bedroom_flat_to_rent_in_redcliffe_gardens_chelsea_sw10_london_111780038496832821.jpg",
//       "thumb_width": 80,
//       "title": "Redcliffe Gardens, Chelsea, London SW10",
//       "updated_in_days": 0,
//       "updated_in_days_formatted": "New"
//     }
//   ]