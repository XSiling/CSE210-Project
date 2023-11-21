//Fetch data from backend
import axios from "axios";

axios.get('/api/group')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));

axios.get('/api/post')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));

axios.get('/api/person')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));

axios.get('/api/profile')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));