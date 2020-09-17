const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");
const descriptionInput = document.querySelector("#description");
const form = document.querySelector(".form");
const appointmentsContainer = document.querySelector("#appointments");
let editing;

eventListeners();

class Appointment {
  constructor() {
    this.appointments = [];
  }

  addAppointment(appointment) {
    this.appointments = [...this.appointments, appointment];
  }
  deleteAppointment(id) {
    this.appointments = this.appointments.filter(
      (appointment) => appointment.id !== id
    );
  }

  editAppointment(updatedAppointment) {
    this.appointments = this.appointments.map((appointment) =>
      appointment.id === updatedAppointment.id
        ? updatedAppointment
        : appointment
    );
  }
}

class UI {
  printAlert(message, type) {
    const divMsg = document.createElement("div");

    if (type === "warning") {
      divMsg.classList.add("warning");
    }
    divMsg.textContent = message;
    form.appendChild(divMsg);

    setTimeout(() => {
      divMsg.remove();
    }, 3000);
  }

  printAppointments({ appointments }) {
    this.cleanHTML();

    appointments.forEach((appointment) => {
      const { name, phone, date, time, description, id } = appointment;

      const divAppointment = document.createElement("div");
      divAppointment.classList.add("appointment");
      divAppointment.dataset.id = id;
      const nameParagraph = document.createElement("h2");
      nameParagraph.textContent = name;
      divAppointment.appendChild(nameParagraph);

      const phoneParagraph = document.createElement("p");
      phoneParagraph.innerHTML = `<span class="bold">Teléfono: </span> ${phone}`;
      divAppointment.appendChild(phoneParagraph);

      const dateParagraph = document.createElement("p");
      dateParagraph.innerHTML = `<span class="bold">Fecha: </span> ${date}`;
      divAppointment.appendChild(dateParagraph);

      const timeParagraph = document.createElement("p");
      timeParagraph.innerHTML = `<span class="bold">Hora: </span> ${time}`;
      divAppointment.appendChild(timeParagraph);

      const descriptionParagraph = document.createElement("p");
      descriptionParagraph.innerHTML = `<span class="bold">Descripción: </span> ${description}`;
      divAppointment.appendChild(descriptionParagraph);

      const divBtns = document.createElement("div");
      divBtns.classList.add("div-btns");

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete");
      deleteBtn.innerHTML = `Borrar Cita <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;
      deleteBtn.onclick = () => deleteAppointment(id);
      divBtns.appendChild(deleteBtn);

      const editBtn = document.createElement("button");
      editBtn.classList.add("edit");
      editBtn.innerHTML = `Editar Cita <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>`;
      editBtn.onclick = () => editAppointment(appointment);
      divBtns.appendChild(editBtn);

      divAppointment.appendChild(divBtns);

      appointmentsContainer.appendChild(divAppointment);
    });
  }

  cleanHTML() {
    while (appointmentsContainer.firstChild) {
      appointmentsContainer.removeChild(appointmentsContainer.firstChild);
    }
  }
}

const ui = new UI();

const adminAppointment = new Appointment();

function eventListeners() {
  nameInput.addEventListener("input", appointmentData);
  phoneInput.addEventListener("input", appointmentData);
  dateInput.addEventListener("input", appointmentData);
  timeInput.addEventListener("input", appointmentData);
  descriptionInput.addEventListener("input", appointmentData);
  form.addEventListener("submit", newAppointment);
}

const appointmentObj = {
  name: "",
  phone: "",
  date: "",
  time: "",
  description: "",
};

function appointmentData(e) {
  appointmentObj[e.target.name] = e.target.value;
}

function newAppointment(e) {
  e.preventDefault();
  const { name, phone, date, time, description } = appointmentObj;

  if (
    name === "" ||
    phone === "" ||
    date === "" ||
    time === "" ||
    description === ""
  ) {
    ui.printAlert("Todos los campos son obligatorios", "warning");
    return;
  }

  if (editing) {
    ui.printAlert("Cita editada correctamente");

    adminAppointment.editAppointment({ ...appointmentObj });
    form.querySelector("button").textContent = "Crear Cita";
    editing = false;
  } else {
    appointmentObj.id = Date.now();

    adminAppointment.addAppointment({ ...appointmentObj });

    ui.printAlert("Cita agregada correctamente");
  }

  resetObj();

  form.reset();

  ui.printAppointments(adminAppointment);
}

function resetObj() {
  appointmentObj.name = "";
  appointmentObj.phone = "";
  appointmentObj.date = "";
  appointmentObj.time = "";
  appointmentObj.description = "";
}

function deleteAppointment(id) {
  adminAppointment.deleteAppointment(id);
  ui.printAlert("La cita fue eliminada correctamente.");
  ui.printAppointments(adminAppointment);
}

function editAppointment(appointment) {
  const { name, phone, date, time, description, id } = appointment;

  nameInput.value = name;
  phoneInput.value = phone;
  dateInput.value = date;
  timeInput.value = time;
  descriptionInput.value = description;

  appointmentObj.name = name;
  appointmentObj.phone = phone;
  appointmentObj.date = date;
  appointmentObj.time = time;
  appointmentObj.description = description;
  appointmentObj.id = id;

  form.querySelector("button").textContent = "Guardar Cambios";
  editing = true;
}
