function createList(items, containerId) {
  // Find the container element
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container not found");
    return;
  }

  // Create a list element
  const list = document.createElement("ul");

  // Iterate over the items and add them to the list
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.appendChild(listItem);
  });

  // Append the list to the container
  container.appendChild(list);
}

const items = ["Apple", "Banana", "Cherry"];

document.addEventListener("DOMContentLoaded", function () {
  createList(items, "listContainer1");
  createList(items, "listContainer2");
  createList(items, "listContainer3");
});
