import axios from "axios";

export default axios.create({
  baseURL: "https://knklvl/api",
  headers: {
    "Content-type": "application/json"
  }
});
