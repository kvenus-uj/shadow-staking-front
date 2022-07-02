import http from "../http-common";

const createATA = data => {
  return http.post("/tutorials/createTA", data);
};

const createLTA = data => {
  return http.post("/tutorials/createLTA", data);
};

const mintKage = data => {
  return http.post("/tutorials/mintKage", data);
};

const getAll = () => {
  return http.get("/tutorials");
};

const get = id => {
  return http.get(`/tutorials/${id}`);
};

const create = data => {
  return http.post("/tutorials", data);
};

const update = (id, data) => {
  return http.put(`/tutorials/${id}`, data);
};

const remove = id => {
  return http.delete(`/tutorials/${id}`);
};

const removeAll = () => {
  return http.delete(`/tutorials`);
};

const getState = (wallet, quest) => {
  return http.get(`/tutorials/getState?wallet=${wallet}&quest=${quest}`);
}

const getRemainings = (wallet, quest) => {
  return http.get(`/tutorials/getRemainings?wallet=${wallet}&quest=${quest}`);
}

const updateState = data => {
  return http.post(`/tutorials/updateState`, data);
}

const updateRemainings = data => {
  return http.post(`/tutorials/updateRemainings`, data);
}

const findByTitle = (wallet, quest) => {
  return http.get(`/tutorials?wallet=${wallet}&quest=${quest}`);
};

const shadowMint = data => {
  return http.post('/tutorials/shadowMint', data);
}

const TutorialService = {
  shadowMint,
  createATA,
  createLTA,
  mintKage,
  getAll,
  getState,
  updateState,
  getRemainings,
  updateRemainings,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle
};

export default TutorialService;
