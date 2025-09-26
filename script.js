let products = document.querySelector("#products")



let objects
let request = new XMLHttpRequest()
let url = "https://fakestoreapi.com/products"
request.open("GET",url,false)

    request.addEventListener("load",()=>{
      if(request.status>=200&&request.status<300){
            objects = JSON.parse(request.responseText)
    console.log(objects)
      }else{
        // alert("miss conection")
        products.innerHTML=`<span class="loader"></span>`
      }

    })



request.send()
let productCart =JSON.parse(localStorage.getItem("products")) || [] // [{},{}]
function createdom(ele,parent,text,classes,id,href,src,alt,cssText){
    let myobj = document.createElement(ele)
    parent.appendChild(myobj)
    if (text) myobj.innerHTML = text;
    if (classes) myobj.className = classes;
    if (id) myobj.id = id;
    if (href) myobj.setAttribute("href",href);
    if (src) myobj.setAttribute("src",src);
    if (alt) myobj.setAttribute("alt",alt);
    if (cssText) myobj.style.cssText = cssText
    return myobj;
}

let takelist = (list)=>{
    products.innerHTML = "";
list.forEach(ele => {
     let card = createdom("div",products,"","card",ele.id,"","","","width:200px")
     let image = createdom("img",card,"","img","","",ele.image,ele.description,"aspect-ratio: 1 / 1;object-fit:cover")
    let title = createdom("p",card,`Product-Name : ${ele.title}`,"textt")
    let price = createdom("p",card,`Price : ${ele.price}`,"textt")
    createdom("span",card,"rate:"+ele.rating.rate,"text-success")
    createdom("span",card,"count:"+ele.rating.count,"text-danger")
    let descBtn = createdom("button",card,"show descripiton <i class='fa-solid fa-caret-down'></i>","btn btn-dark text-light rounded-5")
    let desc = createdom("p",card,`Descreption : ${ele.description}`,"textt d-none")

    descBtn.addEventListener("click",()=>{
        desc.classList.toggle("d-none")
        if(desc.classList.contains("d-none")){
            descBtn.innerHTML = "show descripiton <i class='fa-solid fa-caret-down'></i>"
        }
        else{
            descBtn.innerHTML = "hide descripiton <i class='fa-solid fa-caret-up'></i>"
        }
            

    })
    let category = createdom("p",card,`Category : ${ele.category}`,"textt")
    let btn = createdom("button",card,`Add  to cart <i class="fa-solid fa-cart-shopping"></i>`,"btn btn-primary text-light")

    if(productCart.find((element) => ele.id===element.id)){
      btn.innerHTML=`remove from cart <i class="fa-solid fa-cart-shopping"></i>`
      btn.addEventListener("click",() =>{
        removeProduct(ele)
        locaStorageSetter(productCart)
        renderCart(productCart)
        takelist(objects)
        checkClear()
      })
    }else{
          btn.addEventListener("click" ,() => {
        addToCart(ele.id)
        takelist(objects)
        checkClear()
}

)
    }


})
}

if(objects){

  takelist(objects)
}

let input = document.querySelector("#input");

input.addEventListener("input",() =>{
    let newlist = objects.filter(ele =>
        ele.title.toLowerCase().includes(input.value.toLowerCase()) ||
        ele.description.toLowerCase().includes(input.value.toLowerCase()) ||
        ele.category.toLowerCase().includes(input.value.toLowerCase()) ||
        ele.price.toString().includes(input.value)
    );
    takelist(newlist)
})


//  localStorage.setItem("test",JSON.stringify(["test"]))
// JSON.parse(localStorage.getItem("test"))


let locaStorageSetter = (list)=>localStorage.setItem("products",JSON.stringify(list))
function addToCart(id){
    myele = objects.find((ele)=> ele.id ===id)

    productCart.unshift(myele) // [{},{},{}]
    locaStorageSetter(productCart)// "[{},{},{}]"
    renderCart(productCart)
}
/*
{
    "key":"value"
    "key":"value"
    "key":"value"
    "key":"value"
    "key":"value"
    "products":"[{},{}]"
}
 */
let cartContainer = document.querySelector("#cart")

function removeProduct(needToRemove){
  productCart = productCart.filter(element => element.id!==needToRemove.id)
}
renderCart(productCart)
function renderCart(list){
    cartContainer.innerHTML = ""
    list.forEach(ele =>{
        let cartCard = createdom("div",cartContainer,"","card")
        createdom("img",cartCard,"","cartImage","","",ele.image,"","max-width:100px;aspect-ratio:1 / 1;")
        createdom("h3",cartCard,ele.title)
        createdom("span",cartCard,ele.price)
        let removeBtn = createdom("button",cartCard,"remove")
        removeBtn.addEventListener("click",()=>{
            removeProduct(ele)
            locaStorageSetter(productCart)
            renderCart(productCart)
            takelist(objects)
            checkClear()
        })
    })
    if(productCart.length===0){
      cartContainer.innerHTML="<p>the cart is empty</p>"
    }
}
let sum=0
objects.forEach(ele =>{
  sum+=ele.price
})
let avg = sum/objects.length;
document.querySelector("#avg").innerHTML = parseFloat(avg).toFixed(2)

let count = document.querySelector("#count")
let rate = document.querySelector("#rate")
let price = document.querySelector("#price")
price.addEventListener("change",filtering)
count.addEventListener("change",filtering)
rate.addEventListener("change",filtering)
function filtering(){
  let newlist = objects.filter((ele)=>{
    let countCheck = !count.checked || ele.rating.count >300; // uncheck ===> true
    let rateCheeck = !rate.checked|| ele.rating.rate >3; // un check ====> true
    let priceCheeck= !price.checked|| ele.price > avg;
    return countCheck && rateCheeck && priceCheeck ;
  })
  takelist(newlist)
}
let clear = document.querySelector("#clear")
clear.addEventListener("click",()=>{
  productCart =[]
  locaStorageSetter(productCart)
  renderCart(productCart)
  takelist(objects)
  checkClear()
})

console.log(productCart)
function checkClear(){
  if(productCart.length===0){
    clear.classList.add("d-none")
  }else{
    clear.classList.remove("d-none")
  }
}