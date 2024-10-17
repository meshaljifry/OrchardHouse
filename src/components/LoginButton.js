import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function Test() {
  const navigate = useNavigate();

  const handleLoginRoute = () => {
    navigate("/login");
  };

  return (
    <Button color="primary" onPress={handleLoginRoute}>
      Go to Login
    </Button>
  );
}
