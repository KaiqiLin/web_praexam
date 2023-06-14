// const { json } = require("express/lib/response");

var app = new Vue({
    el: '#app',
    data: {
      shoe_sizes: [],
      shoestyle: "",
      shoebrand: "",
      shoeprice: 0,
      hight_price:100
    },

    methods: {
      loadSize: function () {
        let self = this;

        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
          if (req.readyState === 4 && req.status === 200) {
            let lists = JSON.parse(req.responseText);
            for (let list of lists) {
              // console.log(list.size);
              self.shoe_sizes.push(list.size);
            }
          }
        };
        req.open('GET', '/getAllSizes');
        req.send();
      },
      highetsPrice: function(){
        let self = this;

        let req = new XMLHttpRequest();
        req.onreadystatechange = function () {
          if (req.readyState === 4 && req.status === 200) {
            let lists = JSON.parse(req.responseText);
              // console.log(lists[0].price);
              self.hight_price=lists[0].price;
          }
        };
        req.open('GET', '/highest');
        req.send();
      }
    },
    mounted() {
      this.loadSize();
      this.highetsPrice();
    }
  });

// create shoes box search in db
function new_box(shoe_date){
 let div=document.createElement('DIV');
 div.classList.add('showoutcome');
 let brandhead=document.createElement('H2');
 brandhead.innerText=shoe_date.brand;
 let shoeid=document.createElement('H3');
 shoeid.innerText='Shoe ID : '+shoe_date.shoe_id;
 let shoesize=document.createElement('P');
 shoesize.innerText='Size : '+shoe_date.size;
 let shoestyle=document.createElement('P');
 shoestyle.innerText=shoe_date.style;
let price=document.createElement('P');
price.innerText='$'+shoe_date.price;
div.appendChild(brandhead);
div.appendChild(shoeid);
div.appendChild(shoesize);
div.appendChild(shoestyle);
div.appendChild(price);
let temp=document.getElementById('display');
temp.appendChild(div);
}

// insert data to boxes
function showAllShoes(){
  let req=new XMLHttpRequest();
  req.onreadystatechange=function(){
      if(req.readyState===4&&req.status===200){
        let temp=document.getElementById('display');
        temp.innerText="";
          let lists=JSON.parse(req.responseText);
          for(let list of lists){
            new_box(list);
          }
      }
  };
  req.open('POST','/allShoes');
  req.send();
}

// search some specificate shoes
function getyouwant(){
  let shoesize=document.getElementsByTagName('select')[0].value;
  let shoestyle=app.shoestyle;
  let shoebrand=app.shoebrand;
  let shoeprice=app.shoeprice;
  let ShoesDeatil={
    brand: shoebrand,
    style: shoestyle,
    price: shoeprice,
    size: shoesize
  };
  console.log(ShoesDeatil);
  let req=new XMLHttpRequest();
  req.onreadystatechange=function(){
    let temp=document.getElementById('display');
    temp.innerText="";
    if(req.readyState===4&&req.status===200){
        let lists=JSON.parse(req.responseText);
        // console.log(lists);
        if(lists.length===0){
          let undefine=document.createElement('h1');
        undefine.innerText='Can not find you want.\nPlease try again.';
        temp.appendChild(undefine);
        }
        else{
        for(let list of lists){
          new_box(list);
        }}
    }else{
      let undefine=document.createElement('h1');
      undefine.innerText='can not find you want.\nPlease try again.';
      temp.appendChild(undefine);
    }
  };
  req.open('POST','/getyouwant');
  req.setRequestHeader("Content-type", "application/json");
  req.send(JSON.stringify(ShoesDeatil));
}