document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("form-reserva");
    const listaTurnos = document.getElementById("lista-turnos");
    const horaSelect = document.getElementById("hora");
    const fechaInput = document.getElementById("fecha");
    const adminPanel = document.getElementById("admin-panel");

    // Horarios permitidos
    const horariosDisponibles = [
        "09:00", "09:30", "10:00", "10:30", "11:00",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00", "18:30"
    ];

    // Llena el select con los horarios
    horariosDisponibles.forEach(hora => {
        let option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        horaSelect.appendChild(option);
    });

    // Evitar selección de miércoles y domingos
    fechaInput.addEventListener("input", function() {
        const fecha = new Date(this.value);
        const dia = fecha.getDay();
        if (dia === 3 || dia === 0) {  // 3 = Miércoles, 0 = Domingo
            alert("No se pueden agendar turnos los miércoles ni domingos.");
            this.value = "";
        }
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const telefono = document.getElementById("telefono").value;
        const servicio = document.getElementById("servicio").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;

        if (!nombre || !telefono || !fecha || !hora) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

        // Verificar si el turno ya está ocupado
        const turnoOcupado = turnos.find(turno => turno.fecha === fecha && turno.hora === hora);
        if (turnoOcupado) {
            alert("Este horario ya está reservado. Por favor, elige otro.");
            return;
        }

        const nuevoTurno = { nombre, telefono, servicio, fecha, hora };
        turnos.push(nuevoTurno);
        localStorage.setItem("turnos", JSON.stringify(turnos));

        alert("Turno reservado con éxito.");
        form.reset();
    });

    // Mostrar la agenda solo si se ingresa la clave correcta
    const clave = prompt("Si eres el dueño, ingresa la clave para ver los turnos:");
    if (clave === "admin123") {
        adminPanel.style.display = "block";
        mostrarTurnos();
    }

    function mostrarTurnos() {
        listaTurnos.innerHTML = "";
        let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
        turnos.forEach(turno => {
            let li = document.createElement("li");
            li.textContent = `${turno.fecha} - ${turno.hora} | ${turno.servicio} - ${turno.nombre} (${turno.telefono})`;
            listaTurnos.appendChild(li);
        });
    }
});
