// function get coookiesssss 
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function hapusCookie(){
    // alert('hapus')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
}

function logIn() {
    email = document.getElementById('index_in_email').value;
    password = document.getElementById('index_in_password').value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        "email": email,
        "password": password,
    }));

    xhr.onreadystatechange = function() {
         
        if(this.readyState == 4 && this.status == 200){

            document.cookie = `token=${this.response}`;
            window.location = "/admin.html";

        } else if(this.readyState == 4){
            respon = JSON.parse(this.response)
            alert(respon.message + this.status);
        }
    };
}

function addBook(){
    // debugger;
    name_book = document.getElementById("name_book").value;
    category = document.getElementById("category").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/addBook");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        "name_book": name_book,
        "category": category
    }));

    xhr.onreadystatechange = function() {
         
        if(this.readyState == 4 && this.status == 200){
            window.location = "/admin.html";

        } else if(this.readyState == 4){
            respon = JSON.parse(this.response)
            alert(respon.message + this.status);
        }
    };

}

function allBook(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:5000/allbook")
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
                   // console.log(this.response)
                hasil = JSON.parse(this.response)
                console.log(hasil.length)
                
                hasil.forEach((data,index) => {
                    // console.log(index)
                    if (index > hasil.length - 4) {
                        document.getElementById('table_book').insertAdjacentHTML("afterbegin",`<tr>
                        <th scope="row">${data.id}</th>
                        <td>${data.name_book}</td>
                        <td>${data.category}</td>
                    </tr>`)

                    }                    
                });

                // hasil.forEach(function(data){

                //     document.getElementById('table_book').innerHTML +=
                //     `<tr>
                //         <th scope="row">${data.id}</th>
                //         <td>${data.name_book}</td>
                //         <td>${data.category}</td>
                //     </tr>`
                // });
        }
    }
}

function showBooklist(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:5000/allbook")
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
                   // console.log(this.response)
                hasil = JSON.parse(this.response)
                console.log(hasil)
                
                hasil.forEach((data) => {
                    document.getElementById('book_name').innerHTML += `
                    <option>${data.name_book}</option>`
                    
                });
        }
    }
}

function submitBorrowing(){
    name = document.getElementById("loan_in_name").value;
    phone = document.getElementById("loan_in_phone").value;
    name_book = document.getElementById("book_name").value;
    start = document.getElementById("loan_date_start").value;
    end = document.getElementById("loan_date_end").value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/submitborrower");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        "name" : name,
        "phone" : phone,
        "name_book": name_book,
        "start": start,
        "end" : end
    }));

    xhr.onreadystatechange = function() {
         
        if(this.readyState == 4 && this.status == 200){
            alert('the book was successfully borrowed')
            window.location = "/loaning.html";

        } else if(this.readyState == 4){
            respon = JSON.parse(this.response)
            alert(respon.message + this.status);
        }
    };
}