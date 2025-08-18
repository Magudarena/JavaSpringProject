const baseUrl = '/items';
let currentItemId = null;

const toastEl = document.getElementById('toast');
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  setTimeout(() => toastEl.hidden = true, 2000);
}

// -- Fetch helper --
async function api(path, opts = {}) {
  const res = await fetch(`${baseUrl}${path}`, opts);
  if (!res.ok) throw new Error();
  return res.status !== 204 ? await res.json() : null;
}

// -- CRUD dla Items --
const ItemAPI = {
  all: () => api(''),
  create: data => api('', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}),
  delete: id => api(`/${id}`, { method: 'DELETE' })
};

const SubAPI = {
  list: itemId => api(`/${itemId}/subitems`),
  create: (itemId, data) => api(`/${itemId}/subitems`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}),
  update: (itemId, id, data) => api(`/${itemId}/subitems/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}),
  delete: (itemId, id) => api(`/${itemId}/subitems/${id}`, { method:'DELETE'})
};

function renderTable(tbodyEl, rowsHtml) {
  tbodyEl.innerHTML = rowsHtml || '<tr><td colspan="4" class="muted">Brak danych.</td></tr>';
}

function renderItems(items) {
  const html = items.map(i => `
    <tr>
      <td>${i.id}</td>
      <td>${i.name}</td>
      <td>${i.description}</td>
      <td class="row-actions">
        <button data-action="sub" data-id="${i.id}">SubItemy</button>
        <button data-action="del-item" data-id="${i.id}">Usuń</button>
      </td>
    </tr>
  `).join('');
  renderTable(document.getElementById('items-tbody'), html);
}

function renderSubs(subs) {
  const html = subs.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.description}</td>
      <td class="row-actions">
        <button data-action="edit-sub" data-id="${s.id}">Edytuj</button>
        <button data-action="del-sub"  data-id="${s.id}">Usuń</button>
      </td>
    </tr>
  `).join('');
  renderTable(document.getElementById('subitems-tbody'), html);
}

async function loadItems() {
  try { renderItems(await ItemAPI.all()); }
  catch { toast('Błąd ładowania Itemów'); }
}

document.getElementById('create-form').addEventListener('submit', async e => {
  e.preventDefault();
  const data = { name: e.target.name.value.trim(), description: e.target.description.value.trim() };
  if (!data.name) return toast('Set the name');
  try {
    await ItemAPI.create(data);
    e.target.reset();
    loadItems(); toast('Item added');
  } catch { toast('Error'); }
});

document.getElementById('reload-btn').onclick = loadItems;

document.body.addEventListener('click', async e => {
  const action = e.target.dataset.action;
  const id     = e.target.dataset.id;

  if (action === 'del-item' && confirm('Usuń Item?')) {
    try { await ItemAPI.delete(id); loadItems(); toast('Item deleted'); }
    catch { toast('Error'); }
  }

  if (action === 'sub') {
    currentItemId = id;
    document.getElementById('subitem-section').hidden = false;
    document.getElementById('subitem-title').textContent = `SubItemy dla: ${id}`;
    try { renderSubs(await SubAPI.list(id)); }
    catch { toast('Error'); }
  }

  if (action === 'del-sub' && confirm('Delete SubItem?')) {
    try {
      await SubAPI.delete(currentItemId, id);
      renderSubs(await SubAPI.list(currentItemId));
      toast('SubItem deleted');
    } catch { toast('Error'); }
  }

  if (action === 'edit-sub') {
    const subs = await SubAPI.list(currentItemId);
    const sub = subs.find(s => s.id == id);
    document.getElementById('sub-name').value = sub.name;
    document.getElementById('sub-description').value = sub.description;
    document.getElementById('subitem-form').dataset.editId = id;
  }
});

document.getElementById('subitem-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = e.target['name'].value.trim();
  const desc = e.target['description'].value.trim();
  const editId = e.target.dataset.editId;

  if (!name) return toast('Add SubItem name');
  try {
    if (editId) {
      await SubAPI.update(currentItemId, editId, { name, description: desc });
      delete e.target.dataset.editId;
      toast('SubItem updated');
    } else {
      await SubAPI.create(currentItemId, { name, description: desc });
      toast('SubItem added');
    }
    e.target.reset();
    renderSubs(await SubAPI.list(currentItemId));
  } catch {
    toast('Error');
  }
});

// start
loadItems();
