(function ($) {
    
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {
  
            event.preventDefault();
  
            let hash = this.hash;
  
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
    

    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);


window.onload = function() {
    $.ajax({
      url: "https://api.sampleapis.com/coffee/hot",
      method: "GET",
      success: function(data) {
       let midata = data.slice(0,10)
        const menuContainer = $("#menu-container");
        menuContainer.empty();

        midata.forEach(item => {
          const description = item.description.substring(0, 40) + (item.description.length > 40 ? "..." : "");
          menuContainer.append(`
            <div class="col-lg-6">
              <div class="row align-items-center mb-5 menu-item" data-img="${item.image}" data-title="${item.title}" data-description="${item.description}" data-ingredients="${item.ingredients}">
                <div class="col-4 col-sm-3">
                  <img class="w-100 rounded-circle mb-3 mb-sm-0 menu-img" src="${item.image}" alt="">
                </div>
                <div class="col-8 col-sm-9">
                  <h4 class="mb-0">${item.title}</h4>
                  <p class="text-muted mb-0">${description}</p>
                </div>
              </div>
            </div>
          `);
        });

        // Agrega un controlador de eventos de clic a cada elemento de menú
        $(".menu-item").click(function() {
          const img = $(this).data("img");
          const title = $(this).data("title");
          const description = $(this).data("description");
          const ingredients = $(this).data("ingredients");

          console.log("Imagen:", img);
          console.log("Título:", title);
          console.log("Descripción:", description);
          console.log("Ingredientes:", ingredients);

          Swal.fire({
            html: `
              <img class="w-100 mb-3" src="${img}" alt="">
              <h3 class="mb-3">${title}</h3>
              <p>${description}</p>
              <p>Ingredientes: ${ingredients}</p>
            `,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "Imprimir PDF",
            cancelButtonText: "Cerrar",
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-secondary ml-3"
            },
            preConfirm: function() {
              // Agrega una función para generar el archivo PDF
              generarPDF(title, description, ingredients, img)
              console.log("Generando PDF...");
            }
          });
        });
      },
      error: function(error) {
        console.log(error);
      }
    });
  };


  function splitTextIntoLines(text) {
    const lines = [];
    const regex = /.{1,47}(\s|-|$)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      lines.push(match[0].trim());
    }
    return lines;
  }


  function generarPDF(nombre, descripcion, ingredientes, imagen) {
    // Crea un objeto jsPDF
    const doc = new jsPDF();
  
    // Carga la imagen
    const img = new Image();
    img.onload = function() {
      // Agrega la imagen
      doc.addImage(img, "PNG", 20, 20, 170, 170);
      // Agrega el título
      doc.setFontSize(30);
      doc.setTextColor(0);
      doc.text(nombre, doc.internal.pageSize.getWidth() / 2, 220, null, null, "center");
      // Agrega la descripción y los ingredientes
      doc.setFontSize(16);
      doc.setTextColor(50);

      const lines = splitTextIntoLines(descripcion);
      let y = 270;
      lines.forEach(function (line) {
        doc.text(line, 20, y);
        y += 10;
      });

      doc.text(ingredientes, 20, 250);
      // Descarga el archivo PDF
      doc.save(`${nombre}.pdf`);
    };
    img.src = imagen;
  }





const form = document.querySelector('#contact-form');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  validateForm();
});

function validateForm() {
  const formData = {
    nombre: form.querySelector('[name="nombre"]').value,
    email: form.querySelector('[name="email"]').value,
    asunto: form.querySelector('[name="asunto"]').value,
    mensaje: form.querySelector('[name="mensaje"]').value
  };

  const validationRules = {
    nombre: {
      presence: {
        message: "es obligatorio"
      },
      length: {
        minimum: 3,
        message: "debe tener al menos 3 caracteres"
      }
    },
    email: {
      presence: {
        message: "es obligatorio"
      },
      email: {
        message: "no es válido"
      }
    },
    asunto: {
      presence: {
        message: "es obligatorio"
      },
      length: {
        minimum: 4,
        message: "debe tener al menos 4 caracteres"
      }
    },
    mensaje: {
      presence: {
        message: "es obligatorio"
      },
      length: {
        minimum: 5,
        message: "debe tener al menos 5 caracteres"
      }
    }
  };

  const validationErrors = validate(formData, validationRules);

  if (validationErrors) {
    let errorMessages = '';
    Object.keys(validationErrors).forEach(function (field) {
      const fieldErrors = validationErrors[field];
      fieldErrors.forEach(function (errorMessage) {
        errorMessages += ` ${errorMessage}<br>`;
      });
    });
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      html: errorMessages
    });
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'El mensaje fue enviado correctamente',
    });
  }
}