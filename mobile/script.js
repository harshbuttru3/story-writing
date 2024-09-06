const hindibtn = document.getElementById("hindi");
const maithilibtn = document.getElementById("maithili");
const prize1 = document.getElementById("prize1");
const prize2 = document.getElementById("prize2");
const prize3 = document.getElementById("prize3");

maithilibtn.addEventListener("click", ()=>{
    prize1.innerText= "₹2000";
    prize2.innerText= "₹1200";
    prize3.innerText= "₹850";
    maithilibtn.style.backgroundColor = "#3cd1f7"
    hindibtn.style.backgroundColor = "#cacdcf"
})
hindibtn.addEventListener("click", ()=>{
    prize1.innerText= "₹6000";
    prize2.innerText= "₹3000";
    prize3.innerText= "₹1000";
     maithilibtn.style.backgroundColor = "#cacdcf"
    hindibtn.style.backgroundColor = "#3cd1f7"
})