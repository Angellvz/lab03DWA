const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

const cursos = [
  {
    id: 1,
    nombre: 'Java',
    precio: 1200
  },
  {
    id: 2,
    nombre: 'PHP',
    precio: 800
  },
  {
    id: 3,
    nombre: '.NET',
    precio: 1500
  }
];

const modulos = [
  {
    id: 1,
    nombre: 'Básico'
  },
  {
    id: 2,
    nombre: 'Intermedio'
  },
  {
    id: 3,
    nombre: 'Avanzado'
  }
];

app.get('/', (req, res) => {
  res.render('paso1', { cursos });
});

app.post('/paso2', (req, res) => {
  const cursoId = parseInt(req.body.curso);
  const curso = cursos.find(c => c.id === cursoId);
  res.render('paso2', { curso, modulos });
});

app.post('/paso3', (req, res) => {
  const cursoId = parseInt(req.body.curso);
  const curso = cursos.find(c => c.id === cursoId);
  const modulosSeleccionados = req.body.modulos;
  const pago = req.body.pago;

  let subtotal = 0;
  let descuento = 0;
  let total = 0;

  if (curso) {
    subtotal = curso.precio;
    total = subtotal;

    if (pago === 'efectivo') {
      descuento = subtotal * 0.1;
      total = subtotal - descuento;
    }

    modulosSeleccionados.forEach(m => {
      const modulo = modulos.find(mod => mod.id === parseInt(m));
      if (modulo) {
        subtotal += modulo.precio;
        total += modulo.precio;
      }
    });

    // Almacenamos la información de la matrícula en la sesión
    req.session.matricula = {
      curso,
      modulosSeleccionados,
      formaPago: pago,
      subtotal,
      descuento,
      totalPagar: total
    };
    res.render('paso3', { curso, modulos });
    // Redireccionamos a la página de confirmación
    res.redirect('/confirmacion');
  } else {
    res.redirect('/');
  }
});


app.post('/confirmacion', (req, res) => {
  const formaPago = req.body.formaPago;
  const matricula = req.session.matricula;
  matricula.formaPago = formaPago;
  if (formaPago === 'efectivo') {
    matricula.totalPagar *= 0.9;
  }
  res.render('confirmacion', { matricula });
});



app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
