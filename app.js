const STORAGE_KEY = "financeai-invoices-v1";
const seed = [
  {id:1,supplier:"ABC Supplies",number:"INV-1001",date:"2026-11-14",due:"2026-11-28",amount:12500,status:"Processed"},
  {id:2,supplier:"Coffee Roasters Co.",number:"INV-1000",date:"2026-11-13",due:"2026-11-27",amount:8750,status:"For Review"},
  {id:3,supplier:"Office Essentials",number:"INV-0999",date:"2026-11-12",due:"2026-11-26",amount:4200,status:"Processed"},
  {id:4,supplier:"Tech Solutions Inc.",number:"INV-0998",date:"2026-11-11",due:"2026-11-25",amount:15000,status:"Changes Requested"}
];
let invoices = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || seed;
const money = n => new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP"}).format(n);
const statusClass = s => s.replaceAll(" ","-");
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(invoices));render();}
function table(items){
 if(!items.length) return '<div class="empty">No invoices found.</div>';
 return `<table><thead><tr><th>Invoice</th><th>Supplier</th><th class="hide-mobile">Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>${items.map(x=>`<tr><td><strong>${escapeHtml(x.number)}</strong></td><td>${escapeHtml(x.supplier)}</td><td class="hide-mobile">${x.date||"—"}</td><td>${money(x.amount)}</td><td><span class="status ${statusClass(x.status)}">${x.status}</span></td></tr>`).join("")}</tbody></table>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(){
 const review=invoices.filter(x=>x.status==="For Review");
 document.getElementById("totalCount").textContent=invoices.length;
 document.getElementById("processedCount").textContent=invoices.filter(x=>x.status==="Processed").length;
 document.getElementById("reviewCount").textContent=review.length;
 document.getElementById("reviewBadge").textContent=review.length;
 document.getElementById("totalValue").textContent=money(invoices.reduce((a,x)=>a+Number(x.amount),0));
 document.getElementById("recentTable").innerHTML=table([...invoices].slice(-5).reverse());
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
 const f=document.getElementById("statusFilter")?.value||"";
 document.getElementById("invoiceTable").innerHTML=table(invoices.filter(x=>(!q||x.number.toLowerCase().includes(q)||x.supplier.toLowerCase().includes(q))&&(!f||x.status===f)).slice().reverse());
 document.getElementById("reviewList").innerHTML=review.length?review.map(x=>`<article class="review-card"><div><h3>${escapeHtml(x.supplier)} · ${escapeHtml(x.number)}</h3><p>Invoice date: ${x.date||"—"} · Due: ${x.due||"—"}</p><p><strong>${money(x.amount)}</strong> · Sample invoice record</p></div><div class="actions"><button class="btn secondary" onclick="requestChanges(${x.id})">Request changes</button><button class="btn primary" onclick="approve(${x.id})">Approve</button></div></article>`).join(""):'<div class="empty">Your review queue is clear.</div>';
}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300);}
function approve(id){const x=invoices.find(i=>i.id===id);if(x){x.status="Processed";save();showToast("Invoice marked as processed (demo only).");}}
function requestChanges(id){const x=invoices.find(i=>i.id===id);if(x){x.status="Changes Requested";save();showToast("Changes requested (demo only).");}}
window.approve=approve;window.requestChanges=requestChanges;
function go(view){document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));document.getElementById(view+"View").classList.remove("hidden");document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===view));document.getElementById("pageTitle").textContent={dashboard:"Dashboard",invoices:"Invoices",review:"Review Queue"}[view];render();}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.getElementById("searchInput").addEventListener("input",render);
document.getElementById("statusFilter").addEventListener("change",render);
const dialog=document.getElementById("invoiceDialog"), form=document.getElementById("invoiceForm");
function openDialog(){dialog.showModal();}
["newInvoiceTop","newInvoiceBtn"].forEach(id=>document.getElementById(id).addEventListener("click",openDialog));
document.getElementById("newInvoice").addEventListener("click",openDialog);
document.getElementById("closeDialog").addEventListener("click",()=>dialog.close());
document.getElementById("cancelDialog").addEventListener("click",()=>dialog.close());
form.addEventListener("submit",e=>{
 e.preventDefault();const d=new FormData(form);
 const item={id:Date.now(),supplier:d.get("supplier").trim(),number:d.get("number").trim(),date:d.get("date"),due:d.get("due"),amount:Number(d.get("amount")),status:"For Review"};
 if(invoices.some(x=>x.number.toLowerCase()===item.number.toLowerCase())){showToast("That invoice number already exists.");return;}
 invoices.push(item);form.reset();dialog.close();save();go("review");showToast("Invoice added to review queue.");
});
render();
