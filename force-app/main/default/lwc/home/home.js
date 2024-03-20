import { LightningElement, track, wire } from 'lwc';
import categories from '@salesforce/resourceUrl/categories';
import My_Resource from '@salesforce/resourceUrl/Resource';
import { loadStyle, loadScript  } from 'lightning/platformResourceLoader';


export default class CategorySection extends LightningElement {
    @track categoriesData = [
        {
            id: 1,
            name: "Men’s fashion",
            imageStyle:"background-image: url('" + categories + "/category-2.jpg" +"')"
        },
        {
            id: 2,
            name: "Kid’s fashion",
            imageStyle: "background-image:  ('" + categories + "/category-3.jpg" +"')"
        },
        {
            id: 3,
            name: "Cosmetics",
            imageStyle: "background-image: url('" + categories + "/category-4.jpg" +"')"
        },
        {
            id: 4,
            name: "Accessories",
            imageStyle: "background-image: url('" + categories + "/category-5.jpg" +"')"
        }
    ];

    @track womens = [{
        id: 1,
        name: "Women’s fashion",
        imageStyle: "background-image: url('" + categories + "/category-1.jpg" +"')"
    }];

    renderedCallback() {
        Promise.all([
            loadStyle(this, My_Resource + '/css/bootstrap.min.css'),
            loadStyle(this, 'https://fonts.googleapis.com/css2?family=Cookie&display=swap'),
            loadStyle(this, 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap'),
        ]).then(() => {
            alert("Load thanh cong");
        })
        .catch(error => {
            alert("Load that bai");
        });
    }
}
