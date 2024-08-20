document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa
    function initializeMap(latitude, longitude) {
        const map = L.map('map').setView([latitude, longitude], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup('Usted está aquí')
            .openPopup();
    }

    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                initializeMap(latitude, longitude);
            },
            (error) => {
                console.error('Error al obtener la ubicación:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Ubicación no disponible',
                    text: 'No se pudo obtener la ubicación del usuario. El mapa no se mostrará.'
                });
                // Inicializar el mapa en una ubicación predeterminada si la ubicación del usuario no está disponible
                initializeMap(40.7128, -74.0060); // Nueva York como ubicación predeterminada
            }
        );
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Geolocalización no soportada',
            text: 'Tu navegador no soporta la geolocalización. El mapa no se mostrará.'
        });
        // Inicializar el mapa en una ubicación predeterminada
        initializeMap(40.7128, -74.0060); // Nueva York como ubicación predeterminada
    }

    // Función de validación
    function validateForm(email, name, dateOfBirth, gender, phone, website, message) {
        let errors = [];

        if (!email) {
            errors.push('El correo electrónico es obligatorio.');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push('El correo electrónico no es válido.');
        }

        if (!name) errors.push('El nombre es obligatorio.');
        if (!dateOfBirth) errors.push('La fecha de nacimiento es obligatoria.');
        if (!gender) errors.push('El género es obligatorio.');
        if (!phone) errors.push('El teléfono es obligatorio.');
        else if (!/^\+?[1-9]\d{1,14}$/.test(phone)) errors.push('El número de teléfono no es válido.');

        if (!website) errors.push('El sitio web es obligatorio.');
        else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(website)) errors.push('La URL del sitio web no es válida.');

        if (!message) errors.push('El mensaje es obligatorio.');

        return errors;
    }

    // Función para mostrar mensajes de error
    function showErrorMessages(errors) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errors.join(' ')
        });
    }

    // Función para mostrar mensaje de éxito
    function showSuccessMessage() {
        Swal.fire({
            icon: 'success',
            title: 'Formulario enviado',
            text: 'Tu mensaje ha sido enviado con éxito.',
        });
    }

    // Validación del formulario
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const name = document.getElementById('name').value.trim();
        const dateOfBirth = document.getElementById('date-of-birth').value.trim();
        const gender = document.getElementById('gender').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const website = document.getElementById('website').value.trim();
        const message = document.getElementById('message').value.trim();

        const errors = validateForm(email, name, dateOfBirth, gender, phone, website, message);

        if (errors.length > 0) {
            showErrorMessages(errors);
        } else {
            showSuccessMessage();
            // Aquí podrías agregar código para enviar el formulario a un servidor
        }
    });

    // Función para validar campos individualmente
    function validateField(input) {
        const value = input.value.trim();
        let error = '';

        switch (input.id) {
            case 'email':
                if (!value) {
                    error = 'El correo electrónico es obligatorio.';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'El correo electrónico no es válido.';
                }
                break;
            case 'phone':
                if (!value) {
                    error = 'El teléfono es obligatorio.';
                } else if (!/^\+?[1-9]\d{1,14}$/.test(value)) {
                    error = 'El número de teléfono no es válido.';
                }
                break;
            case 'website':
                if (!value) {
                    error = 'El sitio web es obligatorio.';
                } else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(value)) {
                    error = 'La URL del sitio web no es válida.';
                }
                break;
            default:
                if (!value) {
                    error = `${input.previousElementSibling.textContent} es obligatorio.`;
                }
                break;
        }

        // Mostrar mensaje de error debajo del campo
        const errorSpan = document.querySelector(`#${input.id} + .error-message`);
        if (errorSpan) {
            if (error) {
                errorSpan.textContent = error;
                errorSpan.style.display = 'block';
            } else {
                errorSpan.textContent = ''; // Cambiado de innerHTML a textContent
                errorSpan.style.display = 'none';
            }
        }
    }

    // Añadir validación en tiempo real a cada campo
    const fields = document.querySelectorAll('#contact-form input, #contact-form textarea');
    fields.forEach(field => {
        field.addEventListener('input', () => validateField(field));
    });
});
