import throttle from "lodash/throttle"
import debounce from "lodash/debounce"

class RevealOnScroll{
 constructor(els, thresholdPercent){
     this.thresholdPercent = thresholdPercent;
    this.itemToReveal = els;
    this.browserHeight = window.innerHeight;
    this.hideInitially();
    this.scrollThrottle = throttle(this.callCaller, 200).bind(this);
    this.event();
 }

 event(){
     window.addEventListener("scroll", this.scrollThrottle)
     window.addEventListener("resize", debounce(()=>{
         console.log("Resize just ran")
         this.browserHeight = window.innerHeight
     }, 333))
 }
 callCaller(){
    console.log("Scroll function ran");
    this.itemToReveal.forEach(el =>{
        if(el.isRevealed == false){
            this.calculateIfScrolledTo(el)
        }
    })
 }
 calculateIfScrolledTo(el){
    if(window.scrollY + this.browserHeight > el.offsetTop){
        console.log("Element was calculated")
        let scrollPercent = (el.getBoundingClientRect().y / this.browserHeight) * 100
        if(scrollPercent < this.thresholdPercent){
            el.classList.add("reveal-item--is-visible");
            el.isRevealed = true;
            if(el.isLastItem){
                window.removeEventListener("scroll", this.scrollThrottle)

        }
    }
    }
 }

 hideInitially(){
    this.itemToReveal.forEach(element => {
        element.classList.add("reveal-item"),
        element.isRevealed = false;
    })
    this.itemToReveal[this.itemToReveal.length - 1].isLastItem = true;
 }
}

export default RevealOnScroll