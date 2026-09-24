//Bloquer Maj 
//Pour plier code => Ctrl K puis Ctrl 0
//Pour deplyer  => Ctrl K puis Ctrl J


//          /\
//         //\\
//        ======
//    ===============
//=========================
// =======( TIMING )========
//==========================
function startTime() {
  const today = new Date();
  var h = today.getHours();   
  var m = today.getMinutes(); 
  var s = today.getSeconds();    
  m = checkTime(m);  
  s = checkTime(s);

  var myTime = h + ':' + m + ':' + s;
  
  document.getElementById('displayTime').innerHTML = myTime;
  setTimeout(startTime, 1000);
}//startTime

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}//checkTime 


//=============================================
// =======( Start of the main program )========
//=============================================


//=============================================
// ========( Navigate in the tables )==========
//=============================================

var currentTable = 'users';


//var currentTable = 'users';
var currentSelected = {
            users: null,
          tickets: null,
    lignes_ticket: null,
       categories: null,
         products: null
};

var  firstRow = {
            users: null,
          tickets: null,
    lignes_ticket: null,
       categories: null,
         products: null
};


var ok_editingTicket = false;

var idCurrentTicket = null;
var idCurrentCategory = null;
var idCurrentProduct = null;

idCurrentUser = 2;
idCurrentTicket = 12;
idCurrentCategory = 1;


function  initKeyboardNavigation(){
    
    document.addEventListener('keydown', (event) => {

        if (event.target && ['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)) {
        return; }

        switch (event.key) { 

            case 'Home':
                event.preventDefault();

                alert('Home')  
            break;

            case 'ArrowUp':
                event.preventDefault();
                moveSelection(-1);
            break;

            case 'ArrowDown':      
                event.preventDefault();
                moveSelection(1);
            break; 
            
            case 'Enter':  
                event.preventDefault(); 
                console.log(currentTable);
                if(currentTable === 'users') {                                    
                  displayTickets(currentSelected['users']);
                  setCurrentTable('tickets');
                  selectFirstRow('tickets');                  
                  console.log('tickets1 :',currentSelected['tickets']);
                } else if(currentTable === 'tickets') {
                  console.log('tickets2 :',currentSelected['tickets']);                                
                  displayTicket(currentSelected['tickets']);
                  displayProducts(currentSelected['categories']);
                  setCurrentTable('lignes_ticket');
                  selectFirstRow('lignes_ticket');
                } else if(currentTable === 'lignes_ticket') { 
                  console.log('tickets3 :',currentSelected['tickets']);
                  console.log('lignes_ticket :',currentSelected['lignes_ticket']);
                  setCurrentTable('products');
                  selectFirstRow('products');
                } else if(currentTable === 'products') { 

                  pickProduct(currentSelected['products']);
                  activateRadioButton('btnradio4'); 


                  console.log('id_product:',currentSelected['products']);
                  console.log('tickets4 :',currentSelected['tickets']);
                  console.log('lignes_ticket :',currentSelected['lignes_ticket']);                                    
                }                                                                 
            break;//Enter      

            case 'Insert':  
                event.preventDefault();                     
            break;            

            case 'End':  
                event.preventDefault();                     
            break;                  

            case 'Escape':
                event.preventDefault();
                window.location.href = 'http://localhost:8000/front/product/index.php';
            break;

            case 'PageUp':          
                event.preventDefault();
            break;

            case 'F1':
                event.preventDefault();                       
                activateRadioButton('btnradio1');
            break;

            case 'F2':
                event.preventDefault();
                activateRadioButton('btnradio2');
            break;

            case 'F3':
                event.preventDefault();
                activateRadioButton('btnradio3');
            break;

            case 'F4':
                event.preventDefault();                
                activateRadioButton('btnradio4');
            break;

            case 'F5':
                event.preventDefault();
                activateRadioButton('btnradio5');
            break;

            case 'F6':
                event.preventDefault();
                
            break;                
        
        }//switch                

    });//addEventListener()

    // Handle Mouse Pointer
    // Only rows with the green highlight use the pointer cursor on hover.
    document.addEventListener('mouseover', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = row.classList.contains('bg-success') ? 'pointer' : 'default';
    });

    document.addEventListener('mouseout', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = 'default';
    });

} //initKeyboardNigation()


////////////////////////////////////////////
////////////   RadioButtons  //////////////
//////////////////////////////////////////

function initRadioButtons() {
  var btnRadio1 = document.getElementById('btnradio1');
  var btnRadio2 = document.getElementById('btnradio2');
  var btnRadio3 = document.getElementById('btnradio3');
  var btnRadio4 = document.getElementById('btnradio4');
  var btnRadio5 = document.getElementById('btnradio5');
  

  if (btnRadio1) {         
    btnRadio1.addEventListener('change', function() {
      if (!this.checked) return;
      ok_editingTicket = false;
      setCurrentTable('users')                               
      selectFirstRow('users');
    });
  }
 
  if (btnRadio2) {
    btnRadio2.addEventListener('change', function() {
      if (!this.checked) return;
      ok_editingTicket = false;                                                     
      setCurrentTable('categories')
      selectFirstRow('categories');            
    });
  }

  if (btnRadio3) {
    btnRadio3.addEventListener('change', function() {
      if (!this.checked) return;
      ok_editingTicket = false;                                                     
      setCurrentTable('tickets')
      selectFirstRow('tickets');            
    });
  }

  if (btnRadio4) {
    btnRadio4.addEventListener('change', function() {
      if (!this.checked) return;
      ok_editingTicket = true;                                                     
      setCurrentTable('lignes_ticket')
      selectFirstRow('lignes_ticket');                  
    });
  }  

  if (btnRadio5) {
    btnRadio5.addEventListener('change', function() {
      if (!this.checked) return;
      ok_editingTicket = false;                                                     
      setCurrentTable('products')
      selectFirstRow('products');                  
    });
  }  

}

function getRadioButtons() {
  return [
    document.getElementById('btnradio1'),
    document.getElementById('btnradio2'),
    document.getElementById('btnradio3'),
    document.getElementById('btnradio4'),
    document.getElementById('btnradio5')
  ].filter(Boolean);
}

function moveRadioSelection(direction) {
  var radios = getRadioButtons();
  if (radios.length === 0) return;

  var currentIndex = radios.findIndex(function(radio) {
    return radio.checked;
  });

  if (currentIndex === -1) {
    currentIndex = direction > 0 ? 0 : radios.length - 1;
  }

  var nextIndex = (currentIndex + direction + radios.length) % radios.length;
  var nextRadio = radios[nextIndex];

  if (!nextRadio) return;

  nextRadio.checked = true;
  nextRadio.dispatchEvent(new Event('change', { bubbles: true }));
}

function activateRadioButton(radioId) {
  var radio = document.getElementById(radioId);
  if (!radio) return;

  radio.checked = true;
  radio.dispatchEvent(new Event('change', { bubbles: true }));
}

////////////////////////////////////////////
///////// Handle Row Selection ////////////
//////////////////////////////////////////

function setCurrentTable(tableName) {
  currentTable = tableName;
  var tableMap = {
         users: ['divTab1'],
    categories: ['divTab2'],
       tickets: ['divTab3'],
 lignes_ticket: ['divTab4'],
      products: ['divTab5']
  };
  ['divTab1','divTab2','divTab3','divTab4','divTab5'].forEach(function(divId) {
    var divEl = document.getElementById(divId);
    if (divEl != null) {    
      divEl.style.display = tableMap[tableName].includes(divId) ? 'block' : 'display';
    }
  });
}

function getTableRows(tableName) {
  switch (tableName) {
    case 'users':
      return document.querySelectorAll('#tbodyUsers tr');
    case 'tickets':
      return document.querySelectorAll('#tbodyTickets tr');
    case 'lignes_ticket':
      return document.querySelectorAll('#tbodyTicket tr');
    case 'categories':
      return document.querySelectorAll('#tbodyCategories tr');
    case 'products':
      return document.querySelectorAll('#tbodyProducts tr');
    default:
      return [];
  }
}

function getRowId(row, tableName) {
  if (!row) return null;
  switch (tableName) {
    case 'users':
      return row.dataset.iduser ;
    case 'tickets':
      return row.dataset.idticket;
    case 'lignes_ticket':
      currentSelected['tickets'] = row.dataset.idticket;
      return row.dataset.idligneticket;
    case 'categories':
      return row.dataset.idcategory;
    case 'products':
      return row.dataset.idproduct;
    default:
      return null;
  }
}

function selectFirstRow(tableName) {
  var rows = getTableRows(tableName);
  if (rows.length > 0) {
    var id = getRowId(rows[0], tableName);
    if (id != null) {
      selectRow(tableName, Number(id), false);
    }
  }
}


function highlightRow(tableName, id) {
  var rows = getTableRows(tableName);
  rows.forEach(function(row) {
    row.classList.remove('bg-success');
  });
  var selector = '';
  switch (tableName) {
    case 'users':
      selector = '#tbodyUsers tr[data-iduser="' + id + '"]';
      break;
    case 'tickets':                
      selector = '#tbodyTickets tr[data-idticket="' + id + '"]';
      break;
    case 'lignes_ticket':
      selector = '#tbodyTicket tr[data-idligneticket="' + id + '"]';
      break;
    case 'categories':
      selector = '#tbodyCategories tr[data-idcategory="' + id + '"]';
      break;
    case 'products':
      selector = '#tbodyProducts tr[data-idproduct="' + id + '"]';
      break;
  }
  var row = document.querySelector(selector);
  if (row) {
    row.classList.add('bg-success');
    row.focus();
  }
}

function selectRow(tableName, id, activate) {
  if (activate === undefined) activate = false;
  currentTable = tableName;
  currentSelected[tableName] = id;
  highlightRow(tableName, id);
  if(currentTable === 'lignes_ticket' || currentTable === 'products' ) {id=idCurrentTicket}
  switch (tableName) {
    case 'users':
      if (activate) { displayUsers(id); }
      break;
    case 'tickets':
      if (activate) { displayTickets(id); }
      break;
    case 'lignes_ticket':
      if (activate) { displayTicket(id); }
      break;      
    case 'categories':
      if (activate) { displayCategories(id); }
      break;
    case 'products':
      if (activate) { displayProducts(id); }
      break;
    case '':
      break;
  }
}

function moveSelection(direction) {
  var rows = Array.from(getTableRows(currentTable));
  if (rows.length === 0) return;
  var currentId = currentSelected[currentTable];
  var index = rows.findIndex(function(row) {
    return String(getRowId(row, currentTable)) === String(currentId);
  });
  if (index === -1) { index = 0; }
  var newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= rows.length) newIndex = rows.length - 1;
  var newId = getRowId(rows[newIndex], currentTable);
  if (newId != null) {
    selectRow(currentTable, Number(newId), false);
  }
}

function activateSelection() {
  var id = currentSelected[currentTable];
  if (id == null) return;
  if (currentTable === 'users') {
    displayUsers(id);
  } else if (currentTable === 'tickets') {
    displayTickets(id);
  } else if (currentTable === 'lignes_ticket') {
    displayTicket(id);    
  } else if (currentTable === 'categories') {
    displayCategories(id);
  } else if (currentTable === 'products') {
    displayProducts(id);
  }
}

function pick(idProduct){

  const product = document.querySelectorAll('#tbodyProducts tr');

  console.log(product[idProduct-1]);

  const classProduct = product[idProduct-1]

// 2. Récupérer toutes les classes sous forme de tableau (Array)
const listeClasses = Array.from(classProduct.classList);

// console.log(listeClasses);
// Résultat : ["border", "border-danger", "border-1", "w-100"]

if (classProduct.classList.contains("bg-success")) {
//    console.log("La ligne est verte !");

    
   
}

}


function selectRowTicketsUser(idUser){
  if (idUser == null || idUser === '') return;

  currentTable = 'users';
  currentSelected.users = Number(idUser);
//  updateTicketRadioState();
  selectRow('users', currentSelected.users, true);
}


//================( UpDate Quantity  )===============//

function adjustQuantity(plusMinus) {

  var idLigneTicket = currentSelected.lignes_ticket;
  if (!idLigneTicket) return;

  var ticketId = window.currentTicketId;
  if (ticketId == null) {
    var row = document.querySelector('#tbodyTicket tr[data-id-ligne-ticket="' + idLigneTicket + '"]');
    if (row && row.dataset.idTicket) {
      ticketId = Number(row.dataset.idTicket);
    }
  }
  if (ticketId != null) {
    getQuantity(ticketId, idLigneTicket, plusMinus);
  }
}

function getQuantity(idTicket,idLigneTicket,plusMinus){

 // console.log(idLigneTicket);
 // console.log(typeof(plusMinus));

  //Get quantity from lignes_ticket   
  //=====================================
  var xhr = new XMLHttpRequest();
    
  xhr.open('GET','http://localhost:8000/front/product/getQuantity.php?idTicket='+idTicket+'&idLigneTicket='+idLigneTicket+'&plusMinus='+plusMinus,true);

  xhr.onload = function() {

   if(xhr.status==200){

    var  data =  JSON.parse(this.response);

   // console.log(data);

    var idUser = Number(data[0]);

    displayTickets(idUser)
    displayTicket(idTicket)
     
   }//status==200 
    
  }//xhr.onload 

  xhr.send();
   
}//getQuantity 

//==============((- Tables management ))=======
//=============================================


// <============(Table-1 Users )==============>
function displayUsers(idUser){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/front/product/loadDataUsers.php?idUser='+idUser,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response); 
      
    console.log(data);       
                           //=========( divTab1 )=========//     
                           //=========( table-1 )=========//     
    
      var divTab1El = document.getElementById("divTab1");

      if( divTab1El != null){
        divTab1El.classList.add("border");
        divTab1El.classList.add("border-secondary");
      }          
 
          //----------(theadUsers)----------------

          var htmlTheadUsers=`
                            <tr class="border border-danger border-1 w-100">
                              <th class="col-1 text text-center border border-dark border-1">Id</th>         
                              <th class="col-1 text text-center border border-dark border-1">imgSrc</th>
                              <th class="col-2 text text-center border border-dark border-1">User</th>          
                            </tr>
                          `;

          document.getElementById('theadUsers').innerHTML = htmlTheadUsers; 

          //----------(tbodyUsers)---------------- 

          document.getElementById('tbodyUsers').innerHTML=""; 

          data.forEach(element => {
         
          var      idUser = element.id_user; 

          var      imgSrc = element.imgsrc 

          if(imgSrc===""){
          imgSrc = "default_user.png";
            }

          var nameUser = element.first_name

//style="cursor:pointer;"

          var htmlTbodyUsers=`<tr id="trUser`+idUser+`" class="border border-dark fw-bold"
                                data-iduser ="`+idUser+`" onclick="" tabindex="0"> 
                              
                              <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+idUser+`</td>

                          <td class=" text text-center border border-dark border-1" id="imgProduct">            
                            <img class="img img-fluid" src="/uploads/products/692acd0ecb804Cafe noir.png" width="50px"
                            onclick="">
                          </td>

                              <td class=" text text-nowrap text-center border border-dark border-1 fs-6 fw-bold">`+nameUser+`</td>
                          
                            </tr>            
                          `

            document.getElementById('tbodyUsers').innerHTML+=htmlTbodyUsers; 

          })//data.forEach

          var selectUser = document.querySelector('#tbodyUsers tr');

          if(selectUser) {
            selectUser.classList.add('bg-success');           
          }

    }//status==200  

  }//xhr.onload

  xhr.send();   

}//displayUsers

//function ticketsUser(idUser){
// <=======(Table-2 Tickets / User )==========>
function displayTickets(idUser){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/front/product/loadDataTickets.php?idUser='+idUser,true);

  xhr.onload = function() {

    if(xhr.status==200){

      
      var  data =  JSON.parse(this.response);

    //  console.log(data);

      //=========( table-2 )========//     
     
      var nameUser = data[0].firstName;

      var divTab3El = document.getElementById('divTab3');

      if(divTab3El != null){       
        divTab3El.classList.add("border");
        divTab3El.classList.add("border-secondary");
      }                       
     
      //===========( Heads Tickets table)========================//
                          
      var headsTickets = `
                          <tr class="border border-danger border-1 fw-bold fs-5 w-100">
                                  <th scope="col" class="col-6 text text-center border border-dark border-1">IdTk</th>                
                                  <th scope="col" class="col-12 text text-center border border-dark border-1">NrTk</th>
                                  <th scope="col" class="col-6 text text-center border border-dark border-1">Total</th>
                                  <th scope="col" class="col-6 text text-center border border-dark border-1">Action</th>
                          </tr>
                         `;

      var theadTicketsEl = document.getElementById('theadTickets');

      if(theadTicketsEl!=null){
        theadTicketsEl.innerHTML= headsTickets ;
      }

      //===========(show Detail Ticket table)========================

      var tbodyTicketsEl = document.getElementById('tbodyTickets')

      if(tbodyTicketsEl != null){
        tbodyTicketsEl.innerHTML="";  
      }
      
      //calculate total tickets
      var somTickets = 0;

      data =data.slice(1);//remove the first item from array data

      // console.log(data); 

      data.forEach(element => { 
     
      //
     //console.log(element)
     //idTicket: '1', nrTicket: '0001', totalTicket: '160'}
        var       idTicket = element.id_ticket  ;
        var       nrTicket = element.nr_ticket ;
        var    totalTicket = element.total_ticket;        

        //window.location.reload();

        var rowClass = (element.colored == 1) ? 'bg-success' : '';

        var dataTicket = `
                    <tr class="`+rowClass+`" data-idticket="`+idTicket+`" tabindex="0">
                        <td class="text text-center border border-dark fw-bold">`+idTicket+`</th>
                        <td class="text text-center border border-dark fw-bold">`+nrTicket+`</th>
                        <td class="text text-center border border-dark fw-bold">`+totalTicket+`</td>
                        <td class="text text-center border border-dark fw-bold">
                            <button class="btn btn-success btn-sm me-1"
                              onclick="">
                              <i class="fa-solid fa-pencil"></i>
                            </button>
                        </td>
                    </tr>                      
                      `;
                            
      if(tbodyTicketsEl != null){
        tbodyTicketsEl.innerHTML+=dataTicket;
      }

          somTickets += parseInt(totalTicket);

      });//forEach  

      //Last Row Tickets
      var firstTicketRow = document.querySelector('#tbodyTickets tr');
      if (firstTicketRow) {
        var firstTicketId = Number(firstTicketRow.dataset.idticket);
        currentSelected.tickets = firstTicketId;
        highlightRow('tickets', firstTicketId);
      }

      
      dataFoot = `
              <tr>
                  <td class="text text-center border border-dark">
                    <span class="badge text-bg-dark fw-bold fs-6"></span>
                  </td>

                  <td class="text text-center border border-dark">
                    <span class="badge text-bg-dark fw-bold fs-6">Total</span>
                  </td>

                  <td class="text text-center border border-dark">
                    <span class="text text-center text-dark fw-bold fs-6">`+somTickets.toFixed(2)+`</span>
                  </td>        
                  
                  <td class="text text-center border border-dark fw-bold">
                      <button class="btn btn-success btn-sm me-1"
                        onclick="ajouterTicket()">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                  </td>                  

              </tr>      
             `;

      var tfootTicketsEl = document.getElementById('tfootTickets') ;

      if(tfootTicketsEl != null){
        tfootTicketsEl.innerHTML=dataFoot; 
      }
   
      // displayCategory(1,1);displayProducts(1,1);

    }//status==200
  
  }//xhr.onload 

  xhr.send();

}//ticketsUser  

// <=======(Table-3 Edit Ticket )==============>
function displayTicket(idTicket){
 
  var xhr = new XMLHttpRequest();

  //window.currentTicketId = idTicket;

  xhr.open('GET','http://localhost:8000/front/product/loadDataTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){
   
      var  data =  JSON.parse(this.response);

    // console.log(data)

      //==================( table-3)========================//     
            
          currentSelected.tickets = data[0].id_ticket;

      var nrTicket = data[0].nr_ticket;

      var first_name = data[0].first_name;
     
      var totalTicket =  parseInt(data[0].total_ticket).toFixed(2) 

      var imgSrc = data[0].imgSrc;

    //=========(!!! ICI photo Serveur !!! )=================
    //===============(photoServer)==========================                                                 
//   var htmlImgSrc = ``;
//      var photoServerEl = document.getElementById("photoServer");
//      if(photoServerEl != null){
//        photoServerEl.innerHTML = htmlImgSrc;
//      }

      data =data.slice(1);//remove the first item from array data

//      console.log(data)  
      
      var divTab4El = document.getElementById("divTab4");         
      if(divTab4El != null){      
        divTab4El.classList.add("border");
        divTab4El.classList.add("border-secondary");
      } 

      //============( theadTicket )================================
      var htmlTheadTicket = `
                              <tr class="border border-danger border-1 w-100"> <!-- table row--->
                                <th class="col-3 text text-center border border-dark border-1">Id</th>         
                                <th class="col-3 text text-center border border-dark border-1">imgSrc</th>
                                <th class="col-8 text text-center border border-dark border-1">Product</th>          
                                <th class="col-12 text text-center border border-dark border-1">Quantite</th> 
                                <th class="col-10 text text-center border border-dark border-1">Prix</th> 
                                <th class="col-10 text text-center border border-dark border-1">Total</th>                             
                              </tr>                        
                             `
      var theadTicketEl = document.getElementById("theadTicket")

      if(theadTicketEl != null){
  
         theadTicketEl.innerHTML = htmlTheadTicket ;
      }  
    
      //============( tbodyTicket )================================

      var tbodyTicketEl = document.getElementById('tbodyTicket'); 
      
      if(tbodyTicketEl != null){
        tbodyTicketEl.innerHTML=""; 
      }
 
    data.forEach(element => {
            
    var idLigneTicket=element.id_ligne_ticket
    var     idProduct=element.id_product     
    var       imgSrc = element.imgSrc
    
    if(imgSrc===""){
      imgSrc = "default_product.png";
    }

    var nameProduct = element.name_product
    var    quantity = element.quantity
    var       price = element.price
    var   totalItem = quantity * price
    var     colored = element.colored;
    if (colored == 1) {
      currentSelected.lignes_ticket = idLigneTicket;
    }
    var rowClass = (colored == 1) ? 'bg-success' : '';
                                      
    var htmlTbodyTicket = `<tr  id="trDetailTicket`+idLigneTicket+`" class="border border-dark border-1 w-100 `+rowClass+`"
                                data-idligneticket="`+idLigneTicket+`"
                                data-idticket="`+idTicket+`"    onclick="" tabindex="0"> 
                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+idLigneTicket+`</td>
                                
                                <td class=" text text-center border border-dark border-1">            
                                  <img class="img img-fluid imgProduct"  
                                  src="/uploads/products/`+imgSrc+`"
                                  width="70px">
                                </td>

                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+nameProduct+`</td>

                                <td class=" text text-center border border-dark border-1"><!---Quantity------> 
                    
                                  <div class="d-flex">

                                        <!-- Btn Trash   -->
                                        <button id="supItemCart`+idLigneTicket+`" class="supItemCart btn btn-danger btn-sm mx-1"
                                          onclick="deleteElementTicket(`+idTicket+`,`+idLigneTicket+`)">
                                          <i class="fa-solid fa-trash-can"></i>
                                        </button> 

                                        <!-- Btn minus   -->
                                        <button id="decrementQuantity`+idLigneTicket+`" class="decrementQuantity btn btn-primary"
                                          onclick="getQuantity(`+idTicket+`,`+idLigneTicket+`,`+0+`)">
                                          -
                                        </button>

                                        <!-- Quantity   -->
                                        <span id="quantity`+idLigneTicket+`" class="quantity fs-6 fw-bold py-2 my-1 mx-1">`+quantity+`</span>

                                        <!-- Btn plus   -->
                                        <button id="incrementQuantity`+idLigneTicket+`" class="incrementQuantity btn btn-primary"
                                          onclick="getQuantity(`+idTicket+`,`+idLigneTicket+`,`+1+`)">
                                          +
                                        </button> 

                                    </div>
                                </td>

                                <td class="text text-center border border-dark border-1 fs-6 fw-bold">`+price+`</td>

                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+totalItem+`</td>
                      
                           </tr>`; 
                                                           
                tbodyTicketEl.innerHTML += htmlTbodyTicket;

            });//forEach 

      //Last Row Tickets
      var firstRowLineTicket = document.querySelector('#tbodyTicket tr');

      if (firstRowLineTicket) {
        var firstRowLineTicketId = Number(firstRowLineTicket.dataset.idligneticket);        
        currentSelected.lignes_ticket = firstRowLineTicketId;        
        highlightRow('lignes_ticket', firstRowLineTicketId);       
        console.log("currentSelected.lignes_ticket :"+currentSelected.lignes_ticket);         
      //  console.log(typeof(currentSelected));
      }
       
      firstRowLineTicket.classList.add('bg-success');

      //tfootTicket
        var htmlFootTicket = `                                        
                    <tr> 
                      <td class="text text-center border border-dark border-1 fs-6 fw-bold" colspan="3">
                        <div class="d-flex justify-content-center">
                                                                <!-- Btn Trash   -->
                          <button class="btn btn-danger mx-1"
                          onclick="deleteLinesTicket(`+idTicket+`)">
                          <i class="fa-solid fa-trash-can"></i>
                        </button> 
                                                                <!-- Btn Print   -->
                          <a class="print btn btn-success mx-1" href="/print.php?idTicket=`+idTicket+`">
                        <i class="fa-solid fa-print"></i>
                        </a>

                      </div>
                    </td>

                    <td class="text text-center border border-dark border-1 fw-bold" colspan="4">
                        <div class="d-flex flex-row justify-content-center fs-6">
                        <span>TTC</span>
                          <span class="badge text-bg-dark fs-4 mx-1" id="spanTotalTicket">`+totalTicket+`</span>
                        </div>
                    </td>                            
                  </tr>    
                         `;

        var tfootTicketEl = document.getElementById('tfootTicket');
        if(tfootTicketEl != null){
          tfootTicketEl.innerHTML=htmlFootTicket;           
        }        

           
    }//status==200 =================( end status function displayTicket)==================================

  }//xhr.onload 

  xhr.send();

}//displayTicket  

// <=======(Table-4 Categories )==============>
function displayCategories(idCategory){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/front/product/loadDataCategories.php?idCategory='+idCategory,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response); 
      
     // console.log(data);
         
      //divTab4----------(Tab4)------------------      

      var divTab2El = document.getElementById("divTab2");

      if( divTab2El != null){
        divTab2El.classList.add("border");
        divTab2El.classList.add("border-secondary");
      }          
 
          //----------(Head Product)----------------

          var headCategory=`
                            <tr class="border border-danger border-1 w-100">
                              <th class="col-1 text text-center border border-dark border-1">Id</th>         
                              <th class="col-1 text text-center border border-dark border-1">imgSrc</th>
                              <th class="col-2 text text-center border border-dark border-1">Category</th>          
                            </tr>
                          `;

          document.getElementById('theadCategories').innerHTML = headCategory; 

          //----------(Detail Product)---------------- 

          document.getElementById('tbodyCategories').innerHTML=""; 

          data.forEach(element => {
         
          var   rowIdCategory = element.id_category; 

          var      imgSrc = element.imgSrc 

          if(imgSrc===""){
          imgSrc = "default_category.png";
            }

          var nameCategory = element.name_category        
          var rowClass = (element.colored == 1) ? 'bg-success' : '';
          if (element.colored == 1) {
            currentSelected.categories = rowIdCategory;
          }

          var dataCategory=`<tr id="trCategory`+rowIdCategory+`" class="border border-dark fw-bold `+rowClass+`" style="cursor:pointer;"
                                data-idcategory="`+rowIdCategory+`" onclick="" tabindex="0"> 
                              
                              <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+rowIdCategory+`</td>

                          <td class=" text text-center border border-dark border-1" style="cursor:pointer;" id="imgProduct">            
                            <img class="img img-fluid" src="/uploads/products/692acd0ecb804Cafe noir.png" width="50px"
                            onclick="">
                          </td>

                              <td class=" text text-nowrap text-center border border-dark border-1 fs-6 fw-bold">`+nameCategory+`</td>
                          
                            </tr>            
                          `
            document.getElementById('tbodyCategories').innerHTML+=dataCategory; 

          })//data.forEach

          //if (!currentSelected.categories) {}
          var firstCategoryRow = document.querySelector('#tbodyCategories tr');
          if (firstCategoryRow) {
            currentSelected.categories = Number(firstCategoryRow.dataset.idcategory);
            selectFirstRow('categories');
            highlightRow('categories', currentSelected.categories);
          }

          setCurrentTable('users');            
          selectFirstRow('users');
       

    }//status==200  

  }//xhr.onload

  xhr.send();   

}//displayCategories  

// <============(Table-5 Products )===========>
function displayProducts(idCategory){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/front/product/loadDataProducts.php?idCategory='+idCategory,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response); 
      
      console.log(data);

      var nameCategory = data[0].name_category;
              
      //==================( table-5)========================//     
   

      var divTab5El = document.getElementById("divTab5");

      if( divTab5El != null){
        divTab5El.classList.add("border");
        divTab5El.classList.add("border-secondary");
      }          
      
      //----------(Head Product)----------------

          var headProduct=`
                            <tr class="border border-danger border-1 w-100">
                              <th class="col-1 text text-center border border-dark border-1">Id</th>         
                              <th class="col-4 text text-center border border-dark border-1">imgSrc</th>
                              <th class="col-11 text text-center border border-dark border-1">Product</th>    
                              <th class="col-9 text text-center border border-dark border-1">price</th>           
                            </tr>
                          `;

          document.getElementById('theadProducts').innerHTML = headProduct; 

          //----------(List products category)---------------- 

          document.getElementById('tbodyProducts').innerHTML=""; 

          data.forEach(element => {
         
          var   idProduct = element.id_product; 

          var rowClass = (element.colored == 1) ? 'bg-success' : '';
          if (element.colored == 1) {
            currentSelected.products = idProduct;
          }          

          var      imgSrc = element.imgSrc 

          if(imgSrc===""){
          imgSrc = "default_product.png";
            }

          var nameProduct = element.name_product
          var       price = element.price

          var tbodyProductsEl  = document.getElementById('tbodyProducts');

          if(tbodyProductsEl!=null){

          var dataProduct=` <tr id="trDetailProduct`+idProduct+`" class="border border-dark fw-bold" 
                              data-idproduct="`+idProduct+`"
                              onclick="">
                              
                              <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+idProduct+`</td>                               

                              <td class=" text text-center border border-dark border-1">            
                                <img class="img img-fluid imgProduct"  
                                src="/uploads/products/`+imgSrc+`"
                                width="70px">
                              </td>

                              <td class=" text text-center border border-dark border-1">`+nameProduct+`</td>
                              <td class=" text text-center border border-dark border-1">`+price+`</td>            
                            </tr>            
                          `

              tbodyProductsEl.innerHTML+=dataProduct;
          }

          })//data.forEach

    }//status==200  

  }//xhr.onload

  xhr.send();   

}//displayProducts  

function pickProduct(idProduct){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','pickProduct.php?idProduct='+idProduct,true);

  xhr.onload = function() {

    if(xhr.status==200){

    var  data =  JSON.parse(this.response);
    
    //console.log(data);
    
  
    var     idUser = data.idUser;
    var   idTicket = data.idTicket;

    displayTickets(idUser)
    displayTicket(idTicket);
   
    }//status==200

  }//function

  xhr.send();
   
}//pickProduct

// >  98 "Enter"
// > 195 btnradio1
// > 406 function setCurrentTable(tableName) {
// > 423 function getTableRows(tableName) {
// > 440 function getRowId(row, tableName) {
// > 460 function selectFirstRow(tableName) {
// > 471 function highlightRow(tableName, id) {
// > 612 function displayTickets(idUser){