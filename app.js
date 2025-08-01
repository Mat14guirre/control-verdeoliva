let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

const gastoForm = document.getElementById('gasto-form');
const ventaForm = document.getElementById('venta-form');

const listaGastos = document.getElementById('lista-gastos');
const listaVentas = document.getElementById('lista-ventas');

const totalDia = document.getElementById('total-dia');         // Ventas hoy
const totalMes = document.getElementById('total-mes');         // Ventas mes
const totalGastosHoy = document.getElementById('gastos-dia');  // Gastos hoy
const totalGastosMes = document.getElementById('gastos-mes');  // Gastos mes
const gananciaNeta = document.getElementById('ganancia-neta'); // Ventas mes - Gastos mes

function guardarDatos() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
  localStorage.setItem('ventas', JSON.stringify(ventas));
}

function setearFechaHoy() {
  const hoy = new Date().toISOString().slice(0, 10);
  document.getElementById('gasto-fecha').value = hoy;
  document.getElementById('venta-fecha').value = hoy;
}

gastoForm.addEventListener('submit', e => {
  e.preventDefault();
  const fecha = document.getElementById('gasto-fecha').value;
  const descripcion = document.getElementById('gasto-descripcion').value;
  const monto = parseFloat(document.getElementById('gasto-monto').value);

  if (!fecha || !descripcion || isNaN(monto)) return;

  gastos.push({ fecha, descripcion, monto });
  guardarDatos();
  actualizarVista();
  gastoForm.reset();
  setearFechaHoy();
});

ventaForm.addEventListener('submit', e => {
  e.preventDefault();
  const fecha = document.getElementById('venta-fecha').value;
  const descripcion = document.getElementById('venta-descripcion').value;
  const monto = parseFloat(document.getElementById('venta-monto').value);

  if (!fecha || !descripcion || isNaN(monto)) return;

  ventas.push({ fecha, descripcion, monto });
  guardarDatos();
  actualizarVista();
  ventaForm.reset();
  setearFechaHoy();
});

function actualizarVista() {
  listaGastos.innerHTML = gastos.map(g => `<li>${g.fecha} - ${g.descripcion}: $${g.monto.toFixed(2)}</li>`).join('');
  listaVentas.innerHTML = ventas.map(v => `<li>${v.fecha} - ${v.descripcion}: $${v.monto.toFixed(2)}</li>`).join('');

  const hoy = new Date().toISOString().slice(0, 10);
  const mesActual = new Date().toISOString().slice(0, 7);

  const vendidoHoy = ventas
    .filter(v => v.fecha === hoy)
    .reduce((acc, v) => acc + v.monto, 0);

  const vendidoMes = ventas
    .filter(v => v.fecha.slice(0, 7) === mesActual)
    .reduce((acc, v) => acc + v.monto, 0);

  const gastadoHoy = gastos
    .filter(g => g.fecha === hoy)
    .reduce((acc, g) => acc + g.monto, 0);

  const gastadoMes = gastos
    .filter(g => g.fecha.slice(0, 7) === mesActual)
    .reduce((acc, g) => acc + g.monto, 0);

  const ganancia = vendidoMes - gastadoMes;

  totalDia.textContent = `$${vendidoHoy.toFixed(2)}`;
  totalMes.textContent = `$${vendidoMes.toFixed(2)}`;
  totalGastosHoy.textContent = `$${gastadoHoy.toFixed(2)}`;
  totalGastosMes.textContent = `$${gastadoMes.toFixed(2)}`;
  gananciaNeta.textContent = `$${ganancia.toFixed(2)}`;
}

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

window.addEventListener('load', () => {
  actualizarVista();
  setearFechaHoy();
});