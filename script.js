let tasks = JSON.parse(localStorage.getItem("@to-do-list")) || [];
let body = document.body;
const maxNumber = 5;

document.addEventListener('keyup', function addTodoTask(e) {
  let inputTodo = document.getElementById('input-todo').value;

  if (e.key === 'Enter') {

    if(inputTodo.trim() === ""){
      alert('please enter some task');
      return;
    }
    
    if (tasks.length >= maxNumber) { // permite que exista apenas até 5 tarefas registradas
      alert("You have reached the maximum number of added tasks.");
      inputTodo.removeEventListener('keyup', addTodoTask); // remove o event listener
      return;
    }
      if (!tasks.includes(inputTodo)) { // verifica se a tarefa já existe no array - se for falsa então adiciona 
        tasks.push(inputTodo);
        console.log(tasks);
        renderTasks();
        saveData();
      } else {
        alert('Task already exists');
      }
   
  } 
  saveData();
  
});


function renderTasks() {
  let conteudo = document.querySelector('.conteudo');
  conteudo.innerHTML = ''; // limpa o conteúdo atual para renderizar as tarefas sem repetir
  
  tasks.map((todo) => { // map function pra utilizar todos os dados guardados no array principal e retornalos no "todo"
    document.getElementById('input-todo').value = '';



    // nova div-container para cada tarefa
    let divContainer = document.createElement('div');
    divContainer.className = 'div-container';
    divContainer.id = 'id-container';

    // criando input do tipo checkbox
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'input-group';
    input.id = 'input-id'


    let icon = document.createElement('i');
    icon.className = "fa-solid fa-trash icon hide-icon";
    icon.id = 'icon';
    icon.setAttribute('onclick', `deleteTask(this.parentNode)`); //atribuo a função ao meu icone (trash);

    // criando texto que vai servir de label para nosso input
    let p = document.createElement('p');
    p.textContent = todo;


    // funcao que adiciona o estilo line-thourgh ao texto(p) do input
    input.addEventListener("change", function() {
      if (this.checked) {
        p.style.textDecoration = "line-through";

      } else {
        p.style.textDecoration = "none";

      }
      saveData();
    });

    // adiciono os elementos criados a div-container
    divContainer.appendChild(input);
    divContainer.appendChild(p);
    divContainer.appendChild(icon);

    // Adicione a nova div-container à div conteúdo
    conteudo.appendChild(divContainer);

    // tira o display none da div-container que está vazia
    let hide = document.getElementById('tasks-div');
    hide.classList.remove('hide');

    // adiciona a quantidade de itens a cada vez que é adicionado um 
    let total = document.getElementById('total-todo');
    total.textContent = tasks.length + ' items';

    
  });
}



let clearALL = document.getElementById('clear-todo');
clearALL.addEventListener('click', function () {
  let conteudo = document.querySelector('.conteudo');
  conteudo.innerHTML = ''; //zerando o conteudo da div pai 
  tasks = []; //zerando array 
  let total = document.getElementById('total-todo');
  total.textContent = '0 items'; //zerando quantidade de items dentro do array pai
  saveData();
});


let showCompleted = document.getElementById('showCompleted');
showCompleted.addEventListener('click', function () {
  let inputs = [...document.querySelectorAll('#input-id')]; //transformos os meus inputs em array
  let divContainers = [...document.querySelectorAll('#id-container')]; //transformos os minhas div's em array
  let conteudo = document.querySelector('.conteudo');
  let total = document.getElementById('total-todo');
  let soma = 0;

  let isChecked = false; // variável de controle

  inputs.map((inputMap,i ) => { //metodo map passando o elemento e o index
    let icons = [...document.querySelectorAll('#icon')];
    if (inputMap.checked) { //input marcado 
      
      isChecked = true;
      divContainers[i].style.display = 'flex';
      soma++; 
      total.textContent = soma + " items";
      icons.map(icon => {
        icon.style.display = 'none';
        return ;
      });

    } else {
      divContainers[i].style.display = 'none';
      icons.map(icon => {
        icon.style.display = 'flex';
        return ;
      });
    }
  });

   //ira criar uma div-container para alertar o usuario
   let divContainer = document.getElementById('remove-container');
   if (!isChecked) {// = false
     if (divContainer) {
       let p = divContainer.querySelector('p');
       p.textContent = "you don't have any tasks completed"; 
     } else {
       divContainer = document.createElement('div');
       divContainer.className = 'div-container';
       divContainer.id = 'remove-container';
       let p = document.createElement('p');
       p.textContent = "you don't have any tasks completed";
       divContainer.appendChild(p);
       conteudo.appendChild(divContainer);
     }
     return;
   }
   

});

let showAll = document.getElementById('showall');
showAll.addEventListener('click', function () {
  let divContainers = [...document.querySelectorAll('#id-container')];
  let icons = [...document.querySelectorAll('#icon')];
  let total = document.getElementById('total-todo');
  total.textContent = divContainers.length + " items";
  divContainers.map(div => {  //usando a função map para retornar todos as divs
    div.style.display = 'flex';
    icons.map(icon => {
      icon.style.display = 'flex';
      return false;
    });
  });

  let removeDivContainer = document.querySelector('#remove-container');
  const exist = document.body.contains(removeDivContainer);
  //variavel que vai verificar se o documento possui a div com id: remove-container

  if (exist) { // se exist(true) vai aplicar o remove
    removeDivContainer.remove();
    return;
  }
});

let showActive = document.getElementById('showActive');
showActive.addEventListener('click',function() {
  let inputs = [...document.querySelectorAll('#input-id')]; //transformos os meus inputs em array
  let divContainers = [...document.querySelectorAll('#id-container')]; //transformos os minhas div's em array
  let icons = [...document.querySelectorAll('#icon')];
  let total = document.getElementById('total-todo');
  let soma = 0;
  let divRemove = document.getElementById('remove-container');

  const exist = document.body.contains(divRemove);

  inputs.map((inputMap , i) =>{ // metodo map passando o elemento e o index
    if (!inputMap.checked) { //se o input não estiver marcado
      divContainers[i].style.display = 'flex';
      total.textContent = divContainers.length + " Items";
      icons.map(icon => {
        icon.style.display = 'none';
        return false;
      });
      if(exist){
        divRemove.style.display = 'none';
      }
      soma++;
      total.textContent = soma + ' items';
      
    } else {
      divContainers[i].style.display = 'none';
    }
    
  });
});

function deleteTask(el) {
  let container = el.closest('.div-container');
  let p = container.querySelector('p');
  let index = tasks.indexOf(p.textContent);// pega o index do texto da tarefa
  tasks.splice(index, 1); // Remove a tarefa correspondente do array tasks
  container.remove();//exclui o container (div-container)

  let totalTodo = document.getElementById('total-todo');
  totalTodo.textContent = tasks.length + ' items';
  saveData();
}

function saveData() {
  localStorage.setItem("@to-do-list", JSON.stringify(tasks));
}

renderTasks();