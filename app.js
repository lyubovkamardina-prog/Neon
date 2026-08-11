
const $ = id => document.getElementById(id)

function n(v){
return Math.max(0, parseFloat(v || 0) || 0)
}

function money(v){
return Math.round(v).toLocaleString('ru-RU') + ' ₽'
}

function round50(v){
return Math.ceil(v / 50) * 50
}

function plywoodPrice(w,h){
const area = ((w + 4) / 100) * ((h + 4) / 100)
return area * 350
}

function signPower(m){
return Math.round((m * 1.1) * 9)
}

function autoPS(m){
if(m < 4.5) return {power:60, category:'Стандарт', price:500}
if(m <= 7.5) return {power:100, category:'Стандарт', price:650}
if(m <= 12.5) return {power:150, category:'Стандарт', price:700}
if(m <= 15) return {power:200, category:'Стандарт', price:800}
return {power:400, category:'Стандарт', price:1150}
}

function outdoorPS(m){
if(m <= 7.5) return {power:100, category:'Уличный', price:1070}
if(m <= 12.5) return {power:150, category:'Уличный', price:1350}
return {power:200, category:'Уличный', price:1600}
}

function updatePlywood(){
if(!$('plywood').checked){
$('plywoodInfo').classList.add('hidden')
return
}

const price = plywoodPrice(
n($('width').value),
n($('height').value)
)

$('plywoodInfo').classList.remove('hidden')
$('plywoodInfo').innerHTML = 'Стоимость фанеры: ' + money(price)
}

$('width').oninput = updatePlywood
$('height').oninput = updatePlywood
$('plywood').onchange = updatePlywood

$('manualPS').onchange = ()=>{
$('manualPSBox').classList.toggle('hidden', !$('manualPS').checked)
}

$('extraToggle').onchange = ()=>{
$('extraWireBox').classList.toggle('hidden', !$('extraToggle').checked)
}

$('packaging').onchange = ()=>{
$('manualPackagingBox').classList.toggle('hidden', $('packaging').value !== 'manual')
}

$('workType').onchange = ()=>{
$('manualWorkBox').classList.toggle('hidden', $('workType').value !== 'manual')
}

$('toggleSummary').onclick = ()=>{
$('details').classList.toggle('open')
}

$('resetBtn').onclick = ()=>{
location.reload()
}

$('addExtraBtn').onclick = ()=>{
const row = document.createElement('div')
row.className = 'extraRow'

row.innerHTML = `
<input type="text" class="extraName" placeholder="Название">
<input type="number" min="0" class="extraPrice" placeholder="Стоимость">
<button type="button" class="removeBtn">Удалить</button>
`

row.querySelector('.removeBtn').onclick = ()=> row.remove()

$('extras').appendChild(row)
}

$('calcBtn').onclick = ()=>{

const neon = n($('neon').value)
const reserve = neon * 1.1

const neonCost = reserve * 180

const width = n($('width').value)
const height = n($('height').value)

const acrylic = width * height * 0.39

const millingInput = n($('milling').value)
const milling = millingInput > 0
? Math.max(millingInput * 80, 500)
: 0

let psData
let psPrice = 0

if($('manualPS').checked){

psPrice = n($('psPrice').value)

if(psPrice <= 0){
alert('Введите стоимость ручного БП')
return
}

psData = {
power: $('psPower').value || '—',
category:'Ручной'
}

}else{

psData = $('outdoor').checked
? outdoorPS(reserve)
: autoPS(reserve)

psPrice = psData.price
}

let wires = 170

if($('extraToggle').checked){
wires += n($('extraWires').value) * 40
}

const mounts = $('mounts').checked ? 200 : 0

const packaging = $('packaging').value === 'manual'
? n($('manualPackaging').value)
: n($('packaging').value)

const plywood = $('plywood').checked
? plywoodPrice(width,height)
: 0

const sealing = n($('sealing').value)

const deliveryMe = n($('deliveryMe').value)
const deliveryClient = n($('deliveryClient').value)

let extras = 0

document.querySelectorAll('.extraRow').forEach(row=>{
extras += n(row.querySelector('.extraPrice').value)
})

const ads = 1250
const gas = 400

const base =
neonCost +
acrylic +
milling +
psPrice +
wires +
mounts +
packaging +
plywood +
sealing +
deliveryMe +
deliveryClient +
extras +
ads +
gas

const design = n($('design').value)

let work = 0

if($('workType').value === 'manual'){
work = n($('manualWork').value)
}else{
const coef = n($('workType').value)
work = (base * coef) - base
}

let manager = 0

if($('manager').checked){
manager = (base + work) * 0.05
$('managerLine').classList.remove('hidden')
}else{
$('managerLine').classList.add('hidden')
}

const finalPrice =
base +
work +
design +
manager

const sbp = round50(finalPrice)
const legal = round50(sbp * 1.06)

$('costBase').innerHTML = money(base)
$('workResult').innerHTML = money(work)
$('designResult').innerHTML = money(design)
$('managerResult').innerHTML = money(manager)
$('sbp').innerHTML = money(sbp)
$('legal').innerHTML = money(legal)

$('details').innerHTML = `
<div><span>Неон</span><span>${money(neonCost)}</span></div>
<div><span>Акрил</span><span>${money(acrylic)}</span></div>
<div><span>Фрезеровка</span><span>${money(milling)}</span></div>
<div><span>Блок питания</span><span>${money(psPrice)}</span></div>
<div><span>Провода</span><span>${money(wires)}</span></div>
<div><span>Крепления</span><span>${money(mounts)}</span></div>
<div><span>Упаковка</span><span>${money(packaging)}</span></div>
<div><span>Фанера</span><span>${money(plywood)}</span></div>
<div><span>Герметизация</span><span>${money(sealing)}</span></div>
<div><span>Доставка до меня</span><span>${money(deliveryMe)}</span></div>
<div><span>Доставка до клиента</span><span>${money(deliveryClient)}</span></div>
<div><span>Допы</span><span>${money(extras)}</span></div>
<div><span>Реклама</span><span>${money(ads)}</span></div>
<div><span>Бензин</span><span>${money(gas)}</span></div>
`

$('powerInfo').innerHTML = `
<div class="powerLine"><span>Мощность вывески</span><b>${signPower(neon)}W</b></div>
<div class="powerLine"><span>Выбранный БП</span><b>${psData.power}W</b></div>
<div class="powerLine"><span>Категория</span><b>${psData.category}</b></div>
`

$('result').classList.remove('hidden')
// строка для копирования в Google Таблицу
window.lastExport = [ 
new Date().toLocaleDateString('ru-RU'), 
$('client').value || '', 
$('city').value || '', 
neon, 
reserve.toFixed(1),
Math.round(neonCost),
millingInput,
Math.round(milling),
`${width}×${height}`,
Math.round(acrylic), 
psData.category, 
psData.power + 'W', 
psPrice, wires, mounts, 
packaging, 
plywood ? Math.round(plywood) : 0, 
sealing, deliveryMe, 
deliveryClient, 
design, extras, 
Math.round(work), 
Math.round(manager), 
ads, 
gas, 
Math.round(base), 
sbp, 
legal
].join('\t')
}
$('copyBtn').onclick = async () => { 
if(!window.lastExport){
alert('Сначала выполните расчет') 
return 
} 
await navigator.clipboard.writeText(window.lastExport) 
alert('Строка скопирована для Google Таблицы') 
}
if('serviceWorker' in navigator){
navigator.serviceWorker.register('./sw.js')
}
