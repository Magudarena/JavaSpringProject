<!-- index.html -->
<form onsubmit="submitForm(event)">
  <input type="text" id="name" />
  <button type="submit">Wyślij</button>
</form>

<script>
  function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    fetch("/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name })
    })
    .then(res => res.json())
    .then(data => console.log(data));
  }

  document.getElementById('subitem-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('subitem-name').value;
    const description = document.getElementById('subitem-description').value;
    const itemId = document.getElementById('item-id').value;

    const response = await fetch(`/items/${itemId}/subitems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });

    if (response.ok) {
      alert('SubItem added!');
    } else {
      alert('Error');
    }
  });


  async function addSubItem(itemId, name, description) {
    const res = await fetch(`/items/${itemId}/subitems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    return json(res);
  }

  async function fetchSubItems(itemId) {
    const res = await fetch(`/items/${itemId}/subitems`);
    return json(res);
  }

document.getElementById('subitem-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('subitem-name').value.trim();
  const description = document.getElementById('subitem-description').value.trim();
  const itemId = document.getElementById('subitem-item').value.trim();

  if (!name || !itemId) return toast('Name and ID missing');

  try {
    await fetch('/subitems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        item: { id: parseInt(itemId) }
      })
    });
    toast('SubItem added');
    document.getElementById('subitem-form').reset();
  } catch {
    toast('Error');
  }
});


</script>
