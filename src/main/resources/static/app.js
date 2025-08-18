const baseUrl = '/items';
let currentItemId = null;

// Simple alert helper
function notify(msg) {
  alert(msg);
}

// Load and render all items
async function loadItems() {
  try {
    const res = await fetch(baseUrl);
    const items = await res.json();
    const tbody = document.getElementById('items-tbody');
    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="4">No items</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(item => `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>
          <button data-action="view-subs" data-id="${item.id}">Subs</button>
          <button data-action="delete-item" data-id="${item.id}">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch {
    notify('Failed to load items');
  }
}

// Load and render subitems for one item
async function loadSubItems(itemId, itemName) {
  try {
    const res = await fetch(`${baseUrl}/${itemId}/subitems`);
    const subs = await res.json();
    currentItemId = itemId;

    document.getElementById('subitem-section').style.display = 'block';
    document.getElementById('subitem-title').textContent = `SubItems for: ${itemName}`;

    const tbody = document.getElementById('subitems-tbody');
    if (!subs.length) {
      tbody.innerHTML = '<tr><td colspan="4">No subitems</td></tr>';
      return;
    }
    tbody.innerHTML = subs.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.description}</td>
        <td>
          <button data-action="delete-sub" data-id="${s.id}">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch {
    notify('Failed to load subitems');
  }
}

// Delegate button clicks
document.body.addEventListener('click', async e => {
  const { action, id } = e.target.dataset;

  if (action === 'delete-item') {
    if (!confirm('Delete this item?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadItems();
  }

  if (action === 'view-subs') {
    const name = e.target.closest('tr').children[1].textContent;
    loadSubItems(id, name);
  }

  if (action === 'delete-sub') {
    if (!confirm('Delete this subitem?')) return;
    await fetch(`${baseUrl}/${currentItemId}/subitems/${id}`, { method: 'DELETE' });
    const title = document.getElementById('subitem-title').textContent.split(': ')[1];
    loadSubItems(currentItemId, title);
  }
});

// Create item
document.getElementById('create-item-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value.trim(),
    description: form.description.value.trim()
  };
  if (!data.name) return;
  await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  form.reset();
  loadItems();
});

// Create subitem
document.getElementById('create-subitem-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentItemId) return;
  const form = e.target;
  const data = {
    name: form.name.value.trim(),
    description: form.description.value.trim()
  };
  if (!data.name) return;
  await fetch(`${baseUrl}/${currentItemId}/subitems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  form.reset();
  const title = document.getElementById('subitem-title').textContent.split(': ')[1];
  loadSubItems(currentItemId, title);
});


window.addEventListener('DOMContentLoaded', loadItems);
