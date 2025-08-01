let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

const gastoForm = document.getElementById('gasto-form');
const ventaForm = document.getElementById('venta-form');

const listaGastos = document.getElementById('lista-gastos');
const listaVentas = document.getElementById('lista-ventas');

const totalDia = document.getElementById('total-dia');
const totalMes = document.getElementById('total-mes');
const totalGastos = document.getElementById('total-gastos');

// Guardar en localStorage
function guardarDatos() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
  localStorage.setItem('ventas', JSON.stringify(ventas));
}

// Establecer fecha de hoy como valor por defecto en los campos
function setearFechaHoy() {
  const hoy = new Date().toISOString().slice(0, 10);
  document.getElementById('gasto-fecha').value = hoy;
  document.getElementById('venta-fecha').value = hoy;
}

// Agregar gasto
gastoForm.addEventListener('submit', e => {
  e.preventDefault();
  const fecha = document.getElementById('gasto-fecha').value;
  const descripcion = document.getElementById('gasto-descripcion').value;
  const monto = parseFloat(document.getElementById('gasto-monto').value);

  gastos.push({ fecha, descripcion, monto });
  guardarDatos();
  actualizarVista();
  gastoForm.reset();
  setearFechaHoy();
});

// Agregar venta
ventaForm.addEventListener('submit', e => {
  e.preventDefault();
  const fecha = document.getElementById('venta-fecha').value;
  const descripcion = document.getElementById('venta-descripcion').value;
  const monto = parseFloat(document.getElementById('venta-monto').value);

  ventas.push({ fecha, descripcion, monto });
  guardarDatos();
  actualizarVista();
  ventaForm.reset();
  setearFechaHoy();
});

// Actualizar vista
function actualizarVista() {
  // Mostrar gastos
  listaGastos.innerHTML = gastos.map(g => `<li>${g.fecha} - ${g.descripcion}: $${g.monto}</li>`).join('');
  // Mostrar ventas
  listaVentas.innerHTML = ventas.map(v => `<li>${v.fecha} - ${v.descripcion}: $${v.monto}</li>`).join('');

  // Totales
  const hoy = new Date().toISOString().slice(0, 10);
  const mesActual = new Date().toISOString().slice(0, 7); // YYYY-MM

  const totalVendidoHoy = ventas
    .filter(v => v.fecha === hoy)
    .reduce((acc, v) => acc + v.monto, 0);

  const totalVendidoMes = ventas
    .filter(v => v.fecha.slice(0, 7) === mesActual)
    .reduce((acc, v) => acc + v.monto, 0);

  const totalG = gastos.reduce((acc, g) => acc + g.monto, 0);

  totalDia.textContent = totalVendidoHoy.toFixed(2);
  totalMes.textContent = totalVendidoMes.toFixed(2);
  totalGastos.textContent = totalG.toFixed(2);
}

// Borrar todo
document.getElementById('borrar-todo').addEventListener('click', () => {
  const confirmar = confirm('¿Estás seguro de que querés borrar todos los datos?');
  if (confirmar) {
    gastos = [];
    ventas = [];
    localStorage.removeItem('gastos');
    localStorage.removeItem('ventas');
    actualizarVista();
    setearFechaHoy();
    alert('Datos borrados correctamente.');
  }
});

// Inicializar al cargar la página
window.addEventListener('load', () => {
  actualizarVista();
  setearFechaHoy();
});