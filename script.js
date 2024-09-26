const contactForm = document.getElementById('contact-form');
const contactsContainer = document.getElementById('contacts-container');
const searchInput = document.getElementById('search-input');

let contacts = [];

function addContact(name, phone, email) {
  if (name.trim() === '' || phone.trim() === '' || email.trim() === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }
  contacts.push({ name, phone, email });
  displayContacts();
  contactForm.reset();
  saveContacts();
}

function displayContacts(filteredContacts = contacts) {
  contactsContainer.innerHTML = '';

  filteredContacts.forEach((contact, index) => {
    const contactItem = document.createElement('li');
    contactItem.innerHTML = `
            <span>${contact.name}</span>
            <span>${contact.phone}</span>
            <span>${contact.email}</span>
            <button class="edit-contact" data-index="${index}">Editar</button>
            <button class="delete-contact" data-index="${index}">Excluir</button>
        `;
    contactsContainer.appendChild(contactItem);
  });

  addEditDeleteEventListeners();
}

function addEditDeleteEventListeners() {
  contactsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-contact')) {
      editContact(event);
    } else if (event.target.classList.contains('delete-contact')) {
      deleteContact(event);
    }
  });
}

function editContact(event) {
  const index = parseInt(event.target.dataset.index);
  const contact = contacts[index];

  document.getElementById('name').value = contact.name;
  document.getElementById('phone').value = contact.phone;
  document.getElementById('email').value = contact.email;

  const addButton = document.getElementById('add-contact');
  addButton.textContent = 'Salvar Alterações';
  addButton.removeEventListener('click', addContact);
  addButton.addEventListener('click', () => {
    contacts[index] = { 
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
    };
    displayContacts();
    contactForm.reset();
    addButton.textContent = 'Adicionar Contato';
    addButton.addEventListener('click', addContact); 
    saveContacts(); 
  });
}

function deleteContact(event) {
  const index = parseInt(event.target.dataset.index);
  contacts.splice(index, 1); 
  displayContacts(); 
  saveContacts(); 
}

const addButton = document.getElementById('add-contact');
addButton.addEventListener('click', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  addContact(name, phone, email);
});

window.addEventListener('load', () => {
  const storedContacts = localStorage.getItem('contacts');
  if (storedContacts) {
    contacts = JSON.parse(storedContacts);
    displayContacts();
  }
});

function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function filterContacts(searchTerm) {
  const filteredContacts = contacts.filter(contact => {
    const nameMatch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = contact.phone.includes(searchTerm); // Se o telefone for um número
    const emailMatch = contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || phoneMatch || emailMatch;
  });
  return filteredContacts;
}

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value;
  const filtered = filterContacts(searchTerm);
  displayContacts(filtered);
});

displayContacts();
