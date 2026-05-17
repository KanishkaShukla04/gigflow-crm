import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({
  children
}: Props) => {

  const userInfo = localStorage.getItem(
    "userInfo"
  );

  if (!userInfo) {

    return <Navigate to="/" />;

  }

  return children;

};

export default ProtectedRoute;