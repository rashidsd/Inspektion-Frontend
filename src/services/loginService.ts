import axios from "../api/apiConfig";

const userLogin = async (user: any) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/login", user)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { userLogin };
