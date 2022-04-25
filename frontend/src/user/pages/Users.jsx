import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Redi Guleksi",
      image: "http://127.0.0.1:3001/src/temp/images/user-image.jpg",
      places: 3,
    },
  ]; // Dummy constant

  return <UsersList items={USERS} />;
};

export default Users;
