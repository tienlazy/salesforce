import { LightningElement, track, wire } from 'lwc';
import getKnowledge from '@salesforce/apex/KnowledgeController.getKnowLedge';
import { loadScript } from 'lightning/platformResourceLoader';
import ResizeObserverPolyfill from '@salesforce/resourceUrl/ResizeObserverPolyfill';
import getTotalArticlesCount from '@salesforce/apex/KnowledgeController.getTotalArticlesCount';
import PaginationButton from '@salesforce/resourceUrl/PaginationButton';


export default class KnowledgePage extends LightningElement {
    @track listArticle = [];
    resizeObservers = new Map();
    @track currentPage = 1;
    @track pageSize = 12;
    @track totalArticles = 0;
    @track totalPages = 0;

    @wire(getTotalArticlesCount)
    wiredGetTotalArticlesCount({ error, data }) {
        if (data) {
            this.totalArticles = data;
            this.totalPages = Math.ceil(this.totalArticles / this.pageSize);
        } else if (error) {
            console.error('Error fetching total articles count:', error);
        }
    }

    callApexForData() {
        getKnowledge({ pageNumber: this.currentPage, pageSize: this.pageSize })
            .then(result => {
                this.listArticle = result;
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
            });
    }

    @wire(getKnowledge, { pageNumber: '$currentPage', pageSize: '$pageSize' })
    wiredGetKnowledge({ error, data }) {
        if (data) {
            this.listArticle = data;
            // Assuming data contains the entire record list (12 records) for the current page
            // No need to calculate totalArticles and totalPages here
        } else if (error) {
            console.error('Error fetching contacts:', error);
        }
    }

    connectedCallback() {
        this.addEventListener('click', this.handleButtonClick);
    }

    disconnectedCallback() {
        // Clean up the observer when the component is removed
        if (this.resizeObservers.size > 0) {
            this.resizeObservers.forEach((resizeObserver) => {
                resizeObserver.disconnect();
            });
            this.resizeObservers.clear();
        }
        this.removeEventListener('click', this.handleButtonClick);
    }

    handleReadMore(event) {
        // const articleId = event.currentTarget.dataset.id;
        // Implement the action when the "Read More" button is clicked based on the articleId.
    }

    handleTitleOverflow() {
        const titleElements = this.template.querySelectorAll('.article-title');

        if (!titleElements || titleElements.length === 0) return;

        // Initialize ResizeObservers for each title element
        titleElements.forEach((titleElement) => {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const newTitleHeight = entry.contentRect.height;
                    const titleStyles = window.getComputedStyle(titleElement);
                    const titleLineHeight = parseInt(titleStyles.lineHeight);
                    const numberOfLines = Math.floor(newTitleHeight / titleLineHeight);
                    console.log("aaaaaaaaaaaaaaaa: " + newTitleHeight + '/' + titleLineHeight);

                    const contentElement = this.template.querySelector('.content');
                    if (!contentElement) return;

                    if (numberOfLines == 2) {
                        contentElement.className = 'numberOfLines5';
                    } else if (numberOfLines == 3) {
                        contentElement.className = 'numberOfLines4';
                    } else if (numberOfLines == 4) {
                        contentElement.className = 'numberOfLines3';
                    } else if (numberOfLines == 5) {
                        contentElement.className = 'numberOfLines2';
                    }
                }
            });

            resizeObserver.observe(titleElement);
            this.resizeObservers.set(titleElement, resizeObserver);
        });
    }

    renderedCallback() {
        loadScript(this, ResizeObserverPolyfill)
            .then(() => {
                this.handleTitleOverflow();
            })
            .catch((error) => {
                console.error('Error loading ResizeObserver polyfill', error);
            });
    }

    handleFirst() {
        this.currentPage = 1;
        this.callApexForData();
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.callApexForData();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.callApexForData();
        }
    }

    handleLast() {
        this.currentPage = this.totalPages;
        this.callApexForData();
    }

    handleNumberClick(event) {
        const selectedPage = parseInt(event.target.dataset.page);
        if (!isNaN(selectedPage) && selectedPage >= 1 && selectedPage <= this.totalPages) {
            this.currentPage = selectedPage;
            this.callApexForData();
        }
    }

    // Method to call Apex class with updated pagination parameters
    callApexForData() {
        getKnowledge({ pageNumber: this.currentPage, pageSize: this.pageSize })
            .then(result => {
                this.listArticle = result;
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
            });
    }
    
    get numberButtons() {
        const buttons = [];
        const maxButtonsToShow = 3;
        let start = Math.max(1, this.currentPage - Math.floor(maxButtonsToShow / 2));
        const end = Math.min(start + maxButtonsToShow - 1, this.totalPages);
    
        if (this.totalPages > maxButtonsToShow) {
            if (this.currentPage <= Math.floor(maxButtonsToShow / 2) + 1) {
                start = 1;
            } else if (this.currentPage >= this.totalPages - Math.floor(maxButtonsToShow / 2)) {
                start = this.totalPages - maxButtonsToShow + 1;
            } else {
                buttons.push({ label: '...', value: -1, isActive: false, buttonClass: 'button-class' });
            }
        }
    
        for (let i = start; i <= end; i++) {
            buttons.push({
                label: i,
                value: i,
                isActive: i === this.currentPage,
                buttonClass: i === this.currentPage ? 'active button-class' : 'button-class'
            });
        }
    
        if (this.totalPages > maxButtonsToShow && this.currentPage < this.totalPages - Math.floor(maxButtonsToShow / 2)) {
            buttons.push({ label: '...', value: -1, isActive: false, buttonClass: 'button-class' });
        }
    
        return buttons;
    }

    handleButtonClick(event) {
        if (event.target.dataset.id === 'number-button') {
            const selectedPage = parseInt(event.target.dataset.page);
            if (!isNaN(selectedPage) && selectedPage >= 1 && selectedPage <= this.totalPages) {
                this.currentPage = selectedPage;
                this.callApexForData();
            }
        }
    }
}
