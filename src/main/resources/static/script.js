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
</script>
