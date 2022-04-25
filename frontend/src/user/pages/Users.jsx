import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Redi Guleksi",
      image:
        "https://www.pexels.com/photo/man-and-woman-holding-vinyl-records-against-faces-7544626/",
      places: 3,
    },
  ]; // Dummy constant

  return <UsersList items={USERS} />;
};

export default Users;
