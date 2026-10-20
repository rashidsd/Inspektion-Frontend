export default function useLocalStorage() {
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    return {
      id: parsedUser.id,
      user_type: parsedUser.user_type,
      name: parsedUser.user_name,
      client_id: parsedUser.client_id,
      vendor_id: parsedUser.vendor_id,
      token: parsedUser.token,
      roles: parsedUser.roles,
    };
  } else {
    return {
      user: null,
      id: 0,
      name: "",
      token: null,
      user_type: "",
      client_id: "",
      vendor_id: "",
      roles: [],
    };
  }
}
